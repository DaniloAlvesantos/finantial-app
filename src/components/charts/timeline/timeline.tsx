"use client";

import * as React from "react";
import {
  Area,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
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
import { currencyFormatter } from "@/lib/currencyFormatter";
import { chartConfigDefault } from "../chartTypes";

export interface timelineChartProps {
  chartData: any[];
}

export const TimelineChart = (props: timelineChartProps) => {
  const { chartData } = props;

  if (!chartData || !chartData.length) {
    return;
  }

  const howManyItems = Object.keys(chartData[0]).reduce((acc, key) => {
    return key.includes("item") ? acc + 1 : acc;
  }, 0);

  const xAxiosInterval = Math.round(chartData.length / 12);

  const howManyIndexes = Object.keys(chartData[0]).filter(
    (key) => !key.includes("item") && key !== "period"
  );

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Valorização da carteira</CardTitle>
          <CardDescription>Veja a valorização da carteira</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfigDefault}
          className="aspect-auto h-[15.625rem] w-full"
        >
          <ComposedChart
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
                  .toLocaleDateString("pt-BR", {
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
              tickMargin={-1}
              tickFormatter={(value) => currencyFormatter.format(value)}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              className="font-poppins font-normal"
            />
            <ChartTooltip
              cursor={false}
              labelFormatter={(value) =>
                `${new Date(value).toLocaleDateString("pt-BR", {
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
                        {currencyFormatter.format(Number(value))}
                      </div>
                    </>
                  )}
                />
              }
            />
            <defs>
              <linearGradient id={"fillItem1"} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={`var(--color-item1)`}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-item1)`}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            {howManyItems === 1 ? (
              <Area
                dataKey={`item1`}
                type="natural"
                fill={`url(#fillItem1)`}
                fillOpacity={0.4}
                stroke={`var(--color-item1)`}
                stackId={"a"}
              />
            ) : (
              Array.from({ length: howManyItems }).map((_, idx) => {
                const i = idx + 1;

                return (
                  <Line
                    dataKey={`item${i}`}
                    type="natural"
                    fill={`url(#fillItem${i})`}
                    fillOpacity={0.4}
                    stroke={`var(--color-item${i})`}
                    dot={false}
                    key={idx}
                  />
                );
              })
            )}

            {howManyIndexes.map((index, i) => {
              return (
                <Line
                  dataKey={index}
                  type="natural"
                  fill={`url(#fill${index})`}
                  fillOpacity={0.4}
                  stroke={`var(--color-${index})`}
                  dot={false}
                  key={index}
                />
              );
            })}

            <ChartLegend content={<ChartLegendContent />} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
