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
  tickets: z
    .array(
      z.object({
        ticket: z.string(),
        wallet1: z.string().nullable(),
        wallet2: z.string().nullable().optional(),
        wallet3: z.string().nullable().optional(),
      })
    )
    .superRefine((val, ctx) => {
      const hasEmptyTicketsWithPercentage = val.some(
        (fields, idx) =>
          (!fields.ticket.trim().length && fields.wallet1) ||
          fields.wallet2 ||
          fields.wallet3
      );
      const atLeastOneFilled = val.some(
        (ticket) => ticket.ticket.length && ticket.wallet1
      );

      // if (hasEmptyTicketsWithPercentage) {
      //   ctx.addIssue({
      //     code: z.ZodIssueCode.not_finite,
      //     message: "Nenhuma alocação definida",
      //     fatal: true,
      //   });
      // }
      if (!atLeastOneFilled) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Preencher pelo menos uma alocação!",
          fatal: true,
        });
      }
    })
    .transform((val) =>
      val.filter(
        (ticket) =>
          ticket.ticket.trim() !== "" ||
          ticket.wallet1 !== null ||
          ticket.wallet2 !== null ||
          ticket.wallet3 !== null
      )
    ),
});

export type TicketFormValues = z.infer<typeof backtestSchema>;
