type TrendyProps = {
  previousValue: number;
  currentValue: number;
};

type updateValueProps = TrendyProps & {
  prevInvest: number;
};

type updateValueWithMonthlyProps = updateValueProps & {
  monthlyInvest: number;
};

type generalValuesProps = {
  periods: Date[];
  periodValues: number[];
  initialInvestiment: number;
  monthlyInvest?: number;
};

type extractAnnualReturnsProps = {
  monthlyRetuns: {
    value: number;
    date: Date;
  }[];
};

export class Calcs {
  trendy({ previousValue, currentValue }: TrendyProps): number {
    if (previousValue === 0) {
      return 0; // Avoid division by zero
    }
    const percentageChange =
      ((currentValue - previousValue) / previousValue) * 100;
    return Number(percentageChange);
  }

  updateValue({ currentValue, prevInvest, previousValue }: updateValueProps) {
    const monthReturn: number = this.trendy({ previousValue, currentValue });
    const newValue = prevInvest * (1 + monthReturn / 100);
    return newValue;
  }

  updateValueWithMonthly({
    currentValue,
    prevInvest,
    previousValue,
    monthlyInvest,
  }: updateValueWithMonthlyProps) {
    const monthReturn: number = this.trendy({ previousValue, currentValue });
    const newInvestment = prevInvest + monthlyInvest;
    const newValue = newInvestment * (1 + monthReturn / 100);

    return newValue;
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

  generalValues({
    initialInvestiment,
    periodValues,
    periods,
    monthlyInvest,
  }: generalValuesProps) {
    if (initialInvestiment <= 0) {
      // throw new Error("Initial investment must be greater than zero.");
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
    let monthlyInvestValue = initialInvestiment;
    let maxValue = initialInvestiment;
    let maxDrawdows = 0;

    for (let i = 1; i < periods.length; i++) {
      const currentValue = periodValues[i];
      const previousValue = periodValues[i - 1];

      investmentValue = this.updateValue({
        currentValue,
        previousValue,
        prevInvest: investmentValue,
      });

      if (monthlyInvest) {
        monthlyInvestValue = this.updateValueWithMonthly({
          currentValue,
          previousValue,
          prevInvest: monthlyInvestValue,
          monthlyInvest,
        });

        timeline.push({ value: monthlyInvestValue, date: periods[i] });
      } else {
        timeline.push({ value: investmentValue, date: periods[i] });
      }

      const currentPeriodTrendy = this.trendy({ currentValue, previousValue });
      percentReturns.push({ value: currentPeriodTrendy, date: periods[i] });

      maxValue = Math.max(maxValue, investmentValue);
      const currentDrawdown =
        maxValue !== 0 ? (maxValue - investmentValue) / maxValue : 0;
      drawdowns.push({ value: currentDrawdown, date: periods[i] });
      maxDrawdows = Math.max(maxDrawdows, currentDrawdown);
    }

    const cumulativeReturn =
      ((investmentValue - initialInvestiment) / initialInvestiment) * 100;

    const years =
      (periods[periods.length - 1].getTime() - periods[0].getTime()) /
      (1000 * 60 * 60 * 24 * 365.25);

    const cagr =
      years > 0
        ? (Math.pow(investmentValue / initialInvestiment, 1 / years) - 1) * 100
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

    return {
      timeline,
      cumulativeReturn: Number(cumulativeReturn.toFixed(2)),
      maxDrawdown: Number((maxDrawdows * 100).toFixed(2)),
      drawdowns: drawdowns.map((d) => ({
        ...d,
        value: Number((d.value * 100).toFixed(2)),
      })),
      annualVolatility: Number(annualVolatility.toFixed(2)),
      cagr: Number(cagr.toFixed(2)),
      monthlyRetuns: percentReturns.map((r) => ({
        ...r,
        value: Number(r.value.toFixed(2)),
      })),
      annualReturns,
      periods,
    };
  }
}
