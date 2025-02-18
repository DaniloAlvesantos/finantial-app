import { TicketFormValues } from "../type";
import { Checkbox, Form } from "@/components/ui";
import { useBackTestForm } from "@/hooks/useFormProvider";
import { Path } from "react-hook-form";

export interface CheckBoxAreaProps {
  id: string;
  label: string;
  formKey: Path<TicketFormValues>;
}

export const CheckBoxArea = ({ id, label, formKey }: CheckBoxAreaProps) => {
  const { control } = useBackTestForm();
  return (
    <Form.FormField
      control={control}
      name={formKey}
      render={({ field }) => (
        <Form.FormItem className="flex gap-2 items-center my-2 space-y-0">
          <Form.FormControl>
            <Checkbox
              id={id}
              checked={field.value as boolean}
              onCheckedChange={field.onChange}
              className="data-[state=checked]:bg-app-green border-input size-5"
            />
          </Form.FormControl>
          <Form.FormLabel className="font-montserrat font-light ">
            {label}
          </Form.FormLabel>
          <Form.FormMessage />
        </Form.FormItem>
      )}
    />
  );
};
