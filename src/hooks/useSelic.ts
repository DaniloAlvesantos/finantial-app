import { useQuery } from "@tanstack/react-query";
import axios, { AxiosPromise } from "axios";
import { SelicResponse } from "@/types/selicResponse";
import { TicketFormValues } from "@/components/forms/backtest/type";

// Helper function for current year SELIC
const fetchCurrentSelic = async (): AxiosPromise<SelicResponse[]> => {
  const present = new Date().getFullYear();
  return axios.get(
    `https://api.bcb.gov.br/dados/serie/bcdata.sgs.4189/dados?formato=json&dataInicial=01/01/${present}`
  );
};

export function useSelicCurrentMonth() {
  return useQuery({
    queryKey: ["selic-current-year"],
    queryFn: fetchCurrentSelic,
    select: (data) => {
      if (!data.data || data.data.length === 0) return null;
      return Number(data.data[data.data.length - 1].valor);
    },
  });
}

// Helper function for benchmark SELIC
const fetchSelicBenchmark = async (
  interval: TicketFormValues["period"]
): AxiosPromise<SelicResponse[]> => {
  const { from, to } = interval;
  const initialDate = `01/${from.month}/${from.year}`;
  const endDate = `01/${to.month}/${to.year}`;
  return axios.get(
    `https://api.bcb.gov.br/dados/serie/bcdata.sgs.4189/dados?formato=json&dataInicial=${initialDate}&dataFinal=${endDate}`
  );
};

export function useSelicBenchmark(interval: TicketFormValues["period"] | undefined) {
  return useQuery({
    queryKey: ["selic-benchmark", interval],
    queryFn: () => fetchSelicBenchmark(interval!),
    enabled: !!interval,
    select: (data) => {
      return data.data.map((val) => Number(val.valor) / 100);
    },
  });
}