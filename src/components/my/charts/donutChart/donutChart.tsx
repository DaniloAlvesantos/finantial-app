"use client";

import { Pie, PieChart } from "recharts";
import { chartConfigDefault } from "../chartTypes"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { ticker: "IBM", percentage: 50, fill:"hsl(var(--chart-1))" },
  { ticker: "TSCO.LON", percentage: 50, fill:"hsl(var(--chart-2))" },
];

interface DonutChartProps {
    chartData: {
        ticker:string;
        percentage: number;
    }
}

export function DonutChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Carteira-1</CardTitle>
        <CardDescription>Porcentagens - Ações</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfigDefault}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="percentage"
              nameKey="ticker"
              innerRadius={60}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
