import { ChartConfig } from "@/components/ui/chart";

export interface AreaChartProps {
  chartConfig: ChartConfig;
  chartData: any[];
  title: string;
  descrip: string;
  interval?: "month" | "year" | "day" 
}
