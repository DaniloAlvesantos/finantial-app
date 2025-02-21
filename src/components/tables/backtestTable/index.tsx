import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  table,
} from "@/components/ui";
import { BacktestTableProps } from "./props";
import { currencyFormatter } from "@/lib/currencyFormatter";
import { ReactNode } from "react";

const TableHeader = () => {
  return (
    <table.TableHeader className="font-poppins font-bold text-xs">
      <table.TableRow className="hover:bg-transparent">
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
          Total
          <br /> ações
        </table.TableHead>
        <table.TableHead>
          Volatilidade <br /> anual
        </table.TableHead>
        <table.TableHead>
          Drawdown <br /> máximo
        </table.TableHead>
        <table.TableHead>CAGR</table.TableHead>
        <table.TableHead>
          Melhor <br /> ano
        </table.TableHead>
        <table.TableHead>
          Pior <br /> ano
        </table.TableHead>
      </table.TableRow>
    </table.TableHeader>
  );
};

const BackTestContainerTable = ({ children }: { children: ReactNode }) => {
  return (
    <Card className="my-4">
      <CardHeader className="py-4 -mb-4">
        <CardTitle className="font-poppins font-bold text-lg">
          Resumo Perfomace
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export const BackTestTable = ({ tableData }: BacktestTableProps) => {
  return (
    <BackTestContainerTable>
      <table.Table>
        <TableHeader />
        <table.TableBody className="font-montserrat font-medium">
          {tableData.map((value, i) => (
            <table.TableRow
              key={i}
              className={
                i % 2 == 0 ? "hover:bg-muted bg-muted" : "hover:bg-transparent"
              }
            >
              <table.TableCell>{value.symbol}</table.TableCell>
              <table.TableCell>
                {currencyFormatter.format(value.values.totalInvested)}
              </table.TableCell>
              <table.TableCell>
                {value.values.cumulativeReturn.toFixed(2) + "%"}
              </table.TableCell>
              <table.TableCell>
                {value.values.totalDividends > 0
                  ? currencyFormatter.format(value.values.totalDividends)
                  : null}
              </table.TableCell>
              <table.TableCell>{value.values.totalShares}</table.TableCell>
              <table.TableCell>
                {value.values.annualVolatility.toFixed(2) + "%"}
              </table.TableCell>
              <table.TableCell>
                {value.values.maxDrawdown.toFixed(2) + "%"}
              </table.TableCell>
              <table.TableCell>
                {value.values.cagr.toFixed(2) + "%"}
              </table.TableCell>
              <table.TableCell>
                {value.values.bestYear.toFixed(2) + "%"}
              </table.TableCell>
              <table.TableCell>
                {value.values.worstYear.toFixed(2) + "%"}
              </table.TableCell>
            </table.TableRow>
          ))}
        </table.TableBody>
      </table.Table>
    </BackTestContainerTable>
  );
};
