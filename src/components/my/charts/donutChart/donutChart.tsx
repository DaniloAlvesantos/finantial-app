"use client";

import { Pie, PieChart } from "recharts";
import { chartConfigDefault } from "../chartTypes";

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
interface DonutChartProps {
  chartData: {
    ticker: string;
    percentage: number;
    fill:string;
  }[];
  title:string;
}

export function DonutChart({ chartData, title }: DonutChartProps) {
  return (
    <Card className="flex flex-col shadow-none w-[20rem] border-none">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
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
