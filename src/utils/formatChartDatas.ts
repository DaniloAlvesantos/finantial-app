import { SubmitResultChartDataProps, ChartDatas } from "@/types/chartsDatas";
import { indexesResultsProps } from "./indexes";

interface formatChartDatas {
  chartsDatas: SubmitResultChartDataProps;
}

export const formatChartDatas = ({ chartsDatas }: formatChartDatas) => {
  let indexesData: undefined | indexesResultsProps;
  if ("chartsDatas" in chartsDatas) {
    indexesData = chartsDatas.indexesResults;
    chartsDatas = chartsDatas.chartsDatas;
  }

  const donutData: any[] = [];
  const timelineData: any[] = [];
  const drawdownsData: any[] = [];
  const annualReturnsData: any[] = [];

  for (let i = 1; i <= Object.keys(chartsDatas).length; i++) {
    donutData.push({
      value: chartsDatas[`wallet${i}` as keyof ChartDatas]?.tickersPercentage,
    });
  }

  for (let idx = 0; idx < chartsDatas.wallet1.timeline.length; idx++) {
    for (let WIndex = 1; WIndex <= Object.keys(chartsDatas).length; WIndex++) {
      if (timelineData[idx] !== undefined) {
        timelineData[idx] = {
          ...timelineData[idx],
          [`item${WIndex}`]:
            chartsDatas[`wallet${WIndex}` as keyof ChartDatas]?.timeline[idx]
              .value,
        };
        drawdownsData[idx] = {
          ...drawdownsData[idx],
          [`item${WIndex}`]:
            chartsDatas[`wallet${WIndex}` as keyof ChartDatas]?.drawdowns[idx]
              .value,
        };
      } else {
        timelineData.push({
          period: chartsDatas.wallet1.timeline[idx].period,
          [`item${WIndex}`]:
            chartsDatas[`wallet${WIndex}` as keyof ChartDatas]?.timeline[idx]
              .value,
        });
        drawdownsData.push({
          period: chartsDatas.wallet1.drawdowns[idx].period,
          [`item${WIndex}`]:
            chartsDatas[`wallet${WIndex}` as keyof ChartDatas]?.drawdowns[idx]
              .value,
        });
      }
    }
  }

  for (let idx = 0; idx < chartsDatas.wallet1.monthlyReturns.length; idx++) {
    for (let WIndex = 1; WIndex <= Object.keys(chartsDatas).length; WIndex++) {
      if (annualReturnsData[idx] !== undefined) {
        annualReturnsData[idx] = {
          ...annualReturnsData[idx],
          [`item${WIndex}`]:
            chartsDatas[`wallet${WIndex}` as keyof ChartDatas]?.monthlyReturns[
              idx
            ].value,
        };
      } else {
        annualReturnsData.push({
          period: chartsDatas.wallet1.monthlyReturns[idx].period,
          [`item${WIndex}`]:
            chartsDatas[`wallet${WIndex}` as keyof ChartDatas]?.monthlyReturns[
              idx
            ].value,
        });
      }
    }
  }

  if (indexesData !== undefined && indexesData.length) {
    indexesData.forEach((index) => {
      if (index.name !== "IBOVESPA") {
        if (timelineData.length === index.results.periodValues.length) {
          index.results.periodValues.forEach((value, i) => {
            timelineData[i] = { ...timelineData[i], [index.name]: value };
          });
        }
      } else {
        index.calcResults?.timeline.forEach((value, i) => {
          timelineData[i] = { ...timelineData[i], [index.name]: value.value };
          drawdownsData[i] = {
            ...drawdownsData[i],
            [index.name]: Number(index.calcResults?.drawdowns[i].value) * -1,
          };
        });
        index.calcResults?.annualReturns.forEach((value, i) => {
          annualReturnsData[i] = {
            ...annualReturnsData[i],
            [index.name]: Number(index.calcResults?.annualReturns[i].value),
          };
        });
      }
    });
  }

  return {
    donutData,
    timelineData,
    drawdownsData,
    annualReturnsData,
  };
};
