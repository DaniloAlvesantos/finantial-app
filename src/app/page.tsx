"use client";

import { ChartConfig } from "@/components/ui/chart";
import { AreaChartComp } from "@/components/my/charts/yearlyChart/yearlyChart";
import { PeriodKeys } from "@/types/stockResponse";
import { useStocks } from "@/hooks/useStocks";
import { TableForm } from "@/components/my/forms";
import { Header } from "@/components/my/header";
import { Calcs } from "@/utils/calc";
import { TimelineChart } from "@/components/my/charts/timeline/timeline";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui";
import {
  TicketFormValues,
  backtestSchema,
} from "@/components/my/forms/backtest/type";

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

export default function Home() {
  const form = useForm<TicketFormValues>({
    resolver: zodResolver(backtestSchema),
    defaultValues: {
      tickets: Array.from({ length: 5 }, () => ({
        ticket: "",
        wallet1: null,
        wallet2: null,
        wallet3: null,
      })),
    },
  });

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
  }, [form]);

  const { data, error, isError } = useStocks("IBM");
  const submit: SubmitHandler<TicketFormValues> = (values) => {
    console.log(values);
    
  };
  return (
    <>
      <Header />
      <main className="flex flex-col item-center gap-8 p-4 sm:p-8">
        <Form.Form {...form}>
          <TableForm onSubmit={submit} />
          <div className="w-full">
            {chartData.length ? (
              <div>
                <TimelineChart
                  chartConfig={chartConfig}
                  chartData={chartData}
                  title="Linha do tempo"
                  descrip="Veja os valores de periodo completo"
                />
              </div>
            ) : (
              "Carregando..."
            )}
          </div>
        </Form.Form>
      </main>
    </>
  );
}
