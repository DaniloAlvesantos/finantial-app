import { Label } from "@/components/ui";
import { months, years } from "./type";
import { SelectComp } from "./selectComp"

export const Period = () => {
  return (
    <div>
      <p className="font-poppins">Período</p>
      <span className="flex items-center gap-2 my-2">
        <Label className="mr-1 font-poppins">De:</Label>
        <SelectComp
          formKey="period.from.month"
          placeholder="Mês"
          type="Month"
          data={months}
        />
        <SelectComp
          formKey="period.from.year"
          placeholder="Ano"
          type="Year"
          data={years}
        />
      </span>

      <span className="flex items-center gap-2">
        <Label className="font-poppins">Até:</Label>
        <SelectComp
          formKey="period.to.month"
          placeholder="Mês"
          type="Month"
          data={months}
        />
        <SelectComp
          formKey="period.to.year"
          placeholder="Ano"
          type="Year"
          data={years}
        />
      </span>
    </div>
  );
};
