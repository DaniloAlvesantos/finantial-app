"use client";

import { PeriodKeys } from "@/types/alphaVantageResponse";
import { BacktestForm } from "@/components/my/forms";
import { Header } from "@/components/my/header";
import { Calcs } from "@/utils/calc";
import { SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { TicketFormValues } from "@/components/my/forms/backtest/type";
import { Footer } from "@/components/my/footer/footer";
import { useMultStocks } from "@/hooks/useMultStocks";
import { BacktestCharts } from "@/components/my/charts/__backtestCharts";

type DefaultValues = {
  item1?: number;
  item2?: number;
  item3?: number;
  period: string;
};

type Wallet = {
  timeline: DefaultValues[];
  drawdowns: DefaultValues[];
  monthlyReturns: DefaultValues[];
  tickersPercentage: {
    ticker: string;
    percentage: number;
    fill: string;
  }[];
};

export type ChartDatas = {
  wallet1: Wallet;
  wallet2?: Wallet;
  wallet3?: Wallet;
};

export default function Home() {
  const [chartState, setChartState] = useState<ChartDatas | null>();
  const [tickets, setTickets] = useState<string[]>([]);
  const stocks = useMultStocks(tickets);

  const submit: SubmitHandler<TicketFormValues> = (values) => {
    const ticketsVal: string[] = [];
    values.tickets.map((ticket) => {
      if (ticket.ticket !== "") {
        ticketsVal.push(ticket.ticket);
      }
    });

    setTickets(ticketsVal);

    const validations: { isError: boolean; error: Error | null } = {
      isError: false,
      error: null,
    };

    Array.from({ length: stocks.query.length }, (_, i) => {
      if (stocks.query[i].isError) {
        validations.isError = true;
        validations.error = stocks.query[i].error;
      }
      return null;
    });

    if (validations.isError || !stocks) {
      return console.log(validations.error);
    }

    const totals: ReturnType<Calcs["generalValues"]>[] = [];
    const chartsDatas: ChartDatas = {
      wallet1: {
        timeline: [],
        drawdowns: [],
        monthlyReturns: [],
        tickersPercentage: [],
      },
    };

    for (let idx = 0; idx < ticketsVal.length; idx++) {
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

      const initialInvestiment =
        ticketsVal.length > 1
          ? Number(values.budget.initialInvestiment) *
            (Number(values.tickets[idx].wallet1) / 100)
          : Number(values.budget.initialInvestiment);

      const calcs = new Calcs();
      const calcRes = calcs.generalValues({
        periodValues,
        periods,
        initialInvestiment: initialInvestiment,
      });

      totals.push(calcRes);

      chartsDatas.wallet1.tickersPercentage.push({
        ticker: ticketsVal[idx],
        percentage: Number(values.tickets[idx].wallet1),
        fill: `hsl(var(--chart-${idx + 1}))`,
      });
    }

    const totalTimeline: number[] = [0];
    const totalDrawdowns: number[] = [0];
    const totalMonthlyRetuns: number[] = [0];

    Array.from({ length: totals.length }, (_, idx) => {
      for (let i = 0; i < totals[idx].timeline.length; i++) {
        if (totalTimeline[i] !== undefined) {
          totalTimeline[i] += Number(totals[idx].timeline[i].value);
          totalDrawdowns[i] += Number(totals[idx].drawdowns[i].value * -1);
          totalMonthlyRetuns[i] += Number(totals[idx].monthlyRetuns[i].value);
        } else {
          totalTimeline[i] = Number(totals[idx].timeline[i].value);
          totalDrawdowns[i] = Number(totals[idx].drawdowns[i].value * -1);
          totalMonthlyRetuns[i] = Number(totals[idx].monthlyRetuns[i].value);
        }
      }
    });

    // const totalAnnual: any[] = [...totalMonthlyRetuns, ...totals[0].periods];

    // const groupedByYear = totalAnnual.reduce((acc, entry) => {
    //   const year = new Date(entry.period).getFullYear();
    //   const monthlyReturn = entry.item1 / 100;
    //   if (!acc[year]) acc[year] = [];
    //   acc[year].push(1 + monthlyReturn);
    //   return acc;
    // }, {});
  
    // const annualReturns = Object.keys(groupedByYear).map((year) => {
    //   const product = groupedByYear[year].reduce(
    //     (acc: number, value: number) => acc * value,
    //     1
    //   );
    //   const annualReturn = (product - 1) * 100;
    //   return { period: Number(year), item1: annualReturn.toFixed(2) };
    // });

    Array.from({ length: totalTimeline.length }, (_, i) => {
      chartsDatas.wallet1.timeline.push({
        item1: totalTimeline[i],
        period: String(totals[0].periods[i]),
      });

      chartsDatas.wallet1.drawdowns.push({
        item1: totalDrawdowns[i],
        period: String(totals[0].periods[i]),
      });

      chartsDatas.wallet1.monthlyReturns.push({
        item1: totalMonthlyRetuns[i],
        period: String(totals[0].periods[i]),
      });
    });

    setChartState(chartsDatas);
  };

  return (
    <>
      <Header />
      <main className="flex flex-col item-center gap-8 p-4 sm:p-8">
        <BacktestForm onSubmit={submit} />
        <div className="w-full">
          {!chartState ? null : <BacktestCharts chartsDatas={chartState} />}
        </div>
      </main>
      <Footer />
    </>
  );
}
