import { TicketFormValues } from "@/components/forms/backtest/type";
import { useFormContext } from "react-hook-form";

export function useBackTestForm() {
  const form = useFormContext<TicketFormValues>();

  return form;
}
