import axios from "axios";
import { SelicResponse } from "@/types/selicResponse";

export const getSelicData = async () => {
  const present = new Date().getFullYear();
  const { data, statusText } = await axios.get<SelicResponse[]>(
    `https://api.bcb.gov.br/dados/serie/bcdata.sgs.4189/dados?formato=json&dataInicial=01/01/${present}`
  );

  if (!data) {
    return statusText;
  }

  return data;
};
