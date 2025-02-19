import {
  SubmitResultChartDataProps,
  ChartDatas,
  TotalCalcs,
} from "@/types/chartsDatas";
import { indexesResultsProps } from "./indexes";
import { TotalWalletsCalcProps } from "./submitChart";

interface FormatChartDatasProps {
  chartsDatas: SubmitResultChartDataProps;
}

export const formatChartDatas = ({ chartsDatas }: FormatChartDatasProps) => {
  let indexesData: indexesResultsProps | undefined;
  let totalCalcs: TotalCalcs | undefined;

  if ("chartsDatas" in chartsDatas) {
    ({ indexesResults: indexesData, totalCalcs, chartsDatas } = chartsDatas);
  }

  const wallets = Object.keys(chartsDatas);

  const donutData = wallets.map((wallet) => ({
    value: chartsDatas[wallet as keyof ChartDatas]?.tickersPercentage,
  }));

  const timelineData: Record<string, any>[] = [];
  const drawdownsData: Record<string, any>[] = [];
  const annualReturnsData: Record<string, any>[] = [];
  const totalCalcsData: {
    symbol: string;
    values: TotalWalletsCalcProps;
  }[] = [];

  chartsDatas.wallet1.timeline.forEach((_, idx) => {
    const timelineEntry: Record<string, any> = {
      period: chartsDatas.wallet1.timeline[idx].period,
    };
    const drawdownsEntry: Record<string, any> = {
      period: chartsDatas.wallet1.drawdowns[idx].period,
    };

    wallets.forEach((wallet, wIndex) => {
      timelineEntry[`item${wIndex + 1}`] =
        chartsDatas[wallet as keyof ChartDatas]?.timeline[idx].value;
      drawdownsEntry[`item${wIndex + 1}`] =
        chartsDatas[wallet as keyof ChartDatas]?.drawdowns[idx].value;
    });

    timelineData.push(timelineEntry);
    drawdownsData.push(drawdownsEntry);
  });

  chartsDatas.wallet1.monthlyReturns.forEach((_, idx) => {
    const annualReturnsEntry: Record<string, any> = {
      period: chartsDatas.wallet1.monthlyReturns[idx].period,
    };

    wallets.forEach((wallet, wIndex) => {
      annualReturnsEntry[`item${wIndex + 1}`] =
        chartsDatas[wallet as keyof ChartDatas]?.monthlyReturns[idx].value;
    });

    annualReturnsData.push(annualReturnsEntry);
  });

  if (indexesData?.length) {
    indexesData.forEach((index) => {
      if (index.name !== "IBOVESPA") {
        if (timelineData.length === index.results.periodValues.length) {
          index.results.periodValues.forEach((value, i) => {
            timelineData[i] = { ...timelineData[i], [index.name]: value };
          });
          totalCalcsData.push({
            symbol: index.name,
            values: index.calcResults!,
          });
        }
      } else {
        index.calcResults?.timeline.forEach((value, i) => {
          timelineData[i] = { ...timelineData[i], [index.name]: value.value };
          drawdownsData[i] = {
            ...drawdownsData[i],
            [index.name]: -Number(index.calcResults?.drawdowns[i].value),
          };
        });

        index.calcResults?.annualReturns.forEach((value, i) => {
          annualReturnsData[i] = {
            ...annualReturnsData[i],
            [index.name]: Number(value.value),
          };
        });

        totalCalcsData.push({ symbol: index.name, values: index.calcResults! });
      }
    });
  }

  totalCalcs!.forEach((calc) => {
    totalCalcsData.push({ symbol: calc.symbol, values: calc.values });
  });

  return {
    donutData,
    timelineData,
    drawdownsData,
    annualReturnsData,
    totalCalcsData,
  };
};
