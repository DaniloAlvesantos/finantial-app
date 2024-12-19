import { z } from "zod";

export const backtestSchema = z.object({
  budget: z.object({
    initialInvestiment: z.string(),
    monthlyInvestiment: z.string().optional(),
  }),
  period: z.object({
    from: z.object({
      month: z.string(),
      year: z.string(),
    }),
    to: z.object({
      month: z.string(),
      year: z.string(),
    }),
  }),
  config: z.object({
    IPCA: z.boolean().optional(),
    CDI: z.boolean().optional(),
    IBOVESPA: z.boolean().optional(),
    PROCEEDS: z.boolean().optional(),
  }),
  tickets: z.array(
    z.object({
      ticket: z.string(),
      wallet1: z.string().nullable(),
      wallet2: z.string().nullable().optional(),
      wallet3: z.string().nullable().optional(),
    })
  ),
});

export type TicketFormValues = z.infer<typeof backtestSchema>;
