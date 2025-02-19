import { SubmitResultChartDataProps } from "@/types/chartsDatas";

import { DonutChart } from "../donutChart/donutChart";
import { TimelineChart } from "../timeline/timeline";
import { Drawdowns } from "../drawdowns/drawdowns";
import { AnnualReturns } from "../annualReturns/annualReturns";

import { formatChartDatas } from "@/utils/formatChartDatas";
import { BackTestTable } from "../../tables/backtestTable";
import { CardBackTestResults } from "@/components/cards/BackTestReults";

interface BacktestChartsProps {
  chartsDatas: SubmitResultChartDataProps;
  isShared?: boolean;
}

export const BacktestCharts = ({
  chartsDatas,
  isShared,
}: BacktestChartsProps) => {
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
    <section>
      {isShared ? null : (
        <>
          <hr className="mb-8" />
          <CardBackTestResults />
        </>
      )}
      <main className="flex flex-col gap-4">
        <BackTestTable tableData={totalCalcsData} />
        <DonutChart chartData={donutData} />
        <TimelineChart chartData={timelineData} />
        <Drawdowns chartData={drawdownsData} />
        <AnnualReturns chartData={annualReturnsData} />
      </main>
    </section>
  );
};
