import { TicketFormValues } from "@/components/forms/backtest/type";
import { create } from "zustand";

interface useBackTestStoreProps {
  formState: TicketFormValues | null;
  setFormState: (newState: TicketFormValues) => void;
}

export const useBackTestStore = create<useBackTestStoreProps>((set) => ({
  formState: null,
  setFormState: (newFormState: TicketFormValues) =>
    set({ formState: newFormState }),
}));
