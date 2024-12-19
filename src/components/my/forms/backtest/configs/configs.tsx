import { TicketFormValues } from "../type";
import { Checkbox, Form } from "@/components/ui";
import { useBackTestForm } from "@/hooks/useFormProvider";
import { Path } from "react-hook-form";

interface CheckBoxAreaProps {
  id: string;
  label: string;
  formKey: Path<TicketFormValues>;
}

const CheckBoxAreaData: CheckBoxAreaProps[] = [
  {
    id: "IPCA",
    label: "Inflação IPCA",
    formKey: "config.IPCA",
  },
  {
    id: "CDI",
    label: "Comparar com CDI",
    formKey: "config.CDI",
  },
  {
    id: "ibovespa",
    label: "Comparar com IBOVESPA",
    formKey: "config.IBOVESPA",
  },
  {
    id: "prov",
    label: "Reinvestir proventos",
    formKey: "config.PROCEEDS",
  },
];

const CheckBoxArea = ({ id, label, formKey }: CheckBoxAreaProps) => {
  const { control } = useBackTestForm();
  return (
    <Form.FormField
      control={control}
      name={formKey}
      render={({ field }) => (
        <Form.FormItem className="flex gap-2 items-center my-2">
          <Form.FormControl>
            <Checkbox
              id={id}
              checked={field.value as boolean}
              onCheckedChange={field.onChange}
              className="data-[state=checked]:bg-app-green border-input"
            />
          </Form.FormControl>
          <Form.FormLabel className="font-montserrat font-light">{label}</Form.FormLabel>
          <Form.FormMessage />
        </Form.FormItem>
      )}
    />
  );
};

export const Configs = () => {
  return (
    <div className="my-8">
      <h3 className="font-poppins font-medium text-sm leading-6">
        Configurações
      </h3>
      {CheckBoxAreaData.map((item, idx) => (
        <CheckBoxArea key={idx} {...item} />
      ))}
    </div>
  );
};
