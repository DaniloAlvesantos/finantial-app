export type TrendyProps = {
  previousValue: number;
  currentValue: number;
};

export type updateValueGeneralProps = TrendyProps & {
  monthlyInvest?: number;
  prevInvest: number;
  dividend?: number;
};

export type generalValuesProps = {
  periods: Date[];
  periodValues: number[];
  initialInvestiment: number;
  monthlyInvest?: number;
  sharesPrice?: number[];
  dividends?: number[];
};

export type extractAnnualReturnsProps = {
  monthlyRetuns: {
    value: number;
    date: Date;
  }[];
};

export type extractCAGRProps = {
  investmentValue: number;
  initialInvestiment: number;
  years: number;
};

export type extractCumulativeReturnsProps = {
  initialInvestiment: number;
  investmentValue: number;
};

export type extractYearsProps = {
  lastPeriod: Date;
  firstPeriod: Date;
};

export type extractRatiosProps = {
  percentReturns: {
    value: number;
    date: Date;
  }[];
};
