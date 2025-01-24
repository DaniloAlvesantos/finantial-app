import { TimelineChart } from "../timeline/timeline";
import { DonutChart } from "../donutChart/donutChart";
import { ChartDatas } from "@/app/page";
import { Drawdowns } from "../drawdowns/drawdowns";
import { AnnualReturns } from "../annualReturns/annualReturns";
import { useEffect } from "react";

interface BacktestChartsProps {
  chartsDatas: ChartDatas;
}

export const BacktestCharts = ({ chartsDatas }: BacktestChartsProps) => {
  if (!chartsDatas) {
    return;
  }

  console.log(chartsDatas);

  const timelineData: any[] = [];
  const drawdownsData: any[] = [];
  const annualReturnsData: any[] = [];

  for (let idx = 0; idx < chartsDatas.wallet1.timeline.length; idx++) {
    for (let WIndex = 1; WIndex <= 3; WIndex++) {
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
    for (let WIndex = 1; WIndex <= 3; WIndex++) {
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

  return (
    <div className="flex flex-col gap-4">
      <div id="donutsCharts" className="grid grid-cols-3">
        <DonutChart
          chartData={chartsDatas.wallet1.tickersPercentage}
          title="Carteira - 1"
        />
      </div>
      <TimelineChart
        chartData={timelineData}
        title="Valorização da carteira"
        descrip="Veja a valorização da carteira"
      />
      <Drawdowns
        chartData={drawdownsData}
        title="Drawdowns"
        descrip="Veja os periodos negativos"
      />
      <AnnualReturns
        chartData={annualReturnsData}
        title="Retorno Anual"
        descrip="Veja os retornos anuais"
      />
    </div>
  );
};
