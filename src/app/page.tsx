"use client";

import { ChartConfig } from "@/components/ui/chart";
import { AreaChartComp } from "@/components/my/charts/areaChart";
import { PeriodKeys } from "@/types/stockResponse";
import { useStocks } from "@/hooks/useStocks";
import { TableForm } from "@/components/my/forms";
import { Header } from "@/components/my/header";

const chartData: any[] = [
  { month: "Janeiro" },
  { month: "Fevereiro" },
  { month: "Março" },
  { month: "Abril" },
  { month: "Junho" },
  { month: "Julho" },
  { month: "Agosto" },
  { month: "Setembro" },
  { month: "Outubro" },
  { month: "Novembro" },
  { month: "Dezembro" },
];

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

  if (isError || !data) {
    return console.log(error);
  }

  const monthlyData = data[PeriodKeys.monthly];
  if (!monthlyData) {
    console.log("Monthly data is undefined.");
    return;
  }

  // The last 12 months from it
  const lastYear = Object.entries(monthlyData).reverse().slice(-12);

  chartData.forEach((item, i) => {
    item["item" + Object.entries(item).length] = Number(
      lastYear[i][1]["5. adjusted close"]
    );
  });

  return (
    <>
    <Header />
    <main className="p-8">
      <TableForm />
      <div className="w-1/2">
        <AreaChartComp
          chartConfig={chartConfig}
          chartData={chartData}
          title="Ultimos 12 meses"
          descrip="Vejas o ultimo ano da empresa IBM"
          interval="month"
        />
      </div>
    </main>
    </>
  );
}
