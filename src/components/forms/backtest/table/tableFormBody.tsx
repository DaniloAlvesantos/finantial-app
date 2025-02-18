import { table, Form, Input } from "@/components/ui";
import { Percent } from "lucide-react";
import { SearchTicketInput } from "../searchTicketsInput/searchTicketsInput";
import { FieldArrayWithId } from "react-hook-form";
import { TicketFormValues } from "../type";
import { useBackTestForm } from "@/hooks/useFormProvider";
import { PercentTicketsInput } from "../percentTicketsInput/percentTicketsInput";

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
            <PercentTicketsInput formKey={`tickets.${idx}.wallet1`} />
          </table.TableCell>
          <table.TableCell>
            <PercentTicketsInput formKey={`tickets.${idx}.wallet2`} />
          </table.TableCell>
          <table.TableCell>
            <PercentTicketsInput formKey={`tickets.${idx}.wallet3`} />
          </table.TableCell>
        </table.TableRow>
      ))}
    </table.TableBody>
  );
};
