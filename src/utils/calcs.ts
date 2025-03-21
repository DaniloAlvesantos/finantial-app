import {
  extractAnnualReturnsProps,
  extractCAGRProps,
  extractCumulativeReturnsProps,
  extractYearsProps,
  generalValuesProps,
  TrendyProps,
  updateValueGeneralProps,
} from "@/types/calcsProps";

export class Calcs {
  trendy({ previousValue, currentValue }: TrendyProps): number {
    if (previousValue === 0) {
      return 0; // Avoid division by zero
    }
    const percentageChange =
      ((currentValue - previousValue) / previousValue) * 100;
    return Number(percentageChange);
  }

  updateValueGeneral({
    currentValue,
    prevInvest,
    previousValue,
    monthlyInvest = 0,
    dividend = 0, // Add dividend parameter
  }: updateValueGeneralProps & { dividend?: number }) {
    const monthReturn = this.trendy({ previousValue, currentValue });
    const newInvestment = prevInvest + monthlyInvest;

    const additionalShares = dividend / currentValue;

    const updatedInvestment =
      (newInvestment + additionalShares * currentValue) *
      (1 + monthReturn / 100);

    return updatedInvestment;
  }

  extractAnnualReturns({ monthlyRetuns }: extractAnnualReturnsProps) {
    if (!Array.isArray(monthlyRetuns) || monthlyRetuns.length === 0) {
      return [];
    }

    const totalAnnual = monthlyRetuns
      .filter((item) => item.value !== undefined && !isNaN(item.value))
      .map((entry) => ({
        value: entry.value,
        period:
          entry.date instanceof Date && !isNaN(entry.date.getTime())
            ? entry.date
            : null,
      }))
      .filter((entry) => entry.period !== null) as {
      value: number;
      period: Date;
    }[];

    const groupedByYear = totalAnnual.reduce((acc, entry) => {
      if (!entry.period) return acc;
      const year = entry.period.getFullYear();
      const monthlyReturn = entry.value / 100;

      if (!acc[year]) acc[year] = [];
      acc[year].push(1 + monthlyReturn);
      return acc;
    }, {} as Record<number, number[]>);

    const annualReturns = Object.keys(groupedByYear).map((year) => {
      const product = groupedByYear[Number(year)].reduce(
        (acc, value) => acc * value,
        1
      );
      const result = (product - 1) * 100;

      return {
        period: new Date(Number(year), 0, 1),
        value: isNaN(result) ? 0 : Number(result.toFixed(2)),
      };
    });

    return annualReturns;
  }

  extractCAGR({
    investmentValue,
    initialInvestiment,
    years,
  }: extractCAGRProps) {
    return (
      (Math.pow(investmentValue / initialInvestiment, 1 / years) - 1) * 100
    );
  }

  extractCumulativeReturns({
    initialInvestiment,
    investmentValue,
  }: extractCumulativeReturnsProps) {
    return ((investmentValue - initialInvestiment) / initialInvestiment) * 100;
  }

  extractYears({ firstPeriod, lastPeriod }: extractYearsProps) {
    return (
      (lastPeriod.getTime() - firstPeriod.getTime()) /
      (1000 * 60 * 60 * 24 * 365.25)
    );
  }

  generalValues({
    initialInvestiment,
    periodValues,
    periods,
    monthlyInvest,
    dividends = [],
  }: generalValuesProps) {
    if (initialInvestiment <= 0) {
      throw new Error("Initial investment must be greater than zero.");
    }
    if (periodValues.length !== periods.length) {
      throw new Error("Periods and periodValues must have the same length.");
    }
    if (!periods.every((p) => p instanceof Date && !isNaN(p.getTime()))) {
      throw new Error("Invalid dates in periods array.");
    }
    if (
      !periodValues.every((value) => typeof value === "number" && !isNaN(value))
    ) {
      throw new Error("Invalid values in periodValues array.");
    }

    const timeline = [{ value: initialInvestiment, date: periods[0] }];
    const drawdowns = [{ value: 0, date: periods[0] }];
    const percentReturns = [{ value: 0, date: periods[0] }];
    let investmentValue = initialInvestiment;
    let maxValue = initialInvestiment;
    let maxDrawdowns = 0;
    let totalShares = initialInvestiment / periodValues[0];
    let totalDividends = 0;

    for (let i = 1; i < periods.length; i++) {
      const currentValue = periodValues[i];
      const previousValue = periodValues[i - 1];
      const dividend = dividends[i] || 0;

      const additionalShares = dividend / currentValue;
      totalShares += additionalShares;
      totalDividends += dividend;
      investmentValue = totalShares * currentValue;

      timeline.push({ value: investmentValue, date: periods[i] });
      const currentPeriodTrendy = this.trendy({ currentValue, previousValue });
      percentReturns.push({ value: currentPeriodTrendy, date: periods[i] });

      maxValue = Math.max(maxValue, investmentValue);
      const currentDrawdown =
        maxValue !== 0 ? (maxValue - investmentValue) / maxValue : 0;
      drawdowns.push({ value: currentDrawdown, date: periods[i] });
      maxDrawdowns = Math.max(maxDrawdowns, currentDrawdown);
    }

    const cumulativeReturn = this.extractCumulativeReturns({
      initialInvestiment,
      investmentValue,
    });

    const years = this.extractYears({
      lastPeriod: periods[periods.length - 1],
      firstPeriod: periods[0],
    });

    const cagr =
      years > 0
        ? this.extractCAGR({ years, initialInvestiment, investmentValue })
        : 0;

    const avgReturn =
      percentReturns.length > 0
        ? percentReturns.reduce((a, b) => a + b.value, 0) /
          percentReturns.length
        : 0;

    const variance =
      percentReturns.length > 1
        ? percentReturns.reduce(
            (sum, r) => sum + Math.pow(r.value - avgReturn, 2),
            0
          ) /
          (percentReturns.length - 1)
        : 0;

    const annualVolatility = Math.sqrt(variance) * Math.sqrt(12);
    const annualReturns = this.extractAnnualReturns({
      monthlyRetuns: percentReturns,
    });

    let totalInvested = monthlyInvest
      ? periods.length * monthlyInvest + initialInvestiment
      : initialInvestiment;

    const bestYear: number = Number(
      Math.max(...annualReturns.map((val) => val.value)).toFixed(2)
    );
    const worstYear = Number(
      Math.min(...annualReturns.map((val) => val.value)).toFixed(2)
    );

    return {
      timeline,
      cumulativeReturn: Number(cumulativeReturn.toFixed(2)),
      maxDrawdown: Number((maxDrawdowns * 100).toFixed(2)) * -1,
      drawdowns: drawdowns.map((d) => ({
        ...d,
        value: Number((d.value * 100).toFixed(2)),
      })),
      annualVolatility: Number(annualVolatility.toFixed(2)),
      cagr: Number(cagr.toFixed(2)),
      monthlyReturn: percentReturns.map((r) => ({
        ...r,
        value: Number(r.value.toFixed(2)),
      })),
      annualReturns,
      periods,
      totalInvested,
      totalDividends: Number(totalDividends.toFixed(2)),
      totalShares: Math.round(totalShares),
      bestYear,
      worstYear,
    };
  }
}
