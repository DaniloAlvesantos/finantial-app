"use client";

import * as React from "react";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { chartConfigDefault } from "../chartTypes";

export interface DrawdownsProps {
  chartData: any[];
  title: string;
  descrip: string;
}

export const Drawdowns = (props: DrawdownsProps) => {
  const { chartData, descrip, title } = props;

  if (!chartData || !chartData.length) {
    return;
  }

  const howManyItems = Object.keys(chartData[0]).reduce((acc, key) => {
    return key.includes("item") ? acc + 1 : acc;
  }, 0);

  const xAxiosInterval = Math.round(chartData.length / 12);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{descrip}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfigDefault}
          className="h-[30rem] w-full"
        >
            <LineChart
              data={chartData}
              accessibilityLayer
              margin={{ left: 12, right: 12, top: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="period"
                tickLine={false}
                axisLine={false}
                tickMargin={2}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date
                    .toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                    .toUpperCase();
                }}
                interval={xAxiosInterval}
                className="font-poppins font-normal text-xs"
                angle={-35}
                textAnchor="end"
                tick={{ fontSize: 10 }}
                minTickGap={1000}
                tickCount={5}
              />
              <YAxis
                axisLine={{ stroke: "#E5E7EB" }}
                tickMargin={8}
                tickFormatter={(value) => Number(value).toFixed(2) + "%"}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                className="font-poppins font-normal"
              />
              <ChartTooltip
                cursor={false}
                labelFormatter={(value) =>
                  `${new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}`
                }
                content={
                  <ChartTooltipContent
                    cursor={false}
                    formatter={(value, name, item, index) => (
                      <>
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                          style={
                            {
                              "--color-bg": `var(--color-${name})`,
                            } as React.CSSProperties
                          }
                        />
                        {chartConfigDefault[
                          name as keyof typeof chartConfigDefault
                        ]?.label || name}
                        <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                          {Number(value).toFixed(2) + "%"}
                        </div>
                      </>
                    )}
                  />
                }
              />

              {Array.from({ length: howManyItems }).map((_, idx) => {
                const i = idx + 1;
                return (
                  <Line
                    dataKey={`item${i}`}
                    type="linear"
                    fill={`url(#fillItem${i})`}
                    fillOpacity={0.4}
                    stroke={`var(--color-item${i})`}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                    key={idx}
                  />
                );
              })}

              <ChartLegend content={<ChartLegendContent />} />
            </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
