import { StockAPIResponse } from "@/types/stockResponse";
import { useQuery, useQueries } from "@tanstack/react-query";
import axios, { AxiosPromise } from "axios";

const fetchData = async (ticket: string): AxiosPromise<StockAPIResponse> => {
  const response = await axios.get<StockAPIResponse>(
    "https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=IBM&apikey=demo"
    // "https://www.alphavantage.co/query?apikey=HIUKSGQIL83OACKM&function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=BOVA11.SA&datatype=json"
  );

  return response;
};

export function useStocks(ticket: string) {
  const query = useQuery({
    queryFn: () => fetchData(ticket),
    queryKey: ["stocks-data"],
    enabled: !!ticket,
  });

  // const query = useQueries({
  //   queries: tickets.map((ticket) => ({
  //     queryKey: ["stock-data", ticket],
  //     queryFn: () => fetchData(ticket),
  //     enabled: !!ticket,
  //   })),
  // });

  // const results = query.map((values) => values.data?.data);

  return { ...query, data: query.data?.data };
}
