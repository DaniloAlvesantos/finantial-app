import { BudgetArea, BudgetAreaProps } from "./budgetArea";

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

export const Budget = () => {
  return (
    <div className="flex flex-col gap-4">
      {BudgetAreaData.map((item, idx) => (
        <BudgetArea key={idx} {...item} />
      ))}
    </div>
  );
};
