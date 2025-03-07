import { TicketFormValues } from "@/components/forms/backtest/type";
import { getSelicAsBenchmark, getSelicData } from "@/services/selic";

export type extractRatiosProps = {
  percentReturns: {
    value: number;
    date: Date;
  }[];
};

type MetricsProps = {
  monthlyReturns: number[],
  benchmarkReturns: number[],
  maxDrawdown: number,
  riskFreeRate: number
}

export class Metrics {
  public monthlyReturns: number[];
  public maxDrawdown: number;
  private benchmarkReturns: number[];
  private riskFreeRate: number;
  private initialized: boolean = false;

  constructor({maxDrawdown, monthlyReturns, riskFreeRate, benchmarkReturns}: MetricsProps) {
    this.monthlyReturns = monthlyReturns;
    this.maxDrawdown = maxDrawdown;
    this.riskFreeRate = riskFreeRate / 100;
    this.benchmarkReturns = benchmarkReturns?? [];
  }

  public async init() {
    this.initialized = true;
  }

  // Basic Statistics
  arithmeticMean(): number {
    return (
      this.monthlyReturns.reduce((sum, r) => sum + r, 0) /
      this.monthlyReturns.length
    );
  }

  arithmeticMeanAnnualized(): number {
    return this.arithmeticMean() * 12;
  }

  geometricMean(annualized = false): number {
    if (this.monthlyReturns.length === 0) return NaN;

    const validReturns = this.monthlyReturns
      .filter((r) => r > -1)
   
    if (validReturns.length === 0) return NaN;

    const product = validReturns.reduce((prod, r) => prod * (1 + r), 1);

    return annualized
      ? (Math.pow(product, 1 / validReturns.length) - 1) * 12
      : Math.pow(product, 1 / validReturns.length) - 1;
  }

  standardDeviation(annualized = false): number {
    const mean = this.arithmeticMean();
    const variance =
      this.monthlyReturns.reduce((sum, r) => sum + (r - mean) ** 2, 0) /
      (this.monthlyReturns.length - 1);
    return annualized
      ? Math.sqrt(variance) * Math.sqrt(12)
      : Math.sqrt(variance);
  }

  downsideDeviation(mar = this.riskFreeRate): number {
    const downsideDiffs = this.monthlyReturns.map((r) => {
      const diff = r - mar;
      return diff < 0 ? diff ** 2 : 0;
    });
    return Math.sqrt(
      downsideDiffs.reduce((sum, val) => sum + val, 0) /
        this.monthlyReturns.length
    );
  }

  // Risk Metrics
  sharpeRatio(): number {
    const excessReturn = this.arithmeticMean() - this.riskFreeRate;
    return (excessReturn / this.standardDeviation()) * Math.sqrt(12);
  }

  sortinoRatio(): number {
    const excessReturn = this.arithmeticMean() - this.riskFreeRate;
    return excessReturn / this.downsideDeviation();
  }

  historicalVaR(confidenceLevel = 0.05): number {
    const sorted = [...this.monthlyReturns].sort((a, b) => a - b);
    return Math.abs(sorted[Math.floor(confidenceLevel * sorted.length)]);
  }

  conditionalVaR(confidenceLevel = 0.05): number {
    const varThreshold = this.historicalVaR(confidenceLevel);
    const losses = this.monthlyReturns.filter((r) => r <= -varThreshold);
    return losses.reduce((sum, r) => sum + Math.abs(r), 0) / losses.length;
  }

  // Benchmark Metrics
  correlationWithBenchmark(): number {
    if (!this.benchmarkReturns.length) return NaN;

    const xMean = this.arithmeticMean();
    const yMean =
      this.benchmarkReturns.reduce((a, b) => a + b, 0) /
      this.benchmarkReturns.length;

    const numerator = this.monthlyReturns.reduce(
      (sum, r, i) => sum + (r - xMean) * (this.benchmarkReturns[i] - yMean),
      0
    );

    const denominator = Math.sqrt(
      this.monthlyReturns.reduce((sum, r) => sum + (r - xMean) ** 2, 0) *
        this.benchmarkReturns.reduce((sum, r) => sum + (r - yMean) ** 2, 0)
    );

    return numerator / denominator;
  }

  beta(): number {
    if (
      !this.benchmarkReturns.length ||
      this.benchmarkReturns.length !== this.monthlyReturns.length
    ) {
      return NaN;
    }
    const covariance = this.monthlyReturns.reduce(
      (sum, r, i) =>
        sum +
        (r - this.arithmeticMean()) *
          (this.benchmarkReturns[i] - this.benchmarkMean()),
      0
    );

    return covariance / this.benchmarkVariance();
  }

  alpha(annualized = true): number {
    return (
      (this.arithmeticMean() -
        this.riskFreeRate -
        this.beta() * (this.benchmarkMean() - this.riskFreeRate)) *
      (annualized ? 12 : 1)
    );
  }

  treynorRatio(): number {
    return (
      ((this.arithmeticMeanAnnualized() - this.riskFreeRate * 12) /
        this.beta()) *
      100
    );
  }

  // Additional Metrics
  calmarRatio(): number {
    return this.arithmeticMeanAnnualized() / Math.abs(this.maxDrawdown);
  }

  modiglianiMeasure(): number {
    if (!this.benchmarkReturns.length) return NaN;

    return this.sharpeRatio() * this.benchmarkStdDev() + this.riskFreeRate;
  }

  informationRatio(): number {
    if (!this.benchmarkReturns.length) return NaN;

    return (
      (this.arithmeticMean() - this.benchmarkMean()) / this.trackingError()
    );
  }

  // Helper Methods
  private benchmarkMean(): number {
    return (
      this.benchmarkReturns.reduce((a, b) => a + b, 0) /
      this.benchmarkReturns.length
    );
  }

  private benchmarkVariance(): number {
    const mean = this.benchmarkMean();
    return (
      this.benchmarkReturns.reduce((sum, r) => sum + (r - mean) ** 2, 0) /
      this.benchmarkReturns.length
    );
  }

  private benchmarkStdDev(): number {
    return Math.sqrt(this.benchmarkVariance());
  }

  trackingError(): number {
    const activeReturns = this.monthlyReturns.map(
      (r, i) => r - this.benchmarkReturns[i]
    );
    const meanActive =
      activeReturns.reduce((a, b) => a + b, 0) / activeReturns.length;
    return Math.sqrt(
      activeReturns.reduce((sum, r) => sum + (r - meanActive) ** 2, 0) /
        (activeReturns.length - 1)
    );
  }

  // Capture Ratios
  upsideCaptureRatio(): number {
    const [assetUp, benchUp] = this.filterPositivePeriods();
    return (assetUp / benchUp) * 100 || 100;
  }

  downsideCaptureRatio(): number {
    const [assetDown, benchDown] = this.filterNegativePeriods();
    return (assetDown / benchDown) * 100 || 100;
  }

  // Withdrawal Rates
  safeWithdrawalRate(): number {
    return Math.min(this.geometricMean(true) * 0.04, 0.04);
  }

  perpetualWithdrawalRate(): number {
    return this.geometricMean(true) * 0.03; // 3% perpetual
  }

  positivePeriodsPercentage(): number {
    const total = this.monthlyReturns.length;
    if (total === 0) return 0;

    const positiveCount = this.monthlyReturns.filter((r) => r > 0).length;
    const percentage = (positiveCount / total) * 100;
    return percentage;
  }

  // General Calculations
  generalCalc() {
    return {
      arithmeticMean: this.arithmeticMean(),
      arithmeticMeanAnnualized: this.arithmeticMeanAnnualized(),
      geometricMean: this.geometricMean(),
      geometricMeanAnnualized: this.geometricMean(true),
      standardDeviation: this.standardDeviation(),
      standardDeviationAnnualized: this.standardDeviation(true),
      downsideDeviation: this.downsideDeviation(),
      maxDrawdown: this.maxDrawdown,
      sharpeRatio: this.sharpeRatio(),
      sortinoRatio: this.sortinoRatio(),
      treynorRatio: this.treynorRatio(),
      calmarRatio: this.calmarRatio(),
      modiglianiMeasure: this.modiglianiMeasure(),
      informationRatio: this.informationRatio(),
      beta: this.beta(),
      alpha: this.alpha(),
      rSquared: this.correlationWithBenchmark() ** 2,
      correlation: this.correlationWithBenchmark(),
      historicalVaR: this.historicalVaR(),
      conditionalVaR: this.conditionalVaR(),
      upsideCaptureRatio: this.upsideCaptureRatio(),
      downsideCaptureRatio: this.downsideCaptureRatio(),
      safeWithdrawalRate: this.safeWithdrawalRate(),
      perpetualWithdrawalRate: this.perpetualWithdrawalRate(),
      positivePeriods: this.positivePeriodsPercentage(),
      gainLossRatio: this.gainLossRatio(),
      skewness: this.calculateSkewness(),
      excessKurtosis: this.calculateKurtosis(),
    };
  }

  // Maintained from original
  private gainLossRatio(): number {
    const gains = this.monthlyReturns.filter((r) => r > 0);
    const losses = this.monthlyReturns.filter((r) => r < 0);
    return (
      gains.reduce((sum, r) => sum + r, 0) /
      (losses.reduce((sum, r) => sum + Math.abs(r), 0) || 1)
    );
  }

  private calculateSkewness(): number {
    const mean = this.arithmeticMean();
    const stdDev = this.standardDeviation();
    return (
      this.monthlyReturns.reduce(
        (sum, r) => sum + Math.pow((r - mean) / stdDev, 3),
        0
      ) / this.monthlyReturns.length
    );
  }

  private calculateKurtosis(): number {
    const mean = this.arithmeticMean();
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

  private filterPositivePeriods(): [number, number] {
    const benchPositive = this.benchmarkReturns.filter((r) => r > 0);
    const assetPositive = this.monthlyReturns.filter(
      (_, i) => this.benchmarkReturns[i] > 0
    );
    return [
      assetPositive.reduce((a, b) => a + b, 0) / assetPositive.length,
      benchPositive.reduce((a, b) => a + b, 0) / benchPositive.length,
    ];
  }

  private filterNegativePeriods(): [number, number] {
    const benchNegative = this.benchmarkReturns.filter((r) => r < 0);
    const assetNegative = this.monthlyReturns.filter(
      (_, i) => this.benchmarkReturns[i] < 0
    );
    return [
      assetNegative.reduce((a, b) => a + b, 0) / assetNegative.length,
      benchNegative.reduce((a, b) => a + b, 0) / benchNegative.length,
    ];
  }
}
