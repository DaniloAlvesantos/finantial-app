import { TicketFormValues } from "@/components/forms/backtest/type";
import { create } from "zustand";

interface useBackTestStoreProps {
  formState: TicketFormValues | null;
  setFormState: (newState: TicketFormValues) => void;
  hasProcessedData: boolean;
  setHasProcessedData: (hasProcessedData: boolean) => void;
  tickets: string[];
  setTickets: (tickets: string[]) => void;
  indexeState: string[];
  setIndexeState: (indexes: string[]) => void;
}

export const useBackTestStore = create<useBackTestStoreProps>((set) => ({
  formState: null,
  setFormState: (newFormState: TicketFormValues) =>
    set({ formState: newFormState }),
  hasProcessedData: false,
  setHasProcessedData: (hasProcessedData) => set({ hasProcessedData }),
  tickets: [],
  indexeState: [],
  setIndexeState: (indexes) => set({ indexeState: indexes }),
  setTickets: (tickets) => set({ tickets }),
}));
