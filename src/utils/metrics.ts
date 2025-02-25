export type extractRatiosProps = {
  percentReturns: {
    value: number;
    date: Date;
  }[];
};

export class Metrics {
  public monthlyReturns: number[] = [];
  private risk: number; // Selic

  constructor(monthlyReturns: number[]) {
    this.monthlyReturns = monthlyReturns;
    this.risk = 0;
  }

  downsideDeviationMonthly(
    monthlyReturns: number[],
    targetReturn: number
  ): number {
    const downsideReturns = monthlyReturns
      .map((ret) => ret - targetReturn)
      .filter((ret) => ret < 0);

    const squaredDownsideDeviations = downsideReturns.map((ret) =>
      Math.pow(ret, 2)
    );
    const downsideVariance =
      squaredDownsideDeviations.reduce((sum, val) => sum + val, 0) /
      (downsideReturns.length || 1);

    return Math.sqrt(downsideVariance);
  }

  sharpeRatio(monthlyReturns: number[], riskFreeRate: number): number {
    const excessReturns = monthlyReturns.map((ret) => ret - riskFreeRate);
    const meanExcessReturn =
      excessReturns.reduce((sum, ret) => sum + ret, 0) / excessReturns.length;
    const stdDev =
      Math.sqrt(
        excessReturns.reduce(
          (sum, ret) => sum + Math.pow(ret - meanExcessReturn, 2),
          0
        ) / (excessReturns.length - 1 || 1)
      ) || 1;

    return (meanExcessReturn / stdDev) * Math.sqrt(12); // Annualized
  }

  sortinoRatio(
    monthlyReturns: number[],
    riskFreeRate: number,
    targetReturn: number
  ): number {
    const downsideDeviation = this.downsideDeviationMonthly(
      monthlyReturns,
      targetReturn
    );
    const excessReturns = monthlyReturns.map((ret) => ret - riskFreeRate);
    const meanExcessReturn =
      excessReturns.reduce((sum, ret) => sum + ret, 0) / excessReturns.length;

    return meanExcessReturn / downsideDeviation;
  }

  treynorRatio(
    portfolioReturn: number,
    riskFreeRate: number,
    beta: number
  ): number {
    return beta !== 0 ? (portfolioReturn - riskFreeRate) / beta : 0;
  }

  arithmeticMeanAnnualized(monthlyReturns: number[]): number {
    const constMonthsInYear = 12;
    const totalMonths = monthlyReturns.length;
    const totalReturn = monthlyReturns.reduce((sum, ret) => sum + ret, 0);
    const meanMonthlyReturn = totalReturn / totalMonths;
    return meanMonthlyReturn * constMonthsInYear;
  }

  geometricMeanAnnualized(monthlyReturns: number[]): number {
    const constMonthsInYear = 12;
    const productOfReturns = monthlyReturns.reduce(
      (product, ret) => product * (1 + ret),
      1
    );
    const geometricMean =
      Math.pow(productOfReturns, 1 / monthlyReturns.length) - 1;
    return Math.pow(1 + geometricMean, constMonthsInYear) - 1;
  }

  perpetualWithdrawalRate(cagr: number): number {
    return cagr * 0.8;
  }
}
