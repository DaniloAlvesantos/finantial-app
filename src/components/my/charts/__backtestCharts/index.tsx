import { TimelineChart } from "../timeline/timeline";
import { useEffect } from "react";
import { DonutChart } from "../donutChart/donutChart";
import { ChartDatas } from "@/app/page";
import { Drawdowns } from "../drawdowns/drawdowns";
import { AnnualReturns } from "../annualReturns/annualReturns";

interface BacktestChartsProps {
  chartsDatas: ChartDatas;
}

export const BacktestCharts = ({ chartsDatas }: BacktestChartsProps) => {
  useEffect(() => {
    console.log(chartsDatas)
  }, [chartsDatas]);

  if (!chartsDatas) {
    return;
  }

  return (
    <div className="flex flex-col gap-4">
      <div id="donutsCharts" className="grid grid-cols-3">
        <DonutChart chartData={chartsDatas.wallet1.tickersPercentage} title="Carteira - 1" />
      </div>
      <TimelineChart
        chartData={chartsDatas.wallet1.timeline}
        title="Valorização da carteira"
        descrip="Veja a valorização da carteira"
      />
      <Drawdowns chartData={chartsDatas.wallet1.drawdowns} title="Drawdowns" descrip="Veja os periodos negativos" />
      <AnnualReturns chartData={chartsDatas.wallet1.monthlyReturns} title="Retorno Anual" descrip="Veja os retornos anuais" />
    </div>
  );
};
