"use client";

import { PeriodKeys } from "@/types/alphaVantageResponse";
import { BacktestForm } from "@/components/my/forms";
import { Header } from "@/components/my/header";
import { Calcs } from "@/utils/calc";
import { TimelineChart } from "@/components/my/charts/timeline/timeline";
import { SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { TicketFormValues } from "@/components/my/forms/backtest/type";
import { Spin } from "@/components/my/loading/spin/spin";
import { Footer } from "@/components/my/footer/footer";
import { useMultStocks } from "@/hooks/useMultStocks";

export default function Home() {
  const [chartState, setChartState] = useState<any[]>([]);
  const [tickets, setTickets] = useState<string[]>();
  const stocks = useMultStocks(["IBM", "TSCO.LON"]);
  console.log(stocks);

  const chartData: any[] = [];

  const submit: SubmitHandler<TicketFormValues> = (values) => {
    // GETTING TICKETS
    const ticketsVal: string[] = [];
    values.tickets.map((ticket) => {
      ticketsVal.push(ticket.ticket);
    });

    setTickets(ticketsVal);

    // SETTING QUERY VALIDATIONS
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

    const results: { ticket: string; res: { value: number; date: Date } }[] =
      [];

    // LOOP
    for (let idx = 0; idx < values.tickets.length; idx++) {
      // GETTING VALUES
      const monthlyData = stocks.data[idx]?.[PeriodKeys.monthly];
      if (!monthlyData) {
        console.log("Monthly data is undefined.");
        return;
      }

      // FILTERING PERIODS
      const periods = Object.keys(monthlyData)
        .sort()
        .map((date) => new Date(date))
        .filter((date) => date.getFullYear() >= 2000);

      const periodValues = Object.entries(monthlyData)
        .sort()
        .filter((item) => new Date(item[0]).getFullYear() >= 2000)
        .map((item) => Number(item[1]["5. adjusted close"]));

      // CALCS
      const calcs = new Calcs();
      const calcRes = calcs.generalValues({
        periodValues,
        periods,
        initialInvestiment:
          Number(values.budget.initialInvestiment) *
          (Number(values.tickets[idx].wallet1) / 100),
      });
      console.log(calcRes);

      // PERCENTAGE

      console.log(values);
      periods.forEach((_, i) => {
        chartData.push({
          item1: Number(calcRes.timeline[i].value),
          period: String(calcRes.timeline[i].date),
        });
      });

      console.log(results);
    }

    setChartState(chartData);
  };

  return (
    <>
      <Header />
      <main className="flex flex-col item-center gap-8 p-4 sm:p-8">
        <BacktestForm onSubmit={submit} />
        <div className="w-full">
          {chartState ? (
            <div>
              <TimelineChart
                chartData={chartState}
                title="Linha do tempo"
                descrip="Veja os valores de periodo completo"
              />
            </div>
          ) : (
            <Spin />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
