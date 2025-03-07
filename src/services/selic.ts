import axios from "axios";
import { SelicResponse } from "@/types/selicResponse";
import { TicketFormValues } from "@/components/forms/backtest/type";

export const getSelicData = async () => {
  const present = new Date().getFullYear();
  const { data, statusText } = await axios.get<SelicResponse[]>(
    `https://api.bcb.gov.br/dados/serie/bcdata.sgs.4189/dados?formato=json&dataInicial=01/01/${present}`
  );

  if (!data) {
    return statusText;
  }

  return data[data.length - 1].valor;
};

interface getSelicAsBenchmarkProps {
  interval: TicketFormValues["period"];
}

export const getSelicAsBenchmark = async ({
  interval,
}: getSelicAsBenchmarkProps) => {
  if (!interval) return [];

  const { from, to } = interval;
  const initialDate = `01/${from.month}/${from.year}`;
  const endDate = `01/${to.month}/${to.year}`;

  const { data } = await axios.get<SelicResponse[]>(
    `https://api.bcb.gov.br/dados/serie/bcdata.sgs.4189/dados?formato=json&dataInicial=${initialDate}&dataFinal=${endDate}`
  );

  return data.map((val) => Math.pow(1 + Number(val.valor) / 100, 1 / 12) - 1);
};
