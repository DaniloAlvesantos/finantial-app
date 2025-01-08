import { AlphaVantageResponse } from "@/types/alphaVantageResponse";
import { useQueries } from "@tanstack/react-query";
import axios, { AxiosPromise } from "axios";

const apikey = process.env.api_key;

const fetchData = async (ticket: string): AxiosPromise<AlphaVantageResponse> => {
  const response = await axios.get<AlphaVantageResponse>(
    `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${ticket}&apikey=demo`
  );

  return response;
};

export function useMultStocks(tickets: string[]) {
  const query = useQueries({
    queries: tickets.map((ticket) => ({
      queryKey: ["stock-data", ticket],
      queryFn: () => fetchData(ticket),
      enabled: !!ticket,
    })),
  });

  const results = query.map((values) => values.data?.data);

  return { query, data: results };
}
