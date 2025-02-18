import { SubmitResultChartDataProps } from "@/types/chartsDatas";

import { DonutChart } from "../donutChart/donutChart";
import { TimelineChart } from "../timeline/timeline";
import { Drawdowns } from "../drawdowns/drawdowns";
import { AnnualReturns } from "../annualReturns/annualReturns";

import { formatChartDatas } from "@/utils/formatChartDatas";
import { BackTestTable } from "../../tables/backtestTable";
import {
  GenerateBackTestPDFButton,
  ShareBackTestButton,
} from "@/components/buttons/shareBacktest";
import { File } from "lucide-react";

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
    <section>
      <hr />
      <span className="flex flex-col items-left mt-8">
        <h3 className="ml-4 font-poppins font-bold text-xl">Resultados</h3>
        <div>
          <ShareBackTestButton />
          <GenerateBackTestPDFButton />
        </div>
      </span>
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
