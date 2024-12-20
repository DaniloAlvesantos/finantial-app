import { table, Form, Input } from "@/components/ui";
import { Percent } from "lucide-react";
import { SearchTicketInput } from "../searchTicketsInput/searchTicketsInput";
import { FieldArrayWithId } from "react-hook-form";
import { TicketFormValues } from "../type";
import { useBackTestForm } from "@/hooks/useFormProvider";

interface TableFormBodyProps {
  fields: FieldArrayWithId<TicketFormValues[]>[];
}

export const TableFormBody = ({ fields }: TableFormBodyProps) => {
  const { control, register } = useBackTestForm();
  return (
    <table.TableBody>
      {fields.map((field, idx) => (
        <table.TableRow key={field.id}>
          <table.TableCell className="font-medium">
            <Form.FormField
              control={control}
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
                {...register(`tickets.${idx}.wallet1`)}
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
                {...register(`tickets.${idx}.wallet2`)}
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
                {...register(`tickets.${idx}.wallet3`)}
              />
              <Percent className="absolute right-1.5 size-4 text-app-dark/80" />
            </label>
          </table.TableCell>
        </table.TableRow>
      ))}
    </table.TableBody>
  );
};
