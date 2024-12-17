import { Label, Input } from "@/components/ui";
import { currencyFormatter } from "@/lib/currencyFormatter";
import { useFormContext } from "react-hook-form";

interface BudgetAreaProps {
  label: string;
  formKey: string;
}

const BudgetAreaData: BudgetAreaProps[] = [
  {
    label: "Aporte inicial",
    formKey: "initialInvestiment",
  },
  {
    label: "Aporte mensal",
    formKey: "monthlyInvestiment",
  },
];

const BudgetArea = ({ formKey, label }: BudgetAreaProps) => {
  const { register, watch } = useFormContext();
  return (
    <span className="flex-col">
      <Label htmlFor={formKey} className="font-poppins m-1">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <Input
          {...register(formKey)}
          id={formKey}
          type="number"
          className="w-28"
        />
        <p className="font-montserrat text-[.8125rem] tracking-wide text-app-green m-1">
          {currencyFormatter.format(Number(watch(formKey)))}
        </p>
      </div>
    </span>
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
