import { ChartDatas } from "@/types/chartsDatas";
import { TicketFormValues } from "@/components/my/forms/backtest/type";
import { Calcs } from "./calc";
import { AlphaVantageResponse, PeriodKeys } from "@/types/alphaVantageResponse";
import { UseQueryResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface submitChartDataProps {
  values: TicketFormValues;
  stocks: {
    query: UseQueryResult<AxiosResponse<AlphaVantageResponse, any>, Error>[];
    data: (AlphaVantageResponse | undefined)[];
    isLoading: boolean;
  };
}

export const submitChartData = ({ values, stocks }: submitChartDataProps) => {
  const requestedWallets = new Set<string>();

  values.tickets.forEach((ticket) => {
    Object.keys(ticket).forEach((walletKey) => {
      if (
        walletKey.startsWith("wallet") &&
        ticket[walletKey as keyof ChartDatas] !== null &&
        Number(ticket[walletKey as keyof ChartDatas]) > 0
      ) {
        requestedWallets.add(walletKey);
      }
    });
  });

  const chartsDatas: ChartDatas = {} as ChartDatas;

  requestedWallets.forEach((walletKey) => {
    chartsDatas[walletKey as keyof ChartDatas] = {
      timeline: [],
      drawdowns: [],
      monthlyReturns: [],
      tickersPercentage: [],
    };

    const totals: ReturnType<Calcs["generalValues"]>[] = [];

    values.tickets.forEach((ticket, idx) => {
      if (Number(ticket[walletKey as keyof ChartDatas]) > 0) {
        const monthlyData = stocks.data[idx]?.[PeriodKeys.monthly];
        if (!monthlyData) {
          console.log("Monthly data is undefined.");
          return;
        }

        const periods = Object.keys(monthlyData)
          .sort()
          .map((date) => new Date(date))
          .filter((date) => date.getFullYear() >= 2015);

        const periodValues = Object.entries(monthlyData)
          .sort()
          .filter((item) => new Date(item[0]).getFullYear() >= 2015)
          .map((item) => Number(item[1]["5. adjusted close"]));

        const calcs = new Calcs();
        const calcRes = calcs.generalValues({
          periodValues,
          periods,
          initialInvestiment:
            values.tickets.length > 1
              ? Number(values.budget.initialInvestiment) *
                (Number(ticket[walletKey as keyof ChartDatas]) / 100)
              : Number(values.budget.initialInvestiment),
        });

        totals.push(calcRes);

        chartsDatas[walletKey as keyof ChartDatas]?.tickersPercentage.push({
          ticker: ticket.ticket,
          percentage: Number(ticket[walletKey as keyof ChartDatas]),
          fill: `hsl(var(--chart-${idx + 1}))`,
        });
      }
    });

    const totalTimeline: number[] = [];
    const totalDrawdowns: number[] = [];
    const totalMonthlyReturns: number[] = [];

    totals.forEach((total, idx) => {
      total.timeline.forEach((_, i) => {
        if (!totalTimeline[i]) totalTimeline[i] = 0;
        if (!totalDrawdowns[i]) totalDrawdowns[i] = 0;
        if (!totalMonthlyReturns[i]) totalMonthlyReturns[i] = 0;

        totalTimeline[i] += Number(total.timeline[i].value);
        totalDrawdowns[i] +=
          Number(total.drawdowns[i].value * -1) *
          (Number(values.tickets[idx][walletKey as keyof ChartDatas]) / 100);
        totalMonthlyReturns[i] +=
          Number(total.monthlyRetuns[i].value) *
          (Number(values.tickets[idx][walletKey as keyof ChartDatas]) / 100);
      });
    });

    totalTimeline.forEach((value, i) => {
      chartsDatas[walletKey as keyof ChartDatas]?.timeline.push({
        value,
        period: String(totals[0].periods[i]),
      });

      chartsDatas[walletKey as keyof ChartDatas]?.drawdowns.push({
        value: totalDrawdowns[i],
        period: String(totals[0].periods[i]),
      });
    });

    const totalAnnual = totalMonthlyReturns.map((value, idx) => ({
      value,
      period: totals[0].periods[idx],
    }));

    const groupedByYear = totalAnnual.reduce((acc, entry) => {
      const year = new Date(entry.period).getFullYear();
      const monthlyReturn = entry.value / 100;
      if (!acc[year]) acc[year] = [];
      acc[year].push(1 + monthlyReturn);
      return acc;
    }, {} as Record<number, number[]>);

    const annualReturns = Object.keys(groupedByYear).map((year) => {
      const product = groupedByYear[Number(year)].reduce(
        (acc, value) => acc * value,
        1
      );
      return {
        period: new Date(`01-01-${year}`),
        value: Number(((product - 1) * 100).toFixed(2)),
      };
    });

    annualReturns.forEach((val) => {
      chartsDatas[walletKey as keyof ChartDatas]?.monthlyReturns.push({
        period: String(val.period),
        value: val.value,
      });
    });
  });

  return chartsDatas;
};
