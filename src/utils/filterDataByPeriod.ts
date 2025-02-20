import { TicketFormValues } from "@/components/forms/backtest/type";
import { AlphaVantageResponse } from "@/types/alphaVantageResponse";
import { govResponse } from "@/types/govResponse";

type filterDataByPeriodProps = {
  interval: TicketFormValues["period"];
  data: AlphaVantageResponse["Monthly Adjusted Time Series"] | govResponse[];
};

export const filterDataByPeriod = ({
  data,
  interval,
}: filterDataByPeriodProps) => {
  if (!data) return;

  const fromDate = new Date(`${interval.from.year}-${interval.from.month}-01`);
  const toDate = new Date(`${interval.to.year}-${interval.to.month}-01`);

  if (Array.isArray(data)) {
    const govData = data
      .filter((item) => item !== null && "data" in item)
      .filter((item) => {
        const d = new Date(item.data);
        return d >= fromDate && d <= toDate;
      });

    return govData;
  }

  const alphaPeriods: Date[] = [];
  const alphaValues: number[] = [];
  const alphaDividends: number[] = [];
  const alphaSharesPricing: number[] = [];

  Object.entries(data)
    .sort()
    .forEach(([date, value]) => {
      const d = new Date(date);
      if (d >= fromDate && d <= toDate) {
        alphaPeriods.push(d);
        alphaValues.push(Number(value["5. adjusted close"]));
        alphaDividends.push(Number(value["7. dividend amount"]));
        alphaSharesPricing.push(Number(value["4. close"]));
      }
    });

  return {
    periods: alphaPeriods,
    periodValues: alphaValues,
    dividendsValues: alphaDividends,
    sharesPrice: alphaSharesPricing
  };
};
