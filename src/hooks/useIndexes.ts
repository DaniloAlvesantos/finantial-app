import { AlphaVantageResponse } from "@/types/alphaVantageResponse";
import { govResponse } from "@/types/govResponse";
import { useQueries } from "@tanstack/react-query";
import axios from "axios";

interface useIndexesProps {
  indexes: string[];
}

type IndexType = "CDI" | "IPCA" | "IBOVESPA";

interface IndexOption {
  name: IndexType;
  url: string;
}

const indexesOptions: IndexOption[] = [
  {
    name: "CDI",
    url: "https://api.bcb.gov.br/dados/serie/bcdata.sgs.4391/dados?formato=json",
  },
  {
    name: "IPCA",
    url: "https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados?formato=json",
  },
  {
    name: "IBOVESPA",
    url: "https://www.alphavantage.co/query?apikey=HIUKSGQIL83OACKM&function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=BOVA11.SA&datatype=json",
  },
];

const fetchData = async <T>(url: string): Promise<T> => {
  const response = await axios.get<T>(url);
  return response.data;
};

const isAlphaVantageResponse = (data: any): data is AlphaVantageResponse => {
  return !!data["Meta Data"];
};

export function useIndexes({ indexes }: useIndexesProps) {
  const validIndexes = indexes
    .map((indexName) => indexesOptions.find((i) => i.name === indexName))
    .filter((indexOption): indexOption is IndexOption => !!indexOption);

  const queries = useQueries({
    queries: validIndexes.map((indexOption) => ({
      queryKey: ["index-data", indexOption.name],
      queryFn: () =>
        fetchData<AlphaVantageResponse | govResponse[]>(indexOption.url),
      enabled: !!indexOption.url.length,
      retry: 3,
      retryDelay: 1000,
    })),
  });

  const results = queries.map((query) => {
    if (!query.data) return null;
    return isAlphaVantageResponse(query.data)
      ? (query.data as AlphaVantageResponse)
      : (query.data as govResponse[]);
  });

  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);

  return { data: results, isLoading, isError };
}
