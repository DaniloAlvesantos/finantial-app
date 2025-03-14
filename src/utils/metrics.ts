import { Calcs } from "./calcs";

type MetricsProps = {
  monthlyReturns: number[];
  benchmarkValues: number[];
  maxDrawdown: number;
  riskFreeRate: number;
};

export class Metrics {
  public monthlyReturns: number[];
  public maxDrawdown: number;
  private benchmarkValues: number[];
  private riskFreeRate: number;
  private benchmarkReturns: number[] = [];

  constructor({
    maxDrawdown,
    monthlyReturns,
    riskFreeRate,
    benchmarkValues,
  }: MetricsProps) {
    const calc = new Calcs();
    this.monthlyReturns = monthlyReturns;
    this.benchmarkValues = benchmarkValues.map((r) => r / 100);

    this.benchmarkReturns = [0];

    for (let i = 1; i < this.benchmarkValues.length; i++) {
      const res = calc.trendy({
        currentValue: this.benchmarkValues[i],
        previousValue: this.benchmarkValues[i - 1],
      });

      this.benchmarkReturns.push(res / 100);
    }

    this.riskFreeRate = riskFreeRate / 100 / 12;
    this.maxDrawdown = maxDrawdown / 100;
  }

  // Helper functions
  private mean(array: number[]): number {
    return array.reduce((sum, value) => sum + value, 0) / array.length;
  }

  private variance(
    array: number[],
    mean?: number,
    isSample: boolean = false
  ): number {
    const avg = mean !== undefined ? mean : this.mean(array);
    const divisor = isSample ? array.length - 1 : array.length;
    return (
      array.reduce((sum, value) => sum + Math.pow(value - avg, 2), 0) / divisor
    );
  }

  private covariance(
    array1: number[],
    array2: number[],
    isSample: boolean = false
  ): number {
    if (array1.length !== array2.length) {
      return 0;
    }
    const mean1 = this.mean(array1);
    const mean2 = this.mean(array2);
    let sum = 0;
    for (let i = 0; i < array1.length; i++) {
      sum += (array1[i] - mean1) * (array2[i] - mean2);
    }
    const divisor = isSample ? array1.length - 1 : array1.length;
    return sum / divisor;
  }

  public print(): void {
    console.log(`Monthly Returns: ${this.monthlyReturns.join(", ")}`);
    console.log(`Max Drawdown: ${this.maxDrawdown}`);
    console.log(`Benchmark Returns: ${this.benchmarkReturns.join(", ")}`);
    console.log(`Benchmark Values: ${this.benchmarkValues.join(", ")}`);
    console.log(`Risk-Free Rate: ${this.riskFreeRate}%`);
  }

  // Core metrics calculations
  arithmeticMeanMonthly(): number {
    return this.mean(this.monthlyReturns);
  }

  arithmeticMeanAnnualized(): number {
    return this.arithmeticMeanMonthly() * 12;
  }

  geometricMean(annualized = false): number {
    if (this.monthlyReturns.length === 0) return NaN;

    const validReturns = this.monthlyReturns.map(r => r / 100).filter((r) => r > -1);

    if (validReturns.length === 0) return NaN;

    const product = validReturns.reduce((prod, r) => prod * (1 + r), 1);
    return annualized
      ? Math.pow(product, 12 / validReturns.length) - 1
      : Math.pow(product, 1 / validReturns.length) - 1;
  }

  standardDeviationMonthly(): number {
    return Math.sqrt(this.variance(this.monthlyReturns));
  }

  standardDeviationAnnualized(): number {
    return this.standardDeviationMonthly() * Math.sqrt(12);
  }

  downsideDeviationMonthly(threshold: number = 0): number {
    const negativeDeviations = this.monthlyReturns
      .filter((r) => r < threshold)
      .map((r) => Math.pow(threshold - r, 2));

    if (negativeDeviations.length === 0) return 0;

    return Math.sqrt(
      negativeDeviations.reduce((sum, val) => sum + val, 0) /
        this.monthlyReturns.length
    );
  }

  benchmarkCorrelation(): number | null {
    if (!this.benchmarkReturns || this.benchmarkReturns.length === 0)
      return null;

    const covar = this.covariance(this.monthlyReturns, this.benchmarkReturns);
    const stdDev1 = Math.sqrt(this.variance(this.monthlyReturns));
    const stdDev2 = Math.sqrt(this.variance(this.benchmarkReturns));

    if (stdDev1 === 0 || stdDev2 === 0) return 0;

    return covar / (stdDev1 * stdDev2);
  }

  beta(): number | null {
    if (!this.benchmarkReturns || this.benchmarkReturns.length === 0)
      return null;

    const covar = this.covariance(
      this.monthlyReturns,
      this.benchmarkReturns,
      true
    );

    const benchmarkVariance = this.variance(
      this.benchmarkReturns,
      undefined,
      true
    );

    if (benchmarkVariance === 0) return 0;
    return covar / benchmarkVariance;
  }
  alphaAnnualized(): number | null {
    if (!this.benchmarkReturns || this.benchmarkReturns.length === 0)
      return null;

    const portfolioReturn = this.arithmeticMeanAnnualized();
    const b = this.beta();
    if (b === null) return null;

    const benchmarkReturn = this.mean(this.benchmarkReturns) * 12;
    const annualRiskFreeRate = this.riskFreeRate * 12;

    return (
      portfolioReturn -
      (annualRiskFreeRate + b * (benchmarkReturn - annualRiskFreeRate))
    );
  }

  r2(): number | null {
    const correlation = this.benchmarkCorrelation()! * 10;
    return correlation !== null ? Math.pow(correlation, 2) : null;
  }

  sharpeRatio(): number {
    const excessReturn = this.arithmeticMeanAnnualized() - this.riskFreeRate * 100;
    const annualStdDev = this.standardDeviationAnnualized();

    // Avoid division by zero
    if (annualStdDev === 0) return 0;

    return excessReturn / annualStdDev;
  }

  sortinoRatio(): number {
    const excessReturn =
      this.arithmeticMeanAnnualized() - this.riskFreeRate * 100;
    const downsideDev = this.downsideDeviationMonthly() * Math.sqrt(12);

    // Avoid division by zero
    if (downsideDev === 0) return 0;

    return excessReturn / downsideDev;
  }

  treynorRatio(): number | null {
    if (!this.benchmarkReturns || this.benchmarkReturns.length === 0)
      return null;

    const excessReturn =
      this.arithmeticMeanAnnualized() - this.riskFreeRate * 12;
    const b = this.beta()! * 10;

    if (b === null || b === 0) return null;

    return excessReturn / b;
  }

  calmarRatio(): number {
    if (this.maxDrawdown === 0) return 0;

    return this.arithmeticMeanAnnualized() / Math.abs(this.maxDrawdown);
  }

  modiglianiMeasure(): number | null {
    if (!this.benchmarkReturns || this.benchmarkReturns.length === 0)
      return null;

    const benchmarkStdDev =
      Math.sqrt(this.variance(this.benchmarkReturns)) * Math.sqrt(12);
    return this.sharpeRatio() * benchmarkStdDev + this.riskFreeRate * 12;
  }

  activeReturn(): number | null {
    if (!this.benchmarkReturns || this.benchmarkReturns.length === 0)
      return null;

    return (
      this.arithmeticMeanAnnualized() - this.mean(this.benchmarkReturns) * 12
    );
  }

  trackingError(): number | null {
    if (!this.benchmarkReturns || this.benchmarkReturns.length === 0)
      return null;

    const activeReturns = this.monthlyReturns.map(
      (r, i) => r - this.benchmarkReturns[i] * 100
    );
    return Math.sqrt(this.variance(activeReturns)) * Math.sqrt(12);
  }

  informationRatio(): number | null {
    const activeRet = this.activeReturn();
    const trackingErr = this.trackingError();

    if (activeRet === null || trackingErr === null || trackingErr === 0)
      return null;

    return activeRet / trackingErr;
  }

  skewness(): number {
    const mean = this.arithmeticMeanMonthly();
    const std = this.standardDeviationMonthly();

    if (std === 0) return 0; // Avoid division by zero

    let sum = 0;
    for (const r of this.monthlyReturns) {
      sum += Math.pow((r - mean) / std, 3);
    }

    return sum / this.monthlyReturns.length;
  }

  excessKurtosis(): number {
    const mean = this.arithmeticMeanMonthly();
    const std = this.standardDeviationMonthly();

    if (std === 0) return 0; // Avoid division by zero

    let sum = 0;
    for (const r of this.monthlyReturns) {
      sum += Math.pow((r - mean) / std, 4);
    }

    return sum / this.monthlyReturns.length - 3; // Subtract 3 to get excess kurtosis
  }

  historicalValueAtRisk(confidence: number = 0.05): number {
    if (this.monthlyReturns.length === 0) return 0;

    const sortedReturns = [...this.monthlyReturns].sort((a, b) => a - b);
    const index = Math.floor(confidence * sortedReturns.length);

    // Make sure the index is valid
    if (index >= sortedReturns.length)
      return -sortedReturns[sortedReturns.length - 1];

    return -sortedReturns[index];
  }

  analyticalValueAtRisk(confidence: number = 0.05): number {
    const mean = this.arithmeticMeanMonthly();
    const std = this.standardDeviationMonthly();

    try {
      const z = this.normalInverseCDF(confidence);
      return -(mean + z * std);
    } catch (error) {
      console.error("Error calculating analytical VaR:", error);
      return 0;
    }
  }

  // Helper function for analytical VaR calculation
  private normalInverseCDF(p: number): number {
    // Approximation of the inverse normal CDF
    // This is a simple approximation, a real implementation would use more accurate methods
    if (p <= 0 || p >= 1) {
      throw new Error("Probability must be between 0 and 1");
    }

    // Approximation for 0 < p < 1
    const a1 = -3.969683028665376e1;
    const a2 = 2.209460984245205e2;
    const a3 = -2.759285104469687e2;
    const a4 = 1.38357751867269e2;
    const a5 = -3.066479806614716e1;
    const a6 = 2.506628277459239;

    const b1 = -5.447609879822406e1;
    const b2 = 1.615858368580409e2;
    const b3 = -1.556989798598866e2;
    const b4 = 6.680131188771972e1;
    const b5 = -1.328068155288572e1;

    const c1 = -7.784894002430293e-3;
    const c2 = -3.223964580411365e-1;
    const c3 = -2.400758277161838;
    const c4 = -2.549732539343734;
    const c5 = 4.374664141464968;
    const c6 = 2.938163982698783;

    const d1 = 7.784695709041462e-3;
    const d2 = 3.224671290700398e-1;
    const d3 = 2.445134137142996;
    const d4 = 3.754408661907416;

    // Define break-points
    const p_low = 0.02425;
    const p_high = 1 - p_low;

    let x: number;

    // Rational approximation for lower region
    if (p < p_low) {
      const q = Math.sqrt(-2 * Math.log(p));
      x =
        (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
        ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    }
    // Rational approximation for central region
    else if (p <= p_high) {
      const q = p - 0.5;
      const r = q * q;
      x =
        ((((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q) /
        (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
    }
    // Rational approximation for upper region
    else {
      const q = Math.sqrt(-2 * Math.log(1 - p));
      x =
        -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
        ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    }

    return x;
  }

  conditionalValueAtRisk(confidence: number = 0.05): number {
    const sortedReturns = [...this.monthlyReturns].sort((a, b) => a - b);
    const varIndex = Math.floor(confidence * sortedReturns.length);

    if (varIndex === 0 || sortedReturns.length === 0) return 0;

    let sum = 0;
    for (let i = 0; i < varIndex; i++) {
      sum += sortedReturns[i];
    }

    return -sum / varIndex;
  }

  upsideCaptureRatio(): number | null {
    if (!this.benchmarkReturns || this.benchmarkReturns.length === 0)
      return null;

    let portfolioUpSum = 0;
    let benchmarkUpSum = 0;
    let upPeriods = 0;

    for (let i = 0; i < this.monthlyReturns.length; i++) {
      if (this.benchmarkReturns[i] > 0) {
        portfolioUpSum += this.monthlyReturns[i];
        benchmarkUpSum += this.benchmarkReturns[i] * 100;
        upPeriods++;
      }
    }

    if (upPeriods === 0 || benchmarkUpSum === 0) return null;

    return (portfolioUpSum / upPeriods / (benchmarkUpSum / upPeriods)) * 100;
  }

  downsideCaptureRatio(): number | null {
    if (!this.benchmarkReturns || this.benchmarkReturns.length === 0)
      return null;

    let portfolioDownSum = 0;
    let benchmarkDownSum = 0;
    let downPeriods = 0;

    for (let i = 0; i < this.monthlyReturns.length; i++) {
      if (this.benchmarkReturns[i] < 0) {
        portfolioDownSum += this.monthlyReturns[i];
        benchmarkDownSum += this.benchmarkReturns[i] * 100;
        downPeriods++;
      }
    }

    if (downPeriods === 0 || benchmarkDownSum === 0) return null;

    return (
      (portfolioDownSum / downPeriods / (benchmarkDownSum / downPeriods)) * 100
    );
  }

  private isWithdrawalRateSustainable(
    returns: number[],
    withdrawalRate: number
  ): boolean {
    let balance = 1;
    const monthlyWithdrawal = withdrawalRate / 12;

    for (const ret of returns) {
      balance = balance * (1 + ret) - monthlyWithdrawal;
      if (balance <= 0) return false;
    }

    return true;
  }

  perpetualWithdrawalRate(): number {
    // A simple perpetual withdrawal rate calculation
    // Using the long-term real growth rate minus a safety margin
    return Math.max(
      0,
      this.geometricMean(true) - this.standardDeviationAnnualized() * 0.5
    );
  }

  positivePeriodsPercentage(): number {
    if (this.monthlyReturns.length === 0) return 0;

    const positiveCount = this.monthlyReturns.filter((r) => r > 0).length;
    return (positiveCount / this.monthlyReturns.length) * 100;
  }

  gainLossRatio(): number {
    const gains = this.monthlyReturns.filter((r) => r > 0);
    const losses = this.monthlyReturns.filter((r) => r < 0);

    if (losses.length === 0) return Number.POSITIVE_INFINITY;
    if (gains.length === 0) return 0;

    const avgGain = this.mean(gains);
    const avgLoss = Math.abs(this.mean(losses));

    // Avoid division by zero
    if (avgLoss === 0) return Number.POSITIVE_INFINITY;

    return avgGain / avgLoss;
  }

  // Method to calculate all metrics at once and return them as an object
  calculateAllMetrics(): Record<string, number | null> {
    this.print();
    return {
      arithmeticMeanMonthly: this.arithmeticMeanMonthly(),
      arithmeticMeanAnnualized: this.arithmeticMeanAnnualized(),
      geometricMeanMonthly: this.geometricMean() * 100,
      geometricMeanAnnualized: this.geometricMean(true) * 100,
      standardDeviationMonthly: this.standardDeviationMonthly(),
      standardDeviationAnnualized: this.standardDeviationAnnualized(),
      downsideDeviationMonthly: this.downsideDeviationMonthly(),
      maximumDrawdown: this.maxDrawdown * 100,
      benchmarkCorrelation: this.benchmarkCorrelation()! * 10,
      beta: this.beta()! / 10,
      alphaAnnualized: this.alphaAnnualized()!,
      r2: this.r2()! * 100,
      sharpeRatio: this.sharpeRatio(),
      sortinoRatio: this.sortinoRatio(),
      treynorRatio: this.treynorRatio()! * 100,
      calmarRatio: this.calmarRatio(),
      trackingError: this.trackingError(),
      informationRatio: this.informationRatio(),
      skewness: this.skewness(),
      activeReturn: this.activeReturn(),
      excessKurtosis: this.excessKurtosis(),
      historicalValueAtRisk: this.historicalValueAtRisk(),
      analyticalValueAtRisk: this.analyticalValueAtRisk(),
      conditionalValueAtRisk: this.conditionalValueAtRisk(),
      upsideCaptureRatio: this.upsideCaptureRatio(),
      downsideCaptureRatio: this.downsideCaptureRatio(),
      positivePeriodsPercentage: this.positivePeriodsPercentage(),
      gainLossRatio: this.gainLossRatio(),
    };
  }
}
