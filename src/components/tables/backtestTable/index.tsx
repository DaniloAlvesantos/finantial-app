import { table } from "@/components/ui";
import { BacktestTableProps } from "./props";
import { currencyFormatter } from "@/lib/currencyFormatter";

const TableHeader = () => {
  return (
    <table.TableHeader className="font-poppins font-bold text-xs">
      <table.TableRow className="hover:bg-muted bg-muted">
        <table.TableHead></table.TableHead>
        <table.TableHead>
          Total <br /> Investido
        </table.TableHead>
        <table.TableHead>
          Valor <br /> acumulado
        </table.TableHead>
        <table.TableHead>
          Total em <br /> proventos
        </table.TableHead>
        <table.TableHead>
          Volatilidade <br /> anual
        </table.TableHead>
        <table.TableHead>
          Drawdown <br /> máximo
        </table.TableHead>
        <table.TableHead>CAGR</table.TableHead>
      </table.TableRow>
    </table.TableHeader>
  );
};

export const BackTestTable = ({ tableData }: BacktestTableProps) => {
  return (
    <table.Table className="border">
      <TableHeader />
      <table.TableBody className="font-montserrat font-medium">
        {tableData.map((value, i) => (
          <table.TableRow key={i} className="hover:bg-transparent">
            <table.TableCell>{value.symbol}</table.TableCell>
            <table.TableCell>
              {currencyFormatter.format(value.values.totalInvested)}
            </table.TableCell>
            <table.TableCell>
              {currencyFormatter.format(value.values.cumulativeReturn)}
            </table.TableCell>
            <table.TableCell></table.TableCell>
            <table.TableCell>
              {value.values.annualVolatility + "%"}
            </table.TableCell>
            <table.TableCell>
              {value.values.maxDrawdown.toFixed(2) + "%"}
            </table.TableCell>
            <table.TableCell>{value.values.cagr + "%"}</table.TableCell>
          </table.TableRow>
        ))}
      </table.TableBody>
    </table.Table>
  );
};
