import { TimelineChart } from "../timeline/timeline";
import { DonutChart } from "../donutChart/donutChart";
import { ChartDatas } from "@/types/chartsDatas";
import { Drawdowns } from "../drawdowns/drawdowns";
import { AnnualReturns } from "../annualReturns/annualReturns";
import { formatChartDatas } from "@/utils/formatChartDatas";

interface BacktestChartsProps {
  chartsDatas: ChartDatas;
}

export const BacktestCharts = ({ chartsDatas }: BacktestChartsProps) => {
  if (!chartsDatas) {
    return;
  }

  const { annualReturnsData, donutData, drawdownsData, timelineData } =
    formatChartDatas({ chartsDatas });

  return (
    <div className="flex flex-col gap-4">
      <DonutChart chartData={donutData} />
      <TimelineChart
        chartData={timelineData}
        title="Valorização da carteira"
        descrip="Veja a valorização da carteira"
      />
      <Drawdowns
        chartData={drawdownsData}
        title="Drawdowns"
        descrip="Veja os periodos negativos"
      />
      <AnnualReturns
        chartData={annualReturnsData}
        title="Retorno Anual"
        descrip="Veja os retornos anuais"
      />
    </div>
  );
};
