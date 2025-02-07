/*
  add indexes to timeline and annualReturns
*/

import { SubmitResultChartDataProps, ChartDatas } from "@/types/chartsDatas";
import { indexesResultsProps } from "./indexs";

interface formatChartDatas {
  chartsDatas: SubmitResultChartDataProps;
}

export const formatChartDatas = ({ chartsDatas }: formatChartDatas) => {
  console.log(chartsDatas)
  if ("chartsDatas" in chartsDatas) {
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

  return {
    donutData,
    timelineData,
    drawdownsData,
    annualReturnsData,
  };
};
