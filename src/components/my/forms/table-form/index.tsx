import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import * as table from "@/components/ui/table";
import { SearchTicketInput } from "./searchTicketsInput/searchTicketsInput";
import { Input } from "@/components/ui/input";

type TicketFormValues = {
  tickets: {
    ticket: string;
    wallet1: number;
    wallet2: number;
    wallet3: number;
  }[];
};

export const TableForm = () => {
  const { control, register, handleSubmit, setValue, watch } =
    useForm<TicketFormValues>({
      defaultValues: {
        tickets: Array.from({ length: 5 }, () => ({
          ticket: "",
          wallet1: 0,
          wallet2: 0,
          wallet3: 0,
        })),
      },
    });

  const { fields, append } = useFieldArray({
    control,
    name: "tickets",
  });

  const onSubmit = (data: TicketFormValues) => {
    console.log(data);
  };

  const handleTicketsQuant = () => {
    Array.from({ length: 5 }).forEach(() =>
      append({ ticket: "", wallet1: 0, wallet2: 0, wallet3: 0 })
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <table.Table>
        <table.TableHeader>
          <table.TableRow>
            <table.TableHead className="w-[6.25rem]">Ticket</table.TableHead>
            <table.TableHead className="w-16">Carteira-1</table.TableHead>
            <table.TableHead className="w-16">Carteira-2</table.TableHead>
            <table.TableHead className="w-16">Carteira-3</table.TableHead>
          </table.TableRow>
        </table.TableHeader>
        <table.TableBody>
          {fields.map((field, idx) => (
            <table.TableRow key={field.id}>
              <table.TableCell className="font-medium">
                <SearchTicketInput
                  placeholder={`Ticket ${idx + 1}`}
                  value={watch(`tickets.${idx}.ticket`)}
                  onChange={(value) => setValue(`tickets.${idx}.ticket`, value)}
                />
              </table.TableCell>
              <table.TableCell>
                <Input type="number" {...register(`tickets.${idx}.wallet1`)} />
              </table.TableCell>
              <table.TableCell>
                <Input type="number" {...register(`tickets.${idx}.wallet2`)} />
              </table.TableCell>
              <table.TableCell>
                <Input type="number" {...register(`tickets.${idx}.wallet3`)} />
              </table.TableCell>
            </table.TableRow>
          ))}
        </table.TableBody>
        <table.TableFooter>
          <table.TableRow>
            <table.TableCell>
              <Button type="button" onClick={handleTicketsQuant}>
                Adicionar 5+
              </Button>
            </table.TableCell>
            <table.TableCell colSpan={3}>
              <Button type="submit">Submit</Button>
            </table.TableCell>
          </table.TableRow>
        </table.TableFooter>
      </table.Table>
    </form>
  );
};
