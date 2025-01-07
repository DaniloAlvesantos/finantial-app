import { Form, Input } from "@/components/ui";
import { Path } from "react-hook-form";
import { TicketFormValues } from "../type";
import { useBackTestForm } from "@/hooks/useFormProvider";
import { Percent } from "lucide-react";

interface PercentTicketsInputProps {
  formKey: Path<TicketFormValues>;
}

export const PercentTicketsInput = ({ formKey }: PercentTicketsInputProps) => {
  const { control } = useBackTestForm();

  return (
    <Form.FormField
      control={control}
      name={formKey}
      rules={{ min: 1, max: 100 }}
      render={({ field }) => (
        <Form.FormItem className="relative w-16 sm:w-auto flex items-center space-y-0">
          <Form.FormControl>
            <Input
              type="number"
              max={100}
              min={0}
              className="border-app-dark/20 focus-visible:ring-app-dark text-right sm:pr-5 relative"
              {...field}
              value={(field.value as number) ?? ""}
            />
          </Form.FormControl>
          <Percent className="absolute right-1.5 size-4 text-app-dark/80" />
        </Form.FormItem>
      )}
    />
  );
};
