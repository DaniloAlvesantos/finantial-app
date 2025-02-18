import { TotalWalletsCalcProps } from "@/utils/submitChart";

export interface BacktestTableProps {
  tableData: {
    symbol: string;
    values: TotalWalletsCalcProps;
  }[];
}
