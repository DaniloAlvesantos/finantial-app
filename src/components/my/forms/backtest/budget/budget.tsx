import { TicketFormValues } from "../type";
import { Input, Form } from "@/components/ui";
import { useBackTestForm } from "@/hooks/useFormProvider";
import { Path } from "react-hook-form";

interface BudgetAreaProps {
  label: string;
  formKey: Path<TicketFormValues>;
}

const BudgetAreaData: BudgetAreaProps[] = [
  {
    label: "Aporte inicial",
    formKey: "budget.initialInvestiment",
  },
  {
    label: "Aporte mensal",
    formKey: "budget.monthlyInvestiment",
  },
];

const BudgetArea = ({ formKey, label }: BudgetAreaProps) => {
  const { control } = useBackTestForm();
  return (
    <Form.FormField
      control={control}
      name={formKey}
      rules={{ min: 0 }}
      render={({ field }) => (
        <Form.FormItem className="flex-col relative">
          <Form.FormLabel className="font-poppins m-1">{label}</Form.FormLabel>
          <Form.FormControl>
            <Input
              id={formKey}
              className="w-28 font-montserrat pl-7"
              type="number"
              placeholder="0"
              {...field}
              value={(field.value as number) ?? ""}
            />
          </Form.FormControl>
          <p className="font-montserrat text-sm text-app-green absolute top-8 ml-2">
            R$
          </p>
          <Form.FormMessage />
        </Form.FormItem>
      )}
    />
  );
};

export const Budget = () => {
  return (
    <div className="flex flex-col gap-4">
      {BudgetAreaData.map((item, idx) => (
        <BudgetArea key={idx} {...item} />
      ))}
    </div>
  );
};
