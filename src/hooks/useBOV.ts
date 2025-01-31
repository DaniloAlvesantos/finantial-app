import { AlphaVantageResponse } from "@/types/alphaVantageResponse";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosPromise } from "axios";

const url = "https://www.alphavantage.co/query?apikey=HIUKSGQIL83OACKM&function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=BOVA11.SA&datatype=json"

const fetchData = async (): AxiosPromise<AlphaVantageResponse> => {
  const response = await axios.get<AlphaVantageResponse>(url);

  return response;
};

export function useBOV() {
  const query = useQuery({
    queryFn:fetchData,
    queryKey: ["IBOV-data"],
  });

  return { ...query, data: query.data?.data };
}
