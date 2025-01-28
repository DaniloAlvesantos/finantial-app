import { TimelineChart } from "../timeline/timeline";
import { DonutChart } from "../donutChart/donutChart";
import { ChartDatas } from "@/app/page";
import { Drawdowns } from "../drawdowns/drawdowns";
import { AnnualReturns } from "../annualReturns/annualReturns";

interface BacktestChartsProps {
  chartsDatas: ChartDatas;
}

export const BacktestCharts = ({ chartsDatas }: BacktestChartsProps) => {
  if (!chartsDatas) {
    return;
  }

  const donutData: any[] = [];
  const timelineData: any[] = [];
  const drawdownsData: any[] = [];
  const annualReturnsData: any[] = [];

  console.log(chartsDatas);

  for (let i = 1; i <= 3; i++) {
    donutData.push({
      value: chartsDatas[`wallet${i}` as keyof ChartDatas]?.tickersPercentage,
    });
  }

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
      <DonutChart chartData={donutData} />
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
