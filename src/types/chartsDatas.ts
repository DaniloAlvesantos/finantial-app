import { indexesResultsProps } from "@/utils/indexes";

type DefaultValues = {
  value: number;
  period: string;
};

type Wallet = {
  timeline: DefaultValues[];
  drawdowns: DefaultValues[];
  monthlyReturns: DefaultValues[];
  tickersPercentage: {
    ticker: string;
    percentage: number;
    fill: string;
  }[];
};

export type ChartDatas = {
  wallet1: Wallet;
  wallet2?: Wallet;
  wallet3?: Wallet;
};

export type SubmitResultChartDataProps =
  | ChartDatas
  | {
      chartsDatas: ChartDatas;
      indexesResults: indexesResultsProps | undefined;
    };
