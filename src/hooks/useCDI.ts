import { govResponse } from "@/types/govResponse";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosPromise } from "axios";

const url =
  "https://api.bcb.gov.br/dados/serie/bcdata.sgs.4391/dados?formato=json";

const fetchData = async (): AxiosPromise<govResponse[]> => {
  const response = await axios.get<govResponse[]>(url);

  return response;
};

export function useCDI() {
  const query = useQuery({
    queryFn: fetchData,
    queryKey: ["CDI-data"],
  });

  return { ...query, data: query.data?.data };
}
