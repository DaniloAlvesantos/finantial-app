import { AlphaVantageResponse, PeriodKeys } from "@/types/alphaVantageResponse";
import { govResponse } from "@/types/govResponse";
import { Calcs } from "./calc";
import { TicketFormValues } from "@/components/my/forms/backtest/type";

interface IndexesProps {
  indexes: {
    data: (AlphaVantageResponse | govResponse[] | null)[];
    isLoading: boolean;
    isError: boolean;
  };
}

type CalcValuesProps = {
  initialInvestiment: number;
  monthlyInvest?: number;
  interval: TicketFormValues["period"];
};

type CalcIBOVProps = CalcValuesProps["interval"];
type CalcIndexProps = CalcValuesProps;

export class IndexesCalc {
  private values: IndexesProps["indexes"];

  constructor({ indexes }: IndexesProps) {
    this.values = indexes;
  }

  calcIBOV(props: CalcIBOVProps) {
    if (!this.values || this.values.isLoading || this.values.isError) return;

    const { from, to } = props;

    // Ensure we get AlphaVantageResponse, not govResponse[]
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

  calcIndex({ initialInvestiment, interval, monthlyInvest }: CalcIndexProps) {
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

      res.push({
        periods: new Date(item.data),
        periodValues: investmentValue,
      });
    });

    return {
      periodValues: res.map((value) => Math.round(value.periodValues)),
      periods: res.map((value) => value.periods),
    };
  }

  calcValues({ initialInvestiment, interval, monthlyInvest }: CalcValuesProps) {
    if (!this.values || this.values.isLoading || this.values.isError) return;

    let periodResults;

    if (Array.isArray(this.values.data)) {
      periodResults = this.calcIndex({
        initialInvestiment,
        interval,
        monthlyInvest,
      });
    } else {
      periodResults = this.calcIBOV(interval);
    }

    if (!periodResults) return;

    const calc = new Calcs().generalValues({
      periods: periodResults.periods,
      initialInvestiment,
      periodValues: periodResults.periodValues,
      monthlyInvest,
    });

    return {
      ...calc,
      timeline: calc.timeline.map((item) => ({
        ...item,
        value: Math.round(item.value),
      })),
    };
  }
}
