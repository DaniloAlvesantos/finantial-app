import { getSelicData } from "@/services/selic";

export type extractRatiosProps = {
  percentReturns: {
    value: number;
    date: Date;
  }[];
};

export class Metrics {
  public monthlyReturns: number[] = [];
  public risk: number | undefined; // Selic
  public maxDrawdown: number;

  constructor(monthlyReturns: number[], maxDrawdown: number) {
    this.monthlyReturns = monthlyReturns;
    this.maxDrawdown = maxDrawdown;
    this.initialize();
  }

  async initialize() {
    // this.risk = await this.getRiskValue();
    this.risk = 13 / 100;
  }

  async getRiskValue() {
    const selic = await getSelicData();

    if (!selic || !Array.isArray(selic)) return (this.risk = undefined);

    this.risk = Number(selic.sort()[selic.length - 1].valor);

    return this.risk;
  }

  sharpeRatio(): number {
    const riskFreeRate = this.risk || 0;
    const excessReturns = this.monthlyReturns.map((ret) => ret - riskFreeRate);
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

  arithmeticMeanMonthly(): number {
    return (
      this.monthlyReturns.reduce((sum, r) => sum + r, 0) /
      this.monthlyReturns.length
    );
  }

  arithmeticMeanAnnualized(): number {
    return this.arithmeticMeanMonthly() * 12;
  }

  geometricMean(): number {
    if (this.monthlyReturns.length === 0) return NaN;

    const validReturns = this.monthlyReturns.filter((r) => r > -1);
    if (validReturns.length === 0) return NaN;

    const product = validReturns.reduce((prod, r) => prod * (1 + r), 1);

    return Math.pow(product, 1 / validReturns.length) - 1;
  }

  geometricMeanAnnualized(): number {
    const geometricMeanDecimal = this.geometricMean();
    return Math.pow(1 + geometricMeanDecimal, 12) - 1;
  }

  standardDeviation(): number {
    const mean = this.arithmeticMeanMonthly();
    return Math.sqrt(
      this.monthlyReturns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) /
        (this.monthlyReturns.length - 1)
    );
  }

  standardDeviationAnnualized(): number {
    return this.standardDeviation() * Math.sqrt(12);
  }

  downsideDeviation(mar: number): number {
    const downsideReturns = this.monthlyReturns.map((r) =>
      Math.min(r - mar, 0)
    );
    return Math.sqrt(
      downsideReturns.reduce((sum, r) => sum + r * r, 0) /
        this.monthlyReturns.length
    );
  }

  sortinoRatio(): number {
    const riskFreeRateMonthly =
      Math.pow(1 + (this.risk || 0) / 100, 1 / 12) - 1;
    const downsideRisk = this.downsideDeviation(riskFreeRateMonthly);

    // Handle edge cases
    if (this.monthlyReturns.length === 0 || downsideRisk === 0) {
      return NaN; // Or handle it appropriately (e.g., return 0 or Infinity)
    }

    const meanReturn = this.arithmeticMeanMonthly();
    return (meanReturn - riskFreeRateMonthly) / downsideRisk;
  }

  treynorRatio(): number {
    return this.sharpeRatio() * this.standardDeviation();
  }

  calmarRatio(): number {
    return this.arithmeticMeanAnnualized() / this.maxDrawdown;
  }

  activeReturn(): number {
    return this.arithmeticMeanMonthly();
  }

  trackingError(): number {
    return this.standardDeviation();
  }

  informationRatio(): number {
    return this.activeReturn() / this.trackingError();
  }

  skewness(): number {
    const mean = this.arithmeticMeanMonthly();
    const stdDev = this.standardDeviation();
    return (
      this.monthlyReturns.reduce(
        (sum, r) => sum + Math.pow((r - mean) / stdDev, 3),
        0
      ) / this.monthlyReturns.length
    );
  }

  excessKurtosis(): number {
    const mean = this.arithmeticMeanMonthly();
    const stdDev = this.standardDeviation();
    return (
      this.monthlyReturns.reduce(
        (sum, r) => sum + Math.pow((r - mean) / stdDev, 4),
        0
      ) /
        this.monthlyReturns.length -
      3
    );
  }

  historicalVaR(p: number): number {
    const sortedReturns = [...this.monthlyReturns].sort((a, b) => a - b);
    return sortedReturns[Math.floor(p * sortedReturns.length)];
  }

  conditionalVaR(p: number): number {
    const varThreshold = this.historicalVaR(p);
    const losses = this.monthlyReturns.filter((r) => r <= varThreshold);
    return losses.reduce((sum, r) => sum + r, 0) / losses.length;
  }

  upsideCaptureRatio(): number {
    return 100; // Sem benchmark, retorno sempre será 100% do próprio ativo
  }

  downsideCaptureRatio(): number {
    return 100; // Sem benchmark, retorno sempre será 100% do próprio ativo
  }

  safeWithdrawalRate(): number {
    return this.geometricMeanAnnualized() * 0.8;
  }

  perpetualWithdrawalRate(): number {
    return this.geometricMeanAnnualized() * 0.8;
  }

  positivePeriods(): number {
    return this.monthlyReturns.filter((r) => r > 0).length;
  }

  gainLossRatio(): number {
    const gains = this.monthlyReturns.filter((r) => r > 0);
    const losses = this.monthlyReturns.filter((r) => r < 0);
    return (
      gains.reduce((sum, r) => sum + r, 0) /
      (losses.reduce((sum, r) => sum + Math.abs(r), 0) || 1)
    );
  }

  generalCalc() {
    return {
      arithmeticMeanMonthly: this.arithmeticMeanMonthly(),
      arithmeticMeanAnnualized: this.arithmeticMeanAnnualized(),
      geometricMean: this.geometricMean(),
      geometricMeanAnnualized: this.geometricMeanAnnualized(),
      standardDeviation: this.standardDeviation(),
      standardDeviationAnnualized: this.standardDeviationAnnualized(),
      downsideDeviation: this.downsideDeviation(
        Math.pow(1 + (this.risk || 0) / 100, 1 / 12) - 1
      ),
      maxDrawdown: this.maxDrawdown,
      sharpeRatio: this.sharpeRatio(),
      sortinoRatio: this.sortinoRatio(),
      treynorRatio: this.treynorRatio(),
      calmarRatio: this.calmarRatio(),
      activeReturn: this.activeReturn(),
      trackingError: this.trackingError(),
      informationRatio: this.informationRatio(),
      skewness: this.skewness(),
      excessKurtosis: this.excessKurtosis(),
      historicalVaR: this.historicalVaR(0.05), // 5% confidence level
      conditionalVaR: this.conditionalVaR(0.05), // 5% confidence level
      upsideCaptureRatio: this.upsideCaptureRatio(),
      downsideCaptureRatio: this.downsideCaptureRatio(),
      safeWithdrawalRate: this.safeWithdrawalRate(),
      perpetualWithdrawalRate: this.perpetualWithdrawalRate(),
      positivePeriods: this.positivePeriods(),
      gainLossRatio: this.gainLossRatio(),
    };
  }
}
