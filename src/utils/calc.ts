type TrendyProps = {
  previousValue: number;
  currentValue: number;
};

type updateValueGeneral = TrendyProps & {
  monthlyInvest?: number;
  prevInvest: number;
};

type generalValuesProps = {
  periods: Date[];
  periodValues: number[];
  initialInvestiment: number;
  monthlyInvest?: number;
  dividendAmounts?: number[];
};

type extractAnnualReturnsProps = {
  monthlyRetuns: {
    value: number;
    date: Date;
  }[];
};

type extractCAGRProps = {
  investmentValue: number;
  initialInvestiment: number;
  years: number;
};

export class Calcs {
  trendy({ previousValue, currentValue }: TrendyProps): number {
    if (previousValue === 0) return 0;
    return ((currentValue - previousValue) / previousValue) * 100;
  }

  updateGeneralValue({
    currentValue,
    prevInvest,
    previousValue,
    monthlyInvest = 0,
  }: updateValueGeneral) {
    const monthReturn = this.trendy({ previousValue, currentValue });
    const newInvestment = prevInvest + monthlyInvest;
    return newInvestment * (1 + monthReturn / 100);
  }

  extractAnnualReturns({ monthlyRetuns }: extractAnnualReturnsProps) {
    if (!monthlyRetuns.length) return [];

    const groupedByYear = monthlyRetuns.reduce((acc, { value, date }) => {
      if (
        !value ||
        isNaN(value) ||
        !(date instanceof Date) ||
        isNaN(date.getTime())
      )
        return acc;
      const year = date.getFullYear();
      const monthlyReturn = value / 100;
      if (!acc[year]) acc[year] = [];
      acc[year].push(1 + monthlyReturn);
      return acc;
    }, {} as Record<number, number[]>);

    return Object.keys(groupedByYear).map((year) => {
      const product = groupedByYear[Number(year)].reduce(
        (acc, value) => acc * value,
        1
      );
      return {
        period: new Date(Number(year), 0, 1),
        value: Number(((product - 1) * 100).toFixed(2)),
      };
    });
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

  generalValues({
    initialInvestiment,
    periodValues,
    periods,
    monthlyInvest,
    dividendAmounts,
  }: generalValuesProps) {
    if (periodValues.length !== periods.length)
      throw new Error("Periods and periodValues must have the same length.");
    if (dividendAmounts && dividendAmounts.length !== periodValues.length)
      throw new Error("Dividends and periodValues must have the same length.");
    if (!periods.every((p) => p instanceof Date && !isNaN(p.getTime())))
      throw new Error("Invalid dates in periods array.");
    if (
      !periodValues.every((value) => typeof value === "number" && !isNaN(value))
    )
      throw new Error("Invalid values in periodValues array.");

    let investmentValue = initialInvestiment;
    let maxValue = initialInvestiment;
    let maxDrawdows = 0;
    let sharesHeld = initialInvestiment / periodValues[0];
    let totalDividends = 0;

    const timeline = [{ value: initialInvestiment, date: periods[0] }];
    const drawdowns = [{ value: 0, date: periods[0] }];
    const percentReturns = [{ value: 0, date: periods[0] }];

    for (let i = 1; i < periods.length; i++) {
      const currentValue = periodValues[i];
      const previousValue = periodValues[i - 1];
      const dividendPerShare = dividendAmounts ? dividendAmounts[i] || 0 : 0;
      const dividendsReceived =
        dividendPerShare > 0 ? sharesHeld * dividendPerShare : 0;

      const additionalShares = dividendsReceived / currentValue;
      sharesHeld += additionalShares;
      totalDividends += dividendsReceived;

      investmentValue = sharesHeld * currentValue;

      timeline.push({ value: investmentValue, date: periods[i] });
      percentReturns.push({
        value: this.trendy({ currentValue, previousValue }),
        date: periods[i],
      });

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
        ? this.extractCAGR({ years, initialInvestiment, investmentValue })
        : 0;
    const avgReturn =
      percentReturns.reduce((a, b) => a + b.value, 0) / percentReturns.length;
    const variance =
      percentReturns.reduce(
        (sum, r) => sum + Math.pow(r.value - avgReturn, 2),
        0
      ) /
      (percentReturns.length - 1);
    const annualVolatility = Math.sqrt(variance) * Math.sqrt(12);
    const annualReturns = this.extractAnnualReturns({
      monthlyRetuns: percentReturns,
    });

    const totalInvested = monthlyInvest
      ? periods.length * monthlyInvest + initialInvestiment
      : initialInvestiment;

    return {
      timeline,
      cumulativeReturn: Number(cumulativeReturn.toFixed(2)),
      maxDrawdown: Number((maxDrawdows * 100).toFixed(2)) * -1,
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
      totalInvested,
      totalDividends: Number(totalDividends.toFixed(2)),
    };
  }
}
