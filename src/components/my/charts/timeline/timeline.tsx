"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { currencyFormatter } from "@/lib/currencyFormatter";

export interface timelineChartProps {
  chartConfig: ChartConfig;
  chartData: any[];
  title: string;
  descrip: string;
}

export const TimelineChart = (props: timelineChartProps) => {
  const { chartConfig, chartData, descrip, title } = props;

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
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{descrip}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              accessibilityLayer
              margin={{ left: 12, right: 12 }}
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
                // scale="sqrt"
              />
              <YAxis
                axisLine={{ stroke: "#E5E7EB" }}
                tickMargin={8}
                tickFormatter={(value) => currencyFormatter.format(value)}
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
                        {chartConfig[name as keyof typeof chartConfig]?.label ||
                          name}
                        <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                          {currencyFormatter.format(Number(value))}
                        </div>
                      </>
                    )}
                  />
                }
              />
              <defs>
                {Array.from({ length: howManyItems }).map((_, idx) => {
                  const i = idx + 1;
                  return (
                    <linearGradient
                      id={"fillItem" + i}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                      key={idx}
                    >
                      <stop
                        offset="5%"
                        stopColor={`var(--color-item${i})`}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={`var(--color-item${i})`}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  );
                })}
              </defs>
              {Array.from({ length: howManyItems }).map((_, idx) => {
                const i = idx + 1;
                return (
                  <Area
                    dataKey={`item${i}`}
                    type="natural"
                    fill={`url(#fillItem${i})`}
                    fillOpacity={0.4}
                    stroke={`var(--color-item${i})`}
                    stackId="a"
                    key={idx}
                  />
                );
              })}

              <ChartLegend content={<ChartLegendContent />}  />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
