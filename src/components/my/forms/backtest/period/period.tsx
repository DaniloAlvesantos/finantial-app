import { Select, Label, Form } from "@/components/ui";
import { months, years } from "./type";
import { useBackTestForm } from "@/hooks/useFormProvider";
import { memo } from "react";
import { TicketFormValues } from "../type";
import { Path } from "react-hook-form";

interface SelectCompProps {
  placeholder: string;
  data: any[];
  type: "Month" | "Year";
  formKey: Path<TicketFormValues>;
}

const SelectComp = memo((props: SelectCompProps) => {
  const { data, placeholder, type, formKey } = props;
  const { control } = useBackTestForm();
  return (
    <Form.FormField
      control={control}
      name={formKey}
      render={({ field }) => (
        <Form.FormItem>
          <Select.Select onValueChange={field.onChange}>
            <Form.FormControl>
              <Select.SelectTrigger className="w-[180px] font-montserrat">
                <Select.SelectValue placeholder={placeholder} />
              </Select.SelectTrigger>
            </Form.FormControl>
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
          <Form.FormMessage />
        </Form.FormItem>
      )}
    />
  );
});

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
