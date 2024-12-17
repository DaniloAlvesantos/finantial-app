import { Checkbox, Label } from "@/components/ui";
import { useFormContext } from "react-hook-form";

interface CheckBoxAreaProps {
  id: string;
  label: string;
  formKey: string;
}

const CheckBoxAreaData: CheckBoxAreaProps[] = [
  {
    id: "IPCA",
    label: "Inflação IPCA",
    formKey: "IPCA",
  },
  {
    id: "CDI",
    label: "Comparar com CDI",
    formKey: "CDI",
  },
  {
    id: "ibovespa",
    label: "Comparar com IBOVESPA",
    formKey: "IBOVESPA",
  },
  {
    id: "prov",
    label: "Reinvestir proventos",
    formKey: "PROCEEDS",
  },
];

const CheckBoxArea = ({ id, label, formKey }: CheckBoxAreaProps) => {
  const { setValue, watch } = useFormContext();
  return (
    <span className="flex gap-2 items-center my-2">
      <Checkbox
        id={id}
        checked={watch(`config.${formKey}`)}
        onCheckedChange={(value) => setValue(`config.${formKey}`, value)}
        className="data-[state=checked]:bg-app-green border-input"
      />
      <Label htmlFor={id} className="font-montserrat font-light">
        {label}
      </Label>
    </span>
  );
};

export const Configs = () => {
  return (
    <div className="my-8">
      <h3 className="font-poppins font-medium text-sm leading-6">Configurações</h3>
      {CheckBoxAreaData.map((item, idx) => (
        <CheckBoxArea key={idx} {...item} />
      ))}
    </div>
  );
};
