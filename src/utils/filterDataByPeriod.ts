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

  const alphaPeriods = Object.keys(data)
    .sort()
    .map((date) => new Date(date))
    .filter((date) => date >= fromDate && date <= toDate);

  const alphaValues = Object.entries(data)
    .sort()
    .filter(([date]) => {
      const d = new Date(date);
      return d >= fromDate && d <= toDate;
    })
    .map(([, value]) => Number(value["5. adjusted close"]));

  return {
    periods: alphaPeriods,
    periodValues: alphaValues,
  };
};
