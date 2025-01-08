import { AlphaVantageResponse } from "@/types/alphaVantageResponse";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosPromise } from "axios";

const apikey = process.env.api_key;

const fetchData = async (
  ticket: string
): AxiosPromise<AlphaVantageResponse> => {
  const response = await axios.get<AlphaVantageResponse>(`https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${ticket}&apikey=demo`);

  return response;
};

export function useStocks(ticket: string) {
  const query = useQuery({
    queryFn: () => fetchData(ticket),
    queryKey: ["stocks-data"],
    enabled: !!ticket,
  });

  return { ...query, data: query.data?.data };
}
