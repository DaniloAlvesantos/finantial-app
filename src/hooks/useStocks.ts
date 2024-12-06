import { StockAPIResponse } from "@/types/stockResponse";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosPromise } from "axios";

const fetchData = async (): AxiosPromise<StockAPIResponse> => {
  const response = await axios.get<StockAPIResponse>(
    "https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=IBM&apikey=demo"
  );

  return response;
};

export function useStocks() {
  const query = useQuery({
    queryFn: fetchData,
    queryKey: ["stocks-data"],
  });

  return { ...query, data: query.data?.data };
}
