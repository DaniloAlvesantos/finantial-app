import { ChartConfig } from "@/components/ui/chart";
import { TimelineChart } from "../timeline/timeline";
import { useEffect } from "react";

interface BacktestChartsProps {
  chartDatas: {
    timeLine: any[];
    drawdown: any[];
  };
  chartConfig: ChartConfig;
}

export const BacktestCharts = ({
  chartDatas,
  chartConfig,
}: BacktestChartsProps) => {
  useEffect(() => {}, [chartDatas]);

  if (!chartDatas) {
    return;
  }

  return (
    <div>
      <TimelineChart
        chartConfig={chartConfig}
        chartData={chartDatas.timeLine}
        title="Linha do tempo"
        descrip="Veja os valores de periodo completo"
      />
    </div>
  );
};
