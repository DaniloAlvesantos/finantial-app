import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { SearchTicketInput } from "./searchTicketsInput/searchTicketsInput";
import { TableFormHeader } from "./table/tableHeader";
import { Percent } from "lucide-react";
import { currencyFormatter } from "@/lib/currencyFormatter";

import { table, Button, Input, Label, Select } from "@/components/ui";

import { months, years } from "./budget/type";

export type TicketFormValues = {
  initialInvestiment: number;
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

  const totalWallet = Array.from({ length: 3 }, (_, i) => {
    return tickets.reduce((total, num) => {
      const key = `wallet${i + 1}` as keyof typeof num;
      return total + Number(num[key]);
    }, 0);
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <section>
          <div>
            <span className="flex sm:flex-col">
              <Label htmlFor="initialInvestiment" className="font-poppins m-1">
                Aporte Inicial
              </Label>
              <Input
                {...form.register("initialInvestiment")}
                id="initialInvestiment"
                type="number"
                className="w-24"
              />
              <p className="font-montserrat text-sm text-app-green m-1">
                {currencyFormatter.format(
                  Number(form.watch("initialInvestiment"))
                )}
              </p>
            </span>
          </div>
          <div>
            <p>Período</p>
            <span className="flex items-center gap-2 my-2">
              <Label className="mr-1 font-poppins">De:</Label>
              <Select.Select>
                <Select.SelectTrigger className="w-[180px] font-montserrat">
                  <Select.SelectValue placeholder="Mês" />
                </Select.SelectTrigger>
                <Select.SelectContent className="font-montserrat">
                  {months.map((item, idx) => (
                    <Select.SelectItem value={item.value} key={idx}>
                      {item.month}
                    </Select.SelectItem>
                  ))}
                </Select.SelectContent>
              </Select.Select>
              <Select.Select>
                <Select.SelectTrigger className="w-[180px] font-montserrat">
                  <Select.SelectValue placeholder="Ano" />
                </Select.SelectTrigger>
                <Select.SelectContent className="font-montserrat">
                  {years.map((item, idx) => (
                    <Select.SelectItem value={String(item)} key={idx}>
                      {item}
                    </Select.SelectItem>
                  ))}
                </Select.SelectContent>
              </Select.Select>
            </span>

            <span className="flex items-center gap-2">
              <Label className="font-poppins">Até:</Label>
              <Select.Select>
                <Select.SelectTrigger className="w-[180px] font-montserrat">
                  <Select.SelectValue placeholder="Mês" />
                </Select.SelectTrigger>
                <Select.SelectContent className="font-montserrat">
                  {months.map((item, idx) => (
                    <Select.SelectItem value={item.value} key={idx}>
                      {item.month}
                    </Select.SelectItem>
                  ))}
                </Select.SelectContent>
              </Select.Select>
              <Select.Select>
                <Select.SelectTrigger className="w-[180px] font-montserrat">
                  <Select.SelectValue placeholder="Ano" />
                </Select.SelectTrigger>
                <Select.SelectContent className="font-montserrat">
                  {years.map((item, idx) => (
                    <Select.SelectItem value={String(item)} key={idx}>
                      {item}
                    </Select.SelectItem>
                  ))}
                </Select.SelectContent>
              </Select.Select>
            </span>
          </div>
        </section>
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
                  totalWallet[0] > 100 ? "text-red-500" : "text-app-dark"
                }`}
              >
                {totalWallet[0] + "%"}
              </table.TableCell>
              <table.TableCell
                className={`text-right ${
                  totalWallet[1] > 100 ? "text-red-500" : "text-app-dark"
                }`}
              >
                {totalWallet[1] + "%"}
              </table.TableCell>
              <table.TableCell
                className={`text-right ${
                  totalWallet[2] > 100 ? "text-red-500" : "text-app-dark"
                }`}
              >
                {totalWallet[2] + "%"}
              </table.TableCell>
            </table.TableRow>
          </table.TableFooter>
        </table.Table>
      </form>
    </FormProvider>
  );
};
