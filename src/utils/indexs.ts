/*

  this.values.data sempre vai ser um array, precisamos verificar se dentro de data o valor for um array e pq vem do gov
  se nao vem da alphavantage

*/

import { AlphaVantageResponse, PeriodKeys } from "@/types/alphaVantageResponse";
import { govResponse } from "@/types/govResponse";
import { Calcs } from "./calc";
import { TicketFormValues } from "@/components/my/forms/backtest/type";

interface IndexesProps {
  indexes: {
    data: (AlphaVantageResponse | govResponse[] | null)[];
    isLoading: boolean;
    isError: boolean;
    orderedIndexes: string[];
  };
}

type CalcValuesProps = {
  initialInvestiment: number;
  monthlyInvest?: number;
  interval: TicketFormValues["period"];
};

type CalcIBOVProps = {
  ibovData: AlphaVantageResponse;
};

type CalcIndexProps = Omit<CalcValuesProps, "interval">;

export type indexesResultsProps = {
  name: string;
  results: { periodValues: number[]; periods: Date[] };
  calcResults?: ReturnType<Calcs["generalValues"]>;
}[];

export class IndexesCalc {
  private values: IndexesProps["indexes"];
  private interval: TicketFormValues["period"] | undefined;

  constructor({ indexes }: IndexesProps) {
    this.values = indexes;
  }

  calcIBOV({ ibovData }: CalcIBOVProps) {
    if (!this.values || this.values.isLoading || this.values.isError) return;

    const alphaVantageData = this.values.data.find(
      (item) => item && !Array.isArray(item)
    ) as AlphaVantageResponse | undefined;

    if (!alphaVantageData || !alphaVantageData[PeriodKeys.monthly]) {
      console.log("Monthly data is undefined.");
      return;
    }

    const monthlyData = alphaVantageData[PeriodKeys.monthly];

    const periods = Object.keys(monthlyData)
      .sort()
      .map((date) => new Date(date))
      .filter((date) => date.getFullYear() >= 2015);

    const periodValues = Object.entries(monthlyData)
      .sort()
      .filter(([key]) => new Date(key).getFullYear() >= 2015)
      .map(([, value]) =>
        Number((value as { "5. adjusted close": string })["5. adjusted close"])
      );

    return { periods, periodValues };
  }

  calcIndex({ initialInvestiment, monthlyInvest }: CalcIndexProps) {
    if (!this.values || this.values.isLoading || this.values.isError) return;

    const res: { periods: Date; periodValues: number }[] = [];
    let investmentValue = initialInvestiment;

    const values = this.values.data
      .flat() // Flatten if nested
      .filter((item): item is govResponse => item !== null && "data" in item)
      .filter((item) => new Date(item.data).getFullYear() >= 2015);

    values.forEach((item) => {
      const cdi = Number(item.valor) / 100;
      investmentValue *= 1 + cdi;

      if (monthlyInvest) {
        investmentValue += monthlyInvest;
      }

      const [day, month, year] = item.data.split("/").map(Number);

      res.push({
        periods: new Date(year, month - 1, day),
        periodValues: investmentValue,
      });
    });

    return {
      periodValues: res.map((value) => Math.round(value.periodValues)),
      periods: res.map((value) => value.periods),
    };
  }

  calcValues({
    initialInvestiment,
    interval,
    monthlyInvest,
  }: CalcValuesProps): indexesResultsProps | undefined {
    if (!this.values || this.values.isLoading || this.values.isError) return;

    this.interval = interval;
    const indexesResults: indexesResultsProps = [];

    for (let idx = 0; idx < this.values.data.length; idx++) {
      let currentCalc;

      if (Array.isArray(this.values.data[idx])) {
        // if is an array, is an index from brazil gov
        currentCalc = this.calcIndex({
          initialInvestiment,
          monthlyInvest,
        });
      } else {
        currentCalc = this.calcIBOV({
          ibovData: this.values.data[idx] as AlphaVantageResponse,
        });
      }

      indexesResults.push({
        name: this.values.orderedIndexes[idx],
        results: currentCalc!,
      });
    }

    indexesResults.forEach((index) => {
      if (index.name === "IBOVESPA") {
        index.calcResults = new Calcs().generalValues({
          initialInvestiment,
          periodValues: index.results.periodValues,
          periods: index.results.periods,
          monthlyInvest,
        });
      }
    });

    return indexesResults;
  }
}
