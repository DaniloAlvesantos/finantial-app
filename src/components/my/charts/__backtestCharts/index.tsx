import { ChartConfig } from "@/components/ui/chart";
import { TimelineChart } from "../timeline/timeline";
import { useEffect } from "react";
import { table } from "@/components/ui";

type chartDatas = {
  timeline: any[];
  drawdows: any[];
  monthlyReturns:any[];
  maxDrawdown: number;
  cagr: number;
  annualVotality: number;
}

interface BacktestChartsProps {
  wallets: chartDatas[];
  chartConfig: ChartConfig;
}

export const BacktestCharts = ({
  wallets,
  chartConfig,
}: BacktestChartsProps) => {
  useEffect(() => {}, [wallets]);

  if (!wallets) {
    return;
  }

  return (
    <div>
      <table.Table>
        <table.TableHeader>
          <table.TableRow>
            <table.TableHead></table.TableHead>
          </table.TableRow>
        </table.TableHeader>
      </table.Table>
      <TimelineChart
        chartConfig={chartConfig}
        chartData={wallets[0].timeline}
        title="Linha do tempo"
        descrip="Veja os valores de periodo completo"
      />
    </div>
  );
};
