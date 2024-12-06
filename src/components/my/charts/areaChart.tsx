import { TrendingUp } from "lucide-react";
import { CartesianGrid, XAxis, Area, AreaChart } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChartProps } from "./props";
import { Calcs } from "@/utils/calc";

export const AreaChartComp = (props: AreaChartProps) => {
  const { chartConfig, chartData, descrip, interval, title } = props;
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BRL",
  });

  const lastTwoMonth = chartData.slice(-2).reverse();
  const calc = new Calcs();
  const trendy = calc.trendy(lastTwoMonth[1].item1, lastTwoMonth[0].item1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-montserrat">{title}</CardTitle>
        <CardDescription className="font-poppins">{descrip}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />

            <ChartTooltip
              cursor={false}
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
              <linearGradient id="fillItem1" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-item1)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-item1)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillItem2" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-item2)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-item2)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="item2"
              type="natural"
              fill="url(#fillItem2)"
              fillOpacity={0.4}
              stroke="var(--color-item2)"
              stackId="a"
            />
            <Area
              dataKey="item1"
              type="natural"
              fill="url(#fillItem1)"
              fillOpacity={0.4}
              stroke="var(--color-item1)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium font-poppins leading-none">
              {trendy + "%"}
              <TrendingUp
                className={`h-4 w-4 ${
                  Number(trendy) < 0 ? "text-red-500" : "text-green-500"
                }`}
              />
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
