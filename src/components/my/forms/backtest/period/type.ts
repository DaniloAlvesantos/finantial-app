export type Months = {
  month: string;
  value: string;
};

export const months: Months[] = [
  {
    month: "Janeiro",
    value: "01",
  },
  {
    month: "Fevereiro",
    value: "02",
  },
  {
    month: "Março",
    value: "03",
  },
  {
    month: "Abril",
    value: "04",
  },
  {
    month: "Maio",
    value: "05",
  },
  {
    month: "Junho",
    value: "06",
  },
  {
    month: "Julho",
    value: "07",
  },
  {
    month: "Agosto",
    value: "08",
  },
  {
    month: "Setembro",
    value: "09",
  },
  {
    month: "Outubro",
    value: "10",
  },
  {
    month: "Novembro",
    value: "11",
  },
  {
    month: "Dezembro",
    value: "12",
  },
];

const startYear = 2000;
const currentYear = new Date().getFullYear();
export const years = Array.from(
  { length: currentYear - startYear + 1 },
  (_, i) => startYear + i
);
