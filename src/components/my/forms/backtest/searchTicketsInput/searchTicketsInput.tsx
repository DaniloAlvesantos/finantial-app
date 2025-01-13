import { ChangeEvent } from "react";
import { useTickets } from "@/hooks/useTickets";
import { Input } from "@/components/ui/input";

interface SearchTicketInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export const SearchTicketInput = ({
  placeholder,
  value,
  onChange,
}: SearchTicketInputProps) => {
  const handleValue = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.currentTarget.value);
  };

  return (
    <span>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={handleValue}
        list="tickets_keys"
        className="sm:w-[12rem] border-app-dark/20 focus-visible:ring-app-dark"
      />
      <DataListTicket value={value} />
    </span>
  );
};

export const DataListTicket = ({ value }: { value: string }) => {
  const { data, isLoading, error, isError } = useTickets(value);

  if (isError) {
    console.log(error)
    return;
  }

  if(!data) {
    return;
  }

  return (
    <datalist id="tickets_keys">
      {isLoading ? (
        <option>Carregando...</option>
      ) : (
        data.bestMatches.slice(-6).map((value, idx) => (
          <option key={idx} value={value["1. symbol"]}>
            {value["2. name"]}
          </option>
        ))
      )}
    </datalist>
  );
};
