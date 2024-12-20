import { table, Button } from "@/components/ui";
import { useBackTestForm } from "@/hooks/useFormProvider";

interface TableFormFooterProps {
  handleTicketsQuant: () => void;
}

export const TableFormFooter = ({
  handleTicketsQuant,
}: TableFormFooterProps) => {
  const { watch } = useBackTestForm();

  const tickets = watch("tickets");

  const totalWallet = Array.from({ length: 3 }, (_, i) => {
    return tickets.reduce((total, num) => {
      const key = `wallet${i + 1}` as keyof typeof num;
      return total + Number(num[key]);
    }, 0);
  });
  return (
    <table.TableFooter>
      <table.TableRow>
        <table.TableCell>
          <Button type="button" onClick={handleTicketsQuant} variant="link">
            Adicionar 5+
          </Button>
        </table.TableCell>
        <table.TableCell
          className={`text-right ${
            totalWallet[0] > 100 ? "text-red-500" : "text-app-dark"
          }`}
        >
          {totalWallet[0] + "%"}
        </table.TableCell>
        <table.TableCell
          className={`text-right ${
            totalWallet[1] > 100 ? "text-red-500" : "text-app-dark"
          }`}
        >
          {totalWallet[1] + "%"}
        </table.TableCell>
        <table.TableCell
          className={`text-right ${
            totalWallet[2] > 100 ? "text-red-500" : "text-app-dark"
          }`}
        >
          {totalWallet[2] + "%"}
        </table.TableCell>
      </table.TableRow>
    </table.TableFooter>
  );
};
