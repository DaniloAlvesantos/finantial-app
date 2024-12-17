"use client";

import { ChartConfig } from "@/components/ui/chart";
import { AreaChartComp } from "@/components/my/charts/yearlyChart/yearlyChart";
import { PeriodKeys, TimeSeriesCommonData } from "@/types/stockResponse";
import { useStocks } from "@/hooks/useStocks";
import { TableForm } from "@/components/my/forms";
import { Header } from "@/components/my/header";
import { Calcs } from "@/utils/calc";
import { TimelineChart } from "@/components/my/charts/timeline/timeline";
import { useEffect } from "react";

// const chartData: any[] = [
//   { month: "Janeiro" },
//   { month: "Fevereiro" },
//   { month: "Março" },
//   { month: "Abril" },
//   { month: "Junho" },
//   { month: "Julho" },
//   { month: "Agosto" },
//   { month: "Setembro" },
//   { month: "Outubro" },
//   { month: "Novembro" },
//   { month: "Dezembro" },
// ];
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
  const { data, error, isError } = useStocks();
  useEffect(() => {
    if (isError || !data) {
      return console.log(error);
    }

    const monthlyData = data[PeriodKeys.monthly];
    if (!monthlyData) {
      console.log("Monthly data is undefined.");
      return;
    }
    // The last 12 months from it
    const lastYear = Object.entries(monthlyData).sort().reverse().slice(-12);
    const periods = Object.keys(monthlyData)
      .sort()
      .map((date) => new Date(date))
      .filter((date) => date.getFullYear() >= 2023);
    const periodValues = Object.entries(monthlyData)
      .sort()
      .filter((item) => new Date(item[0]).getFullYear() >= 2023)
      .map((item) => Number(item[1]["5. adjusted close"]))
    const calcs = new Calcs();
    const results = calcs.generalValues({
      periodValues,
      periods,
      initialInvestiment: 100,
    });

    // chartData.forEach((item, i) => {
    //   item["item1"] = Number(results.timeline[i]);
    //   item["year"] = String(periods[i])
    // });

    periods.forEach((_, idx) => {
      chartData.push({
        item1: Number(results.timeline[idx]),
        year: String(periods[idx]),
      });
    });

    console.log(results);
  }, [data]);

  return (
    <>
      <Header />
      <main className="flex flex-col item-center gap-8 p-4 sm:p-8">
        <TableForm />
        <div className="w-full">
          {/* {!isError ? (
            <AreaChartComp
              chartConfig={chartConfig}
              chartData={chartData}
              title="Ultimos 12 meses"
              descrip="Vejas o ultimo ano da empresa IBM"
              interval="month"
            />
          ) : null} */}
          {!!data ? (
            <TimelineChart
              chartConfig={chartConfig}
              chartData={chartData}
              title="Linha do tempo"
              descrip="Veja o total investido na IBM 2023-2024"
            />
          ) : "Carregando..."}
        </div>
      </main>
    </>
  );
}
