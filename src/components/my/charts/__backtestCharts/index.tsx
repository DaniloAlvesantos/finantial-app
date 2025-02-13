/*

  add calcs res to props and submitResultprops
  to add to tables

*/

import { SubmitResultChartDataProps } from "@/types/chartsDatas";

import { table } from "@/components/ui"
import { DonutChart } from "../donutChart/donutChart";
import { TimelineChart } from "../timeline/timeline";
import { Drawdowns } from "../drawdowns/drawdowns";
import { AnnualReturns } from "../annualReturns/annualReturns";

import { formatChartDatas } from "@/utils/formatChartDatas";

interface BacktestChartsProps {
  chartsDatas: SubmitResultChartDataProps;
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
