import {
  SubmitResultChartDataProps,
  ChartDatas,
  TotalCalcs,
} from "@/types/chartsDatas";
import { indexesResultsProps } from "./indexes";
import { TotalWalletsCalcProps } from "./submitChart";
import { Metrics } from "./metrics";

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
  const monthlyReturnData: Record<string, any>[] = [];
  const annualReturnsData: Record<string, any>[] = [];
  const totalCalcsData: {
    symbol: string;
    values: TotalWalletsCalcProps;
  }[] = [];
  const totalMetricsData: Record<string, any> = {};

  // Formating timeline, drawdown, monthlyReturns
  chartsDatas.wallet1.timeline.forEach((_, idx) => {
    const timelineEntry: Record<string, any> = {
      period: chartsDatas.wallet1.timeline[idx].period,
    };
    const drawdownsEntry: Record<string, any> = {
      period: chartsDatas.wallet1.drawdowns[idx].period,
    };

    const monthlyReturnsEntry: Record<string, any> = {
      period: chartsDatas.wallet1.monthlyReturns[idx].period,
    };

    wallets.forEach((wallet, wIndex) => {
      timelineEntry[`item${wIndex + 1}`] =
        chartsDatas[wallet as keyof ChartDatas]?.timeline[idx].value;
      drawdownsEntry[`item${wIndex + 1}`] =
        chartsDatas[wallet as keyof ChartDatas]?.drawdowns[idx].value;

      monthlyReturnsEntry[`Carteira-${wIndex + 1}`] = {
        percentage:
          chartsDatas[wallet as keyof ChartDatas]?.monthlyReturns[idx].value,
        value: chartsDatas[wallet as keyof ChartDatas]?.timeline[idx].value,
      };
    });

    timelineData.push(timelineEntry);
    drawdownsData.push(drawdownsEntry);
    monthlyReturnData.push(monthlyReturnsEntry);
  });

  // Formating annualReturns
  chartsDatas.wallet1.annulReturns.forEach((_, idx) => {
    const annualReturnsEntry: Record<string, any> = {
      period: chartsDatas.wallet1.annulReturns[idx].period,
    };

    wallets.forEach((wallet, wIndex) => {
      annualReturnsEntry[`item${wIndex + 1}`] =
        chartsDatas[wallet as keyof ChartDatas]?.annulReturns[idx].value;
    });

    annualReturnsData.push(annualReturnsEntry);
  });

  if (indexesData?.length) {
    indexesData.forEach((index) => {
      if (index.name !== "IBOVESPA") {
        if (timelineData.length === index.results.periodValues.length) {
          index.results.periodValues.forEach((value, i) => {
            timelineData[i] = { ...timelineData[i], [index.name]: value };
            monthlyReturnData[i] = {
              ...monthlyReturnData[i],
              [index.name]: {
                percentage: index.calcResults?.monthlyReturn[i].value,
                value,
              },
            };
          });

          index.name !== "IPCA"
            ? totalCalcsData.push({
                symbol: index.name,
                values: index.calcResults!,
              })
            : null;
        }
      } else {
        index.calcResults?.timeline.forEach((value, i) => {
          timelineData[i] = { ...timelineData[i], [index.name]: value.value };
          drawdownsData[i] = {
            ...drawdownsData[i],
            [index.name]: -Number(index.calcResults?.drawdowns[i].value),
          };
          monthlyReturnData[i] = {
            ...monthlyReturnData[i],
            [index.name]: {
              percentage: index.calcResults?.monthlyReturn[i].value,
              value: Number(value.value),
            },
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

  totalCalcsData.forEach((calc, i) => {
    const allZero = calc.values.monthlyReturn.every((val) => val.value === 0);
    if (!allZero) {
      const from = calc.values.monthlyReturn[0].date;
      const to =
        calc.values.monthlyReturn[calc.values.monthlyReturn.length - 1].date;

      const metrics = new Metrics(
        calc.values.monthlyReturn.map((val) => val.value),
        calc.values.maxDrawdown,
        {
          from: {
            month: String(from.getMonth() + 1),
            year: String(from.getFullYear()),
          },
          to: {
            month: String(to.getMonth() + 1),
            year: String(to.getFullYear()),
          },
        }
      );
      const metricsData = metrics.generalCalc();

      totalMetricsData[calc.symbol] = {
        ...metricsData,
      };
    }
  });

  return {
    donutData,
    timelineData,
    drawdownsData,
    annualReturnsData,
    totalCalcsData,
    monthlyReturnData,
    totalMetricsData,
  };
};
