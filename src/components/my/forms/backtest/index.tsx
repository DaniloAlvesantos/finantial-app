import { useFieldArray, SubmitHandler } from "react-hook-form";
import { SearchTicketInput } from "./searchTicketsInput/searchTicketsInput";
import { TableFormHeader } from "./table/tableHeader";
import { Percent } from "lucide-react";

import { table, Button, Input, Form } from "@/components/ui";

import { Period } from "./period/period";
import { Budget } from "./budget/budget";
import { Configs } from "./configs/configs";
import { TicketFormValues } from "./type";

import { useBackTestForm } from "@/hooks/useFormProvider";
import { TableFooter } from "./table/tableFooter";

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
  }
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <section className="">
        <div className="flex flex-col gap-8 sm:flex-row sm:gap-[20%]">
          <Budget />
          <Period />
        </div>
        <Configs />
      </section>
      <table.Table>
        <TableFormHeader />
        <table.TableBody>
          {fields.map((field, idx) => (
            <table.TableRow key={field.id}>
              <table.TableCell className="font-medium">
                <Form.FormField
                  control={form.control}
                  name={`tickets.${idx}.ticket`}
                  render={({ field }) => (
                    <Form.FormItem>
                      <Form.FormControl>
                        <SearchTicketInput
                          placeholder={`Ticket ${idx + 1}`}
                          value={field.value ?? ""}
                          onChange={field.onChange}
                        />
                      </Form.FormControl>
                      <Form.FormMessage />
                    </Form.FormItem>
                  )}
                />
              </table.TableCell>
              <table.TableCell>
                <label className="relative w-16 sm:w-auto flex items-center">
                  <Input
                    type="number"
                    max={100}
                    min={0}
                    className="border-app-dark/20 focus-visible:ring-app-dark text-right sm:pr-5 relative"
                    {...form.register(`tickets.${idx}.wallet1`)}
                  />
                  <Percent className="absolute right-1.5 size-4 text-app-dark/80" />
                </label>
              </table.TableCell>
              <table.TableCell>
                <label className="relative w-16 sm:w-auto flex items-center">
                  <Input
                    type="number"
                    max={100}
                    min={0}
                    className="border-app-dark/20 focus-visible:ring-app-dark text-right sm:pr-5 relative"
                    {...form.register(`tickets.${idx}.wallet2`)}
                  />
                  <Percent className="absolute right-1.5 size-4 text-app-dark/80" />
                </label>
              </table.TableCell>
              <table.TableCell>
                <label className="relative w-16 sm:w-auto flex items-center">
                  <Input
                    type="number"
                    max={100}
                    min={0}
                    className="border-app-dark/20 focus-visible:ring-app-dark text-right sm:pr-5 relative"
                    {...form.register(`tickets.${idx}.wallet3`)}
                  />
                  <Percent className="absolute right-1.5 size-4 text-app-dark/80" />
                </label>
              </table.TableCell>
            </table.TableRow>
          ))}
        </table.TableBody>
        <TableFooter handleTicketsQuant={handleTicketsQuant} />
      </table.Table>
      <Button type="submit">Enviar</Button>
    </form>
  );
};
