import { TimelineChart } from "../timeline/timeline";
import { useEffect } from "react";
import { table } from "@/components/ui";
import { DonutChart } from "../donutChart/donutChart";

interface BacktestChartsProps {
  chartsDatas: {
    timeline:any[];
    annualReturns: any[];
    drawdowns: any[];
  };
}

export const BacktestCharts = ({ chartsDatas }: BacktestChartsProps) => {
  useEffect(() => {
    console.log(chartsDatas)
  }, [chartsDatas]);

  if (!chartsDatas) {
    return;
  }

  return (
    <div>
      <table.Table>
        <table.TableHeader>
          <table.TableRow>
            <table.TableHead></table.TableHead>
          </table.TableRow>
        </table.TableHeader>
      </table.Table>
      <DonutChart />
      <TimelineChart
        chartData={chartsDatas.timeline}
        title="Valorização da carteira"
        descrip="Veja a valorização da carteira"
      />
    </div>
  );
};
