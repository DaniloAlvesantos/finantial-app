import { Select, Form } from "@/components/ui";
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

export const SelectComp = memo((props: SelectCompProps) => {
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
              <Select.SelectTrigger className="w-32 sm:w-[11.25rem] font-montserrat">
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
