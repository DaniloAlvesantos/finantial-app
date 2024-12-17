import { Select, Label } from "@/components/ui";
import { months, years } from "./type";
import { useFormContext } from "react-hook-form";
import { memo } from "react";

interface SelectCompProps {
  placeholder: string;
  data: any[];
  type: "Month" | "Year";
  value: string;
  onChange: (value: string) => void;
}

const SelectComp = memo((props: SelectCompProps) => {
  const { data, placeholder, type, onChange, value } = props;

  return (
    <Select.Select value={value} onValueChange={onChange}>
      <Select.SelectTrigger className="w-[180px] font-montserrat">
        <Select.SelectValue placeholder={placeholder} />
      </Select.SelectTrigger>
      <Select.SelectContent className="font-montserrat">
        {type === "Month"
          ? data.map((item, idx) => (
              <Select.SelectItem value={item.value} key={idx}>
                {item.month}
              </Select.SelectItem>
            ))
          : data.map((item, idx) => (
              <Select.SelectItem value={String(item)} key={idx}>
                {item}
              </Select.SelectItem>
            ))}
      </Select.SelectContent>
    </Select.Select>
  );
});

export const Period = () => {
  const { watch, setValue } = useFormContext();
  return (
    <div>
      <p className="font-poppins">Período</p>
      <span className="flex items-center gap-2 my-2">
        <Label className="mr-1 font-poppins">De:</Label>
        <SelectComp
          value={watch("period.from.month")}
          onChange={(value) => setValue("period.from.month", value)}
          placeholder="Mês"
          type="Month"
          data={months}
        />
        <SelectComp
          value={watch("period.from.year")}
          onChange={(value) => setValue("period.from.year", value)}
          placeholder="Ano"
          type="Year"
          data={years}
        />
      </span>

      <span className="flex items-center gap-2">
        <Label className="font-poppins">Até:</Label>
        <SelectComp
          value={watch("period.to.month")}
          onChange={(value) => setValue("period.to.month", value)}
          placeholder="Mês"
          type="Month"
          data={months}
        />
        <SelectComp
          value={watch("period.to.year")}
          onChange={(value) => setValue("period.to.year", value)}
          placeholder="Ano"
          type="Year"
          data={years}
        />
      </span>
    </div>
  );
};
