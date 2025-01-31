import { ChartDatas } from "@/types/chartsDatas";
import { TicketFormValues } from "@/components/my/forms/backtest/type";
import { Calcs } from "./calc";
import { AlphaVantageResponse, PeriodKeys } from "@/types/alphaVantageResponse";
import { UseQueryResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

const extractRequestedWallets = (values: TicketFormValues): Array<string> => {
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

  return Array.from(requestedWallets).sort();
};

const initializeChartData = (walletKeys: Array<string>): ChartDatas => {
  const chartsDatas: ChartDatas = {} as ChartDatas;

  walletKeys.forEach((walletKey) => {
    chartsDatas[walletKey as keyof ChartDatas] = {
      timeline: [],
      drawdowns: [],
      monthlyReturns: [],
      tickersPercentage: [],
    };
  });

  return chartsDatas;
};
interface ProcessTicketsProps {
  values: TicketFormValues;
  stocksData: (AlphaVantageResponse | undefined)[];
  chartsDatas: ChartDatas;
  walletKey: string;
}

const processTickets = ({
  values,
  stocksData,
  chartsDatas,
  walletKey,
}: ProcessTicketsProps) => {
  const totals: ReturnType<Calcs["generalValues"]>[] = [];

  values.tickets.forEach((ticket, idx) => {
    if (Number(ticket[walletKey as keyof ChartDatas]) > 0) {
      const monthlyData = stocksData[idx]?.[PeriodKeys.monthly];
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

  return totals;
};

interface AggregateChartDataProps {
  chartsDatas: ChartDatas;
  totals: ReturnType<typeof processTickets>;
  walletKey: string;
  values: TicketFormValues;
}

const aggregateChartData = ({
  chartsDatas,
  totals,
  walletKey,
  values,
}: AggregateChartDataProps) => {
  const totalTimeline: number[] = [];
  const totalDrawdowns: number[] = [];
  const totalMonthlyReturns: number[] = [];
  const currentWallet = walletKey as keyof ChartDatas;

  console.log(`${walletKey}`, totals);

  totals.forEach((total, idx) => {
    total.timeline.forEach((_, i) => {
      if (!totalTimeline[i]) totalTimeline[i] = 0;
      if (!totalDrawdowns[i]) totalDrawdowns[i] = 0;
      if (!totalMonthlyReturns[i]) totalMonthlyReturns[i] = 0;

      totalTimeline[i] += Number(total.timeline[i].value);

      Number(values.tickets[idx][currentWallet]) !== 0
        ? (totalDrawdowns[i] +=
            Number(total.drawdowns[i].value * -1) *
            (Number(values.tickets[idx][currentWallet]) / 100))
        : (totalDrawdowns[i] += Number(total.drawdowns[i].value * -1));

      Number(values.tickets[idx][currentWallet]) !== 0
        ? (totalMonthlyReturns[i] +=
            Number(total.monthlyRetuns[i].value) *
            (Number(values.tickets[idx][currentWallet]) / 100))
        : (totalMonthlyReturns[i] += Number(total.monthlyRetuns[i].value));
    });
  });

  totalTimeline.forEach((value, i) => {
    chartsDatas[currentWallet]?.timeline.push({
      value,
      period: String(totals[0].periods[i]),
    });

    chartsDatas[currentWallet]?.drawdowns.push({
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
    chartsDatas[currentWallet]?.monthlyReturns.push({
      period: String(val.period),
      value: val.value,
    });
  });
};

const extractPandemicPeriod = (periods: Date[], periodValues: number[]) => {
  const startPandemic = new Date("2020-01-01");
  const endPandemic = new Date("2021-12-31");

  const pandemicPeriods: { period: Date; value: number }[] = [];

  periods.forEach((date, index) => {
    if (date >= startPandemic && date <= endPandemic) {
      pandemicPeriods.push({
        period: date,
        value: periodValues[index],
      });
    }
  });

  return pandemicPeriods;
};

interface submitChartDataProps {
  values: TicketFormValues;
  stocks: {
    query: UseQueryResult<AxiosResponse<AlphaVantageResponse, any>, Error>[];
    data: (AlphaVantageResponse | undefined)[];
    isLoading: boolean;
  };
}

export const submitChartData = ({ values, stocks }: submitChartDataProps) => {
  const requestedWallets = extractRequestedWallets(values);
  const chartsDatas = initializeChartData(requestedWallets);

  requestedWallets.forEach((walletKey) => {
    const totals = processTickets({
      values,
      stocksData: stocks.data,
      chartsDatas,
      walletKey,
    });

    aggregateChartData({ chartsDatas, totals, walletKey, values });

    if (totals.length) {
      const periods = totals[0].periods;
      const periodValues = totals[0].timeline.map((t) => t.value);

      const pandemicData = extractPandemicPeriod(periods, periodValues);
      // console.log(`Pandemic Data for ${walletKey}:`, pandemicData);
    }
  });

  return chartsDatas;
};
