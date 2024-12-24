"use client";

import { ChartConfig } from "@/components/ui/chart";
import { PeriodKeys } from "@/types/alphaVantageResponse";
import { useStocks } from "@/hooks/useStocks";
import { BacktestForm } from "@/components/my/forms";
import { Header } from "@/components/my/header";
import { Calcs } from "@/utils/calc";
import { TimelineChart } from "@/components/my/charts/timeline/timeline";
import { SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { TicketFormValues } from "@/components/my/forms/backtest/type";
import { Spin } from "@/components/my/loading/spin/spin";
import { Footer } from "@/components/my/footer/footer";

export default function Home() {
  const [chartState, setChartState] = useState<any[]>([]);
  const { data, error, isError } = useStocks("IBM");

  const chartData: any[] = [];

  let chartConfig = {
    item1: {
      label: "IBM",
      color: "hsl(var(--chart-1))",
    },
    item2: {
      label: "KO",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  useEffect(() => {
    console.count("Home");
    if (isError || !data) {
      return console.log(error);
    }

    const monthlyData = data[PeriodKeys.monthly];
    if (!monthlyData) {
      console.log("Monthly data is undefined.");
      return;
    }

    // The last 12 months from it
    // const lastYear = Object.entries(monthlyData).sort().reverse().slice(-12);
    const periods = Object.keys(monthlyData)
      .sort()
      .map((date) => new Date(date))
      .filter((date) => date.getFullYear() >= 2023);
    const periodValues = Object.entries(monthlyData)
      .sort()
      .filter((item) => new Date(item[0]).getFullYear() >= 2023)
      .map((item) => Number(item[1]["5. adjusted close"]));
    const calcs = new Calcs();
    const results = calcs.generalValues({
      periodValues,
      periods,
      initialInvestiment: 100,
    });

    periods.forEach((_, idx) => {
      chartData.push({
        item1: Number(results.timeline[idx]),
        period: String(periods[idx]),
      });
    });

    setChartState(chartData);
  }, [data]);

  const submit: SubmitHandler<TicketFormValues> = (values) => {
    console.log(values);

    for (let i = 0; i < values.tickets.length; i++) {
      console.count("Tickets fields");
    }
  };

  return (
    <>
      <Header />
      <main className="flex flex-col item-center gap-8 p-4 sm:p-8">
        <BacktestForm onSubmit={submit} />
        <div className="w-full">
          {data ? (
            <div>
              <TimelineChart
                chartConfig={chartConfig}
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
