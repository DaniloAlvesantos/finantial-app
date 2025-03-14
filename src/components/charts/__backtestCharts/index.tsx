import { useState, useEffect } from "react";
import { SubmitResultChartDataProps, TotalCalcs } from "@/types/chartsDatas";
import { DonutChart } from "../donutChart/donutChart";
import { TimelineChart } from "../timeline/timeline";
import { Drawdowns } from "../drawdowns/drawdowns";
import { AnnualReturns } from "../annualReturns/annualReturns";
import { formatChartDatas } from "@/utils/formatChartDatas";
import { SummaryTable } from "../../tables/summaryTable";
import { CardBackTestResults } from "@/components/cards/BackTestReults";
import { MonthlyReturnsTable } from "@/components/tables/monthlyReturnsTable";
import { MetricsTable } from "@/components/tables/metricsTable";
import { Metrics } from "@/utils/metrics";
import { Spin } from "@/components/loading/spin/spin";
import { useSelicCurrentMonth, useSelicBenchmark } from "@/hooks/useSelic";

interface BacktestChartsProps {
  chartsDatas: SubmitResultChartDataProps;
  isShared?: boolean;
}

interface ProcessedData {
  donutData: any[];
  timelineData: any[];
  drawdownsData: any[];
  annualReturnsData: any[];
  monthlyReturnData: any[];
  totalMetricsData: Record<string, any>;
  totalCalcsData: any[];
}

export const BacktestCharts = ({
  chartsDatas,
  isShared,
}: BacktestChartsProps) => {
  const [processedData, setProcessedData] = useState<ProcessedData | null>(
    null
  );
  let totalCalcs: TotalCalcs | undefined;
  if ("totalCalcs" in chartsDatas) {
    ({ totalCalcs } = chartsDatas);
  }

  const monthlyReturns = totalCalcs![0].values.monthlyReturn;
  const from = monthlyReturns[0].date;
  const to = monthlyReturns[monthlyReturns.length - 1].date;

  const selic = useSelicCurrentMonth();
  const benchmark = useSelicBenchmark({
    from: {
      month: String(from.getMonth() + 1),
      year: String(from.getFullYear()),
    },
    to: {
      month: String(to.getMonth() + 1),
      year: String(to.getFullYear()),
    },
  });

  useEffect(() => {
    const processData = async () => {
      if (!chartsDatas) return;

      const formatted = formatChartDatas({ chartsDatas });

      // Create and initialize all metrics
      const metricsInstances = formatted.metricsCreationData.map((data) => {
        const metrics = new Metrics({
          maxDrawdown: data.maxDrawdown,
          monthlyReturns: data.monthlyReturns,
          riskFreeRate: selic.data ?? 13,
          benchmarkValues: benchmark.data ?? [],
        });

        return {
          symbol: data.symbol,
          metrics,
        };
      });

      // Calculate metrics data
      const totalMetricsData = metricsInstances.reduce(
        (acc, { symbol, metrics }) => {
          acc[symbol] = metrics.calculateAllMetrics();
          return acc;
        },
        {} as Record<string, any>
      );

      setProcessedData({
        donutData: formatted.donutData,
        timelineData: formatted.timelineData,
        drawdownsData: formatted.drawdownsData,
        annualReturnsData: formatted.annualReturnsData,
        monthlyReturnData: formatted.monthlyReturnData,
        totalMetricsData,
        totalCalcsData: formatted.totalCalcsData,
      });
    };

    processData();
  }, [chartsDatas, benchmark.data, selic.data]);

  if (!processedData) {
    return <Spin />;
  }

  return (
    <section>
      {isShared ? null : (
        <>
          <hr className="mb-8" />
          <CardBackTestResults />
        </>
      )}
      <main className="flex flex-col gap-4">
        <SummaryTable tableData={processedData.totalCalcsData} />
        <DonutChart chartData={processedData.donutData} />
        <TimelineChart chartData={processedData.timelineData} />
        <AnnualReturns chartData={processedData.annualReturnsData} />
        <MonthlyReturnsTable tableData={processedData.monthlyReturnData} />
        <MetricsTable tableData={processedData.totalMetricsData} />
        <Drawdowns chartData={processedData.drawdownsData} />
      </main>
    </section>
  );
};
