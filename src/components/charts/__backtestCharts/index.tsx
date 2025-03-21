import { useState, useEffect } from "react";
import { useSelicCurrentMonth, useSelicBenchmark } from "@/hooks/useSelic";

import { Metrics } from "@/utils/metrics";
import { formatChartDatas } from "@/utils/formatChartDatas";
import { SubmitResultChartDataProps, TotalCalcs } from "@/types/chartsDatas";

import { Drawdowns } from "../drawdowns/drawdowns";
import { TimelineChart } from "../timeline/timeline";
import { DonutChart } from "../donutChart/donutChart";
import { SummaryTable } from "../../tables/summaryTable";
import { AnnualReturns } from "../annualReturns/annualReturns";
import {
  CardBackTestResults,
  Spin,
  MonthlyReturnsTable,
  MetricsTable,
  PandemicStressTable,
} from "@/components";
import { extractPandemicStress } from "@/utils/extractPandemicStress";

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

  if (!processedData || benchmark.isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center">
        <p className="font-poppins font-medium animate-pulse">
          Buscando índices...
        </p>
        <Spin />
      </div>
    );
  }

  const pandemicStressData = extractPandemicStress({
    timelineData: processedData.timelineData,
  });

  return (
    <section>
      {isShared ? null : (
        <>
          <hr className="mb-8" />
          <CardBackTestResults />
        </>
      )}
      <main className="flex flex-col gap-4 mt-4">
        <SummaryTable tableData={processedData.totalCalcsData} />
        <DonutChart chartData={processedData.donutData} />
        <TimelineChart chartData={processedData.timelineData} />
        <AnnualReturns chartData={processedData.annualReturnsData} />
        <MonthlyReturnsTable tableData={processedData.monthlyReturnData} />
        <MetricsTable tableData={processedData.totalMetricsData} />
        <Drawdowns chartData={processedData.drawdownsData} />
        <PandemicStressTable data={pandemicStressData} />
      </main>
    </section>
  );
};
