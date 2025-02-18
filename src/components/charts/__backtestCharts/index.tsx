import { SubmitResultChartDataProps } from "@/types/chartsDatas";

import { DonutChart } from "../donutChart/donutChart";
import { TimelineChart } from "../timeline/timeline";
import { Drawdowns } from "../drawdowns/drawdowns";
import { AnnualReturns } from "../annualReturns/annualReturns";

import { formatChartDatas } from "@/utils/formatChartDatas";
import { BackTestTable } from "../../tables/backtestTable";

interface BacktestChartsProps {
  chartsDatas: SubmitResultChartDataProps;
}

export const BacktestCharts = ({ chartsDatas }: BacktestChartsProps) => {
  if (!chartsDatas) {
    return;
  }

  const {
    annualReturnsData,
    donutData,
    drawdownsData,
    timelineData,
    totalCalcsData,
  } = formatChartDatas({ chartsDatas });

  return (
    <div className="flex flex-col gap-4 mt-8">
      <DonutChart chartData={donutData} />
      <BackTestTable tableData={totalCalcsData} />
      <TimelineChart chartData={timelineData} />
      <Drawdowns chartData={drawdownsData} />
      <AnnualReturns chartData={annualReturnsData} />
    </div>
  );
};
