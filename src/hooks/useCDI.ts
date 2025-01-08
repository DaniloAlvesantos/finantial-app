import { TicketResponse } from "@/types/ticketResponse";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosPromise } from "axios";

const url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.4391/dados?formato=json"

const fetchData = async (): AxiosPromise<TicketResponse> => {
  const response = await axios.get<TicketResponse>(url);

  return response;
};

export function useCDI() {
  const query = useQuery({
    queryFn:fetchData,
    queryKey: ["CDI-data"],
  });

  return { ...query, data: query.data?.data };
}
