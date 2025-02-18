"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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

interface AnnualReturnsProps {
  chartData: any[];
}

export function AnnualReturns(props: AnnualReturnsProps) {
  const { chartData } = props;

  if (!chartData || !chartData.length) {
    return;
  }

  const howManyItems = Object.keys(chartData[0]).reduce((acc, key) => {
    return key.includes("item") ? acc + 1 : acc;
  }, 0);

  const howManyIndexes = Object.keys(chartData[0]).filter(
    (key) => !key.includes("item") && key !== "period"
  );

  const xAxiosInterval = Math.round(chartData.length / 12);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Retorno Anual</CardTitle>
        <CardDescription>Veja os retornos anuais</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfigDefault}
          className="aspect-auto w-full h-[30rem]"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
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
                `${new Date(value).toLocaleDateString("pt-BR", {
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
                <Bar
                  dataKey={`item${i}`}
                  fill={`hsl(var(--chart-${i}))`}
                  radius={4}
                  key={idx}
                  isAnimationActive={false}
                  barSize={80}
                />
              );
            })}

            {howManyIndexes.map((index, i) => (
              <Bar
                dataKey={index}
                fill={`hsl(var(--${index}))`}
                radius={4}
                key={i + index}
                isAnimationActive={false}
                barSize={80}
              />
            ))}
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
