type TrendyProps = {
  previousValue: number;
  currentValue: number;
};

type updateValueProps = TrendyProps & {
  prevInvest: number;
};

type generalValuesProps = {
  periods: Date[];
  periodValues: number[];
  initialInvestiment: number;
};

export class Calcs {
  trendy({ previousValue, currentValue }: TrendyProps): number {
    const percentageChange =
      ((currentValue - previousValue) / previousValue) * 100;
    return Number(percentageChange);
  }

  updateValue({ currentValue, prevInvest, previousValue }: updateValueProps) {
    const monthReturn: number = this.trendy({ previousValue, currentValue });
    const newValue = prevInvest * (1 + monthReturn / 100);

    return newValue;
  }

  generalValues({
    initialInvestiment,
    periodValues,
    periods,
  }: generalValuesProps) {
    if (periodValues.length !== periods.length) {
      throw new Error("Os períodos e os valores devem ter o mesmo tamanho.");
    }

    if (!periods.every((p) => p instanceof Date && !isNaN(p.getTime()))) {
      throw new Error("Invalid dates in periods array.");
    }

    const timeline = [initialInvestiment];
    const drawdowns = [];
    const percentReturns = [];

    let investmentValue = initialInvestiment;
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
      timeline.push(investmentValue);

      const currentPeriodTrendy = this.trendy({ currentValue, previousValue });
      percentReturns.push(currentPeriodTrendy);

      maxValue = Math.max(maxValue, investmentValue);
      const currentDrawdown = (maxValue - investmentValue) / maxValue;
      drawdowns.push(currentDrawdown);
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
        ? percentReturns.reduce((a, b) => a + b, 0) / percentReturns.length
        : 0;

    const variance =
      percentReturns.length > 1
        ? percentReturns.reduce(
            (sum, r) => sum + Math.pow(r - avgReturn, 2),
            0
          ) /
          (percentReturns.length - 1)
        : 0;

    const annualVolatility = Math.sqrt(variance) * Math.sqrt(12);

    return {
      timeline,
      cumulativeReturn: Number(cumulativeReturn.toFixed(2)),
      maxDrawdown: Number((maxDrawdows * 100).toFixed(2)),
      drawdowns: drawdowns.map((d) => Number((d * 100).toFixed(2))),
      annualVolatility: Number(annualVolatility.toFixed(2)),
      cagr: Number(cagr.toFixed(2)),
      annualReturns: percentReturns.map((r) => Number(r.toFixed(2))),
    };
  }
}
