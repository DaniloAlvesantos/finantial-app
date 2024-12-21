import { CheckBoxArea, CheckBoxAreaProps } from "./checkBoxArea";

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
