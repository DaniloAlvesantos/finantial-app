import { AlphaVantageResponse, PeriodKeys } from "@/types/alphaVantageResponse";
import { govResponse } from "@/types/govResponse";
import { Calcs } from "./calc";
import { TicketFormValues } from "@/components/forms/backtest/type";

interface IndexesProps {
  indexes: {
    data: (AlphaVantageResponse | govResponse[] | null)[];
    isLoading: boolean;
    isError: boolean;
    orderedIndexes: string[];
  };
  interval: TicketFormValues["period"];
}

type CalcValuesProps = {
  initialInvestiment: number;
  monthlyInvest?: number;
};

type CalcIBOVProps = {
  ibovData: AlphaVantageResponse;
};

type CalcIndexProps = {
  initialInvestiment: number;
  monthlyInvest?: number;
  indexData: govResponse[];
};

export type indexesResultsProps = {
  name: string;
  results: { periodValues: number[]; periods: Date[] };
  calcResults?: ReturnType<Calcs["generalValues"]>;
}[];

export class IndexesCalc extends Calcs {
  private values: IndexesProps["indexes"];
  private interval: TicketFormValues["period"] | undefined;
  private intervalDates: {
    fromDate: Date | string;
    toDate: Date | string;
  } = {
    fromDate: "",
    toDate: "",
  };

  constructor({ indexes, interval }: IndexesProps) {
    super();
    this.values = indexes;
    this.interval = interval;
    if (interval) {
      this.intervalDates = {
        fromDate: new Date(`${interval.from.year}-${interval.from.month}-01`),
        toDate: new Date(`${interval.to.year}-${interval.to.month}-01`),
      };
    }
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
      .filter(
        (date) =>
          date >= this.intervalDates.fromDate &&
          date <= this.intervalDates.toDate
      );

    const periodValues = Object.entries(monthlyData)
      .sort()
      .filter(([date]) => {
        const d = new Date(date);
        return (
          d >= this.intervalDates.fromDate && d <= this.intervalDates.toDate
        );
      })
      .map(([, value]) => Number(value["5. adjusted close"]));

    return { periods, periodValues };
  }

  calcIndex({ initialInvestiment, monthlyInvest, indexData }: CalcIndexProps) {
    if (!this.values || this.values.isLoading || this.values.isError) return;

    const res: { periods: Date; periodValues: number }[] = [];
    let investmentValue = initialInvestiment;

    // Use the correct subset of data
    const values = indexData.filter((item) => {
      const [day, month, year] = item.data.split("/").map(Number);
      const d = new Date(year, month - 1, day);
      return d >= this.intervalDates.fromDate && d <= this.intervalDates.toDate;
    });

    values.forEach((item) => {
      const index = Number(item.valor) / 100;
      investmentValue *= 1 + index;

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
    monthlyInvest,
  }: CalcValuesProps): indexesResultsProps | undefined {
    if (!this.values || this.values.isLoading || this.values.isError) return;

    const indexesResults: indexesResultsProps = [];

    for (let idx = 0; idx < this.values.data.length; idx++) {
      let currentCalc;

      if (Array.isArray(this.values.data[idx])) {
        currentCalc = this.calcIndex({
          initialInvestiment,
          monthlyInvest,
          indexData: this.values.data[idx] as govResponse[],
        });
      } else {
        currentCalc = this.calcIBOV({
          ibovData: this.values.data[idx] as AlphaVantageResponse,
        });
      }

      const calcResults = super.generalValues({
        initialInvestiment,
        periodValues: currentCalc!.periodValues,
        periods: currentCalc!.periods,
        monthlyInvest,
      });

      indexesResults.push({
        name: this.values.orderedIndexes[idx],
        results: currentCalc!,
        calcResults,
      });
    }

    return indexesResults;
  }
}
