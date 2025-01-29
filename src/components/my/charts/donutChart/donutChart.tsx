"use client";

import { Pie, PieChart } from "recharts";
import { chartConfigDefault } from "../chartTypes";

import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
interface DonutChartProps {
  chartData: any[];
}

export function DonutChart({ chartData }: DonutChartProps) {
  return (
    <div className="flex flex-col items-center justify-center md:grid md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 md:justify-items-center">
      {Array.from({ length: chartData.length }, (_, idx) => (
        <Card
          key={`donut-${idx}`}
          className="flex flex-col-reverse sm:flex-col w-full sm:w-[20rem] md:flex-1"
        >
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
                  data={chartData[idx].value}
                  dataKey="percentage"
                  nameKey="ticker"
                  innerRadius={60}
                  isAnimationActive={false}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex justify-center items-center border-b sm:border-t p-4">
            <CardTitle>{`CARTEIRA - ${idx + 1}`}</CardTitle>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
