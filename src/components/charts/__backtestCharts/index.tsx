import { SubmitResultChartDataProps } from "@/types/chartsDatas";

import { DonutChart } from "../donutChart/donutChart";
import { TimelineChart } from "../timeline/timeline";
import { Drawdowns } from "../drawdowns/drawdowns";
import { AnnualReturns } from "../annualReturns/annualReturns";

import { formatChartDatas } from "@/utils/formatChartDatas";
import { SummaryTable } from "../../tables/summaryTable";
import { CardBackTestResults } from "@/components/cards/BackTestReults";
import { MonthlyReturnsTable } from "@/components/tables/monthlyReturnsTable";
import { MetricsTable } from "@/components/tables/metricsTable";

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
    monthlyReturnData,
    totalMetricsData,
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
        <SummaryTable tableData={totalCalcsData} />
        <DonutChart chartData={donutData} />
        <TimelineChart chartData={timelineData} />
        <AnnualReturns chartData={annualReturnsData} />
        <MonthlyReturnsTable tableData={monthlyReturnData} />
        <MetricsTable tableData={totalMetricsData} />
        <Drawdowns chartData={drawdownsData} />
      </main>
    </section>
  );
};
