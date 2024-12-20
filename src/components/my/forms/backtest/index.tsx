import { useFieldArray, SubmitHandler } from "react-hook-form";

import { table, Button } from "@/components/ui";
import { TableFormHeader } from "./table/tableFormHeader";
import { TableFormBody } from "./table/tableFormBody";

import { Period } from "./period/period";
import { Budget } from "./budget/budget";
import { Configs } from "./configs/configs";
import { TicketFormValues } from "./type";

import { useBackTestForm } from "@/hooks/useFormProvider";
import { TableFormFooter } from "./table/tableFormFooter";

interface TableFormProps {
  onSubmit: SubmitHandler<TicketFormValues>;
}

export const TableForm = ({ onSubmit }: TableFormProps) => {
  const form = useBackTestForm();

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "tickets",
    rules: { maxLength: 50 },
  });

  const handleTicketsQuant = () => {
    Array.from({ length: 5 }).forEach(() =>
      append({ ticket: "", wallet1: null, wallet2: null, wallet3: null })
    );
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <section className="">
        <div className="flex flex-col gap-8 sm:flex-row sm:gap-[15%]">
          <Budget />
          <Period />
        </div>
        <Configs />
      </section>
      <table.Table>
        <TableFormHeader />
        <TableFormBody fields={fields} />
        <TableFormFooter handleTicketsQuant={handleTicketsQuant} />
      </table.Table>
      {form.formState.errors.tickets ? (
        <p className="text-red-600 border border-rose-500 bg-rose-300 px-2 py-1 rounded w-[20rem] md:max-w-[50%]">
          {form.formState.errors.tickets.root?.message}
        </p>
      ) : null}
      <Button type="submit">Enviar</Button>
    </form>
  );
};
