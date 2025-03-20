import { ChartDatas } from "@/types/chartsDatas";
import { TicketFormValues } from "@/components/forms/backtest/type";
import { Calcs } from "./calcs";
import { AlphaVantageResponse, PeriodKeys } from "@/types/alphaVantageResponse";
import { UseQueryResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { govResponse } from "@/types/govResponse";
import { IndexesCalc } from "./indexes";
import { filterDataByPeriod } from "./filterDataByPeriod";

const extractRequestedWallets = (values: TicketFormValues): Array<string> => {
  const requestedWallets = new Set<string>();

  values.tickets.forEach((ticket) => {
    Object.keys(ticket).forEach((walletKey) => {
      if (
        walletKey.startsWith("wallet") &&
        ticket[walletKey as keyof ChartDatas] !== null &&
        Number(ticket[walletKey as keyof ChartDatas]) > 0
      ) {
        requestedWallets.add(walletKey);
      }
    });
  });

  return Array.from(requestedWallets).sort();
};

const initializeChartData = (walletKeys: Array<string>): ChartDatas => {
  const chartsDatas: ChartDatas = {} as ChartDatas;

  walletKeys.forEach((walletKey) => {
    chartsDatas[walletKey as keyof ChartDatas] = {
      timeline: [],
      drawdowns: [],
      monthlyReturns: [],
      tickersPercentage: [],
      annulReturns: [],
    };
  });

  return chartsDatas;
};
interface ProcessTicketsProps {
  values: TicketFormValues;
  stocksData: (AlphaVantageResponse | undefined)[];
  chartsDatas: ChartDatas;
  walletKey: string;
}

const processTickets = ({
  values,
  stocksData,
  chartsDatas,
  walletKey,
}: ProcessTicketsProps): ReturnType<Calcs["generalValues"]>[] => {
  const totals: ReturnType<Calcs["generalValues"]>[] = [];

  values.tickets.forEach((ticket, idx) => {
    if (Number(ticket[walletKey as keyof ChartDatas]) > 0) {
      const monthlyData = stocksData[idx]?.[PeriodKeys.monthly];
      if (!monthlyData) {
        console.log("Monthly data is undefined.");
        return;
      }

      const periodsRes = filterDataByPeriod({
        data: monthlyData,
        interval: values.period,
      });

      if (!periodsRes || Array.isArray(periodsRes)) return;

      const { periods, periodValues, dividendsValues, sharesPrice } =
        periodsRes;

      const calcs = new Calcs();
      const calcRes = calcs.generalValues({
        periodValues,
        periods,
        initialInvestiment:
          values.tickets.length > 1
            ? Number(values.budget.initialInvestiment) *
              (Number(ticket[walletKey as keyof ChartDatas]) / 100)
            : Number(values.budget.initialInvestiment),
        monthlyInvest:
          values.tickets.length > 1
            ? Number(values.budget.monthlyInvestiment) *
              (Number(ticket[walletKey as keyof ChartDatas]) / 100)
            : Number(values.budget.monthlyInvestiment),
        dividends: values.config.PROCEEDS ? dividendsValues : undefined,
        sharesPrice: values.config.PROCEEDS ? sharesPrice : undefined,
      });

      totals.push(calcRes);

      chartsDatas[walletKey as keyof ChartDatas]?.tickersPercentage.push({
        ticker: ticket.ticket,
        percentage: Number(ticket[walletKey as keyof ChartDatas]),
        fill: `hsl(var(--chart-${idx + 1}))`,
      });
    }
  });

  return totals;
};

interface AggregateChartDataProps {
  chartsDatas: ChartDatas;
  totals: ReturnType<typeof processTickets>;
  walletKey: string;
  values: TicketFormValues;
}

const aggregateChartData = ({
  chartsDatas,
  totals,
  walletKey,
  values,
}: AggregateChartDataProps) => {
  const currentWallet = walletKey as keyof ChartDatas;
  const totalTimeline: number[] = [];
  const totalDrawdowns: number[] = [];
  const totalAnnualReturns: number[] = [];
  const totalMonthlyReturns: number[] = [];

  totals.forEach((total, idx) => {
    total.timeline.forEach((_, i) => {
      if (!totalTimeline[i]) totalTimeline[i] = 0;
      if (!totalDrawdowns[i]) totalDrawdowns[i] = 0;
      if (!totalMonthlyReturns[i]) totalMonthlyReturns[i] = 0;

      totalTimeline[i] += Number(total.timeline[i].value);
      totalMonthlyReturns[i] += Number(total.monthlyReturn[i].value);
    });

    total.annualReturns.forEach((_, i) => {
      if (!totalAnnualReturns[i]) totalAnnualReturns[i] = 0;

      Number(values.tickets[idx][currentWallet]) !== 0
        ? (totalAnnualReturns[i] +=
            Number(total.annualReturns[i].value) *
            (Number(values.tickets[idx][currentWallet]) / 100))
        : (totalAnnualReturns[i] += Number(total.annualReturns[i].value));
    });
  });

  let peak = -Infinity;

  totalTimeline.forEach((value, i) => {
    const currentDate = String(totals[0].periods[i]);

    if (value > peak) peak = value;
    totalDrawdowns[i] = (value - peak) / peak;

    chartsDatas[currentWallet]?.timeline.push({
      value,
      period: currentDate,
    });

    chartsDatas[currentWallet]?.drawdowns.push({
      value: totalDrawdowns[i] * 100,
      period: currentDate,
    });

    chartsDatas[currentWallet]?.monthlyReturns.push({
      value: totalMonthlyReturns[i],
      period: currentDate,
    });
  });

  totals[
    Number(currentWallet.charAt(currentWallet.length))
  ].annualReturns.forEach((val, i) => {
    chartsDatas[currentWallet]?.annulReturns.push({
      period: String(val.period),
      value: totalAnnualReturns[i],
    });
  });
};

interface submitChartDataProps {
  values: TicketFormValues;
  stocks: {
    query: UseQueryResult<AxiosResponse<AlphaVantageResponse, any>, Error>[];
    data: (AlphaVantageResponse | undefined)[];
    isLoading: boolean;
  };
  indexes?: {
    data: (AlphaVantageResponse | govResponse[] | null)[];
    isLoading: boolean;
    isError: boolean;
    orderedIndexes: string[];
  };
}

export type TotalWalletsCalcProps = {
  cagr: number;
  totalInvested: number;
  cumulativeReturn: number;
  annualVolatility: number;
  maxDrawdown: number;
  totalDividends: number;
  totalShares: number;
  bestYear: number;
  worstYear: number;
  monthlyReturn: {
    value: number;
    date: Date;
  }[];
};

export const submitChartData = ({
  values,
  stocks,
  indexes,
}: submitChartDataProps) => {
  const requestedWallets = extractRequestedWallets(values);
  const chartsDatas = initializeChartData(requestedWallets);
  let totalWallets: {
    symbol: string;
    calcs: ReturnType<Calcs["generalValues"]>[];
  }[] = [];
  const {
    budget: { initialInvestiment, monthlyInvestiment },
    period,
  } = values;

  requestedWallets.forEach((walletKey, i) => {
    // totals of each ticker in each wallet
    const totals = processTickets({
      values,
      stocksData: stocks.data,
      chartsDatas,
      walletKey,
    });

    totalWallets.push({
      symbol: `Carteira-${i + 1}`,
      calcs: totals,
    });

    aggregateChartData({ chartsDatas, totals, walletKey, values });
  });

  const totalCalcs: {
    symbol: string;
    values: TotalWalletsCalcProps;
  }[] = [];

  totalWallets.forEach((wallet, idx) => {
    const currentWalletKey = `wallet${idx + 1}` as keyof ChartDatas;
    const currentWallet: TotalWalletsCalcProps = {
      cagr: 0,
      totalInvested: 0,
      cumulativeReturn: 0,
      annualVolatility: 0,
      maxDrawdown: 0,
      totalDividends: 0,
      totalShares: 0,
      bestYear: 0,
      worstYear: 0,
      monthlyReturn: [],
    };

    const bestYear = chartsDatas[currentWalletKey]
      ? Math.max(
          ...chartsDatas[currentWalletKey].annulReturns.map((val) => val.value)
        )
      : 0;

    const worstYear = chartsDatas[currentWalletKey]
      ? Math.min(
          ...chartsDatas[currentWalletKey].annulReturns.map((val) => val.value)
        )
      : 0;

    currentWallet.bestYear = Number(bestYear);
    currentWallet.worstYear = Number(worstYear);

    wallet.calcs.forEach((calc, i) => {
      const ticketPercentage =
        Number(values.tickets[i][currentWalletKey]) / 100;
      const cumulated = calc.cumulativeReturn * (ticketPercentage || 1);

      currentWallet.cagr += calc.cagr * (ticketPercentage || 1);
      currentWallet.annualVolatility +=
        calc.annualVolatility * (ticketPercentage || 1);
      currentWallet.maxDrawdown += calc.maxDrawdown * (ticketPercentage || 1);
      currentWallet.totalInvested +=
        calc.totalInvested * (ticketPercentage || 1);
      currentWallet.cumulativeReturn += cumulated;
      currentWallet.totalDividends +=
        calc.totalDividends * (ticketPercentage || 1);
      currentWallet.totalShares += calc.totalShares * (ticketPercentage || 1);
      calc.monthlyReturn.forEach((monthlyReturn, index) => {
        if (!currentWallet.monthlyReturn[index]) {
          currentWallet.monthlyReturn[index] = {
            value: 0,
            date: monthlyReturn.date,
          };
        }
        currentWallet.monthlyReturn[index].value +=
          monthlyReturn.value * (ticketPercentage || 1);
      });
    });

    totalCalcs.push({
      symbol: wallet.symbol,
      values: {
        ...currentWallet,
        maxDrawdown:
          chartsDatas[currentWalletKey] !== undefined
            ? Math.min(
                ...chartsDatas[currentWalletKey]?.drawdowns.map((d) => d.value)
              )
            : 0,
      },
    });
  });

  if (
    indexes?.data.length &&
    indexes.data.every((item) => item !== null || item !== undefined)
  ) {
    const indexesResults = new IndexesCalc({
      indexes,
      interval: period,
    }).calcValues({
      initialInvestiment: Number(initialInvestiment),
      monthlyInvest: Number(monthlyInvestiment),
    });

    return { chartsDatas, indexesResults, totalCalcs };
  }

  return { chartsDatas, totalCalcs };
};
