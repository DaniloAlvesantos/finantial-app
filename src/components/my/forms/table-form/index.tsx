import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import * as table from "@/components/ui/table";
import { SearchTicketInput } from "./searchTicketsInput/searchTicketsInput";
import { Input } from "@/components/ui/input";
import { TableFormHeader } from "./table/tableHeader";
import { Percent } from "lucide-react";

export type TicketFormValues = {
  tickets: {
    ticket: string;
    wallet1: number | null;
    wallet2: number | null;
    wallet3: number | null;
  }[];
};

export const TableForm = () => {
  const form = useForm<TicketFormValues>({
    defaultValues: {
      tickets: Array.from({ length: 5 }, () => ({
        ticket: "",
        wallet1: null,
        wallet2: null,
        wallet3: null,
      })),
    },
  });

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "tickets",
  });

  const onSubmit = (data: TicketFormValues) => {
    console.log(data);
  };

  const handleTicketsQuant = () => {
    Array.from({ length: 5 }).forEach(() =>
      append({ ticket: "", wallet1: null, wallet2: null, wallet3: null })
    );
  };

  const tickets = form.watch("tickets");
  const totalWallet1 = tickets.reduce(
    (total, num) => total + Number(num.wallet1),
    0
  );
  const totalWallet2 = tickets.reduce(
    (total, num) => total + Number(num.wallet2),
    0
  );
  const totalWallet3 = tickets.reduce(
    (total, num) => total + Number(num.wallet3),
    0
  );

  // const totalWallet = Array.from({ length: 3 }, (_, i) => {
  //   return tickets.reduce((total, num) => total + Number(num[`wallet`+ i + 1]),0);
  // })


  // console.log(totalWallet)

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <table.Table>
          <TableFormHeader />
          <table.TableBody>
            {fields.map((field, idx) => (
              <table.TableRow key={field.id}>
                <table.TableCell className="font-medium">
                  <SearchTicketInput
                    placeholder={`Ticket ${idx + 1}`}
                    value={form.watch(`tickets.${idx}.ticket`)}
                    onChange={(value) =>
                      form.setValue(`tickets.${idx}.ticket`, value)
                    }
                  />
                </table.TableCell>
                <table.TableCell>
                  <label className="relative">
                    <Input
                      type="number"
                      max={100}
                      min={0}
                      className="border-app-dark/20 focus-visible:ring-app-dark text-right pr-5"
                      {...form.register(`tickets.${idx}.wallet1`)}
                    />
                    <Percent className="absolute right-1 top-[.6rem] size-4 text-app-dark/80" />
                  </label>
                </table.TableCell>
                <table.TableCell>
                  <label className="relative">
                    <Input
                      type="number"
                      max={100}
                      min={0}
                      className="border-app-dark/20 focus-visible:ring-app-dark text-right pr-5"
                      {...form.register(`tickets.${idx}.wallet2`)}
                    />
                    <Percent className="absolute right-1 top-[.6rem] size-4 text-app-dark/80" />
                  </label>
                </table.TableCell>
                <table.TableCell>
                  <label className="relative">
                    <Input
                      type="number"
                      max={100}
                      min={0}
                      className="border-app-dark/20 focus-visible:ring-app-dark text-right pr-5"
                      {...form.register(`tickets.${idx}.wallet3`)}
                    />
                    <Percent className="absolute right-1 top-[.6rem] size-4 text-app-dark/80" />
                  </label>
                </table.TableCell>
              </table.TableRow>
            ))}
          </table.TableBody>
          <table.TableFooter>
            <table.TableRow>
              <table.TableCell>
                <Button
                  type="button"
                  onClick={handleTicketsQuant}
                  variant="link"
                >
                  Adicionar 5+
                </Button>
              </table.TableCell>
              <table.TableCell
                className={`text-right ${
                  totalWallet1 > 100 ? "text-red-500" : "text-app-dark"
                }`}
              >
                {totalWallet1 + "%"}
              </table.TableCell>
              <table.TableCell
                className={`text-right ${
                  totalWallet2 > 100 ? "text-red-500" : "text-app-dark"
                }`}
              >
                {totalWallet2 + "%"}
              </table.TableCell>
              <table.TableCell
                className={`text-right ${
                  totalWallet3 > 100 ? "text-red-500" : "text-app-dark"
                }`}
              >
                {totalWallet3 + "%"}
              </table.TableCell>
            </table.TableRow>
          </table.TableFooter>
        </table.Table>
      </form>
    </FormProvider>
  );
};
