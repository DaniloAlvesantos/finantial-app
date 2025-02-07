import { ChartConfig } from "@/components/ui/chart";

export const chartConfigDefault = {
  item1: {
    label: "Carteira-1",
    color: "hsl(var(--chart-1))",
  },
  item2: {
    label: "Carteira-2",
    color: "hsl(var(--chart-2))",
  },
  item3: {
    label: "Carteira-3",
    color: "hsl(var(--chart-3))",
  },
  CDI: {
    label: "CDI",
    color: "hsl(var(--CDI))",
  },
  IPCA: {
    label: "IPCA",
    color: "hsl(var(--IPCA))",
  },
  IBOVESPA: {
    label: "IBOVESPA",
    color: "hsl(var(--IBOVESPA))",
  },
} satisfies ChartConfig;
