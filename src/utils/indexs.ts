import { useBOV } from "@/hooks/useBOV";
import { useCDI } from "@/hooks/useCDI";
import { useIPCA } from "@/hooks/useIPCA";
import { AlphaVantageResponse, PeriodKeys } from "@/types/alphaVantageResponse";
import { govResponse } from "@/types/govResponse";
import { Calcs } from "./calc";

interface IndexesProps {
  isIBOV?: boolean;
  isCDI?: boolean;
  isIPCA?: boolean;
}

type calcValuesProps = {
  initialInvestiment: number;
  interval: {
    from: {
      year: string;
      month: string;
    };
    to: {
      year: string;
      month: string;
    };
  };
};

type getPeriodsValues = calcValuesProps["interval"];

export class Indexes {
  private values: AlphaVantageResponse | govResponse[] | undefined;

  constructor(params: IndexesProps) {
    if (params.isCDI) {
      this.values = useCDI().data;
    }

    if (params.isIPCA) {
      this.values = useIPCA().data;
    }

    if (params.isIBOV) {
      this.values = useBOV().data;
    }

    if (!params) {
      throw new Error("No params declared to Indexes");
    }
  }

  getPeriodsValues(props: getPeriodsValues) {
    if (this.values === undefined) return;

    const { from, to } = props;

    if (Array.isArray(this.values)) {
      const res = [];
      for (let i = 0; i < this.values.length; i++) {
        res.push({
          periods: new Date(this.values[i].data),
          periodValues: this.values[i].valor,
        });
      }
      return res;
    }
    
    const monthlyData = this.values?.[PeriodKeys.monthly];
    if (!monthlyData) {
      console.log("Monthly data is undefined.");
      return;
    }

    const periods = Object.keys(monthlyData)
      .sort()
      .map((date) => new Date(date))
      .filter((date) => date.getFullYear() >= 2015);

    const periodValues = Object.entries(monthlyData)
      .sort()
      .filter((item) => new Date(item[0]).getFullYear() >= 2015)
      .map((item) => Number(item[1]["5. adjusted close"]));

    return { periods, periodValues };
  }

  calcValues({ initialInvestiment, interval }: calcValuesProps) {
    // const periods;
    // const periodValues
    // const calc = new Calcs();
    // const calcRes = calc.generalValues({
    //   periods,
    //   initialInvestiment,
    //   periodValues,
    // });
  }
}
