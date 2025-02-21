import { TicketResponse } from "@/types/ticketResponse";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosPromise } from "axios";

const apiKey = process.env.api_key;

const fetchData = async (ticket: string): AxiosPromise<TicketResponse> => {
  const response = await axios.get<TicketResponse>(
    `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=tesco&apikey=demo`
    // `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${ticket}&apikey=${apiKey}`
  );

  return response;
};

export function useTickets(ticket: string) {
  const query = useQuery({
    queryFn: () => fetchData(ticket),
    queryKey: ["tickets-data"],
    enabled: !!ticket,
  });

  return { ...query, data: query.data?.data };
}
