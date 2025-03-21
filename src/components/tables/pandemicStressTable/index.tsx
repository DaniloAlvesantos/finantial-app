import { table, CardContainer } from "@/components";
import { extractPandemicStressReturnType } from "@/utils/extractPandemicStress";

interface PandemicStressTableProps {
  data: extractPandemicStressReturnType;
}

function formatSymbolsName(name: string): string {
  if (name.includes("item")) {
    return name.replace(/item/g, "Carteira-");
  }

  return name.toUpperCase();
}

function formatDate(date: string): string {
  return new Date(date)
    .toLocaleDateString("pt-BR", {
      month: "short",
      year: "numeric",
    })
    .replace(/. de/g, "")
    .replace(/^./, (char) => char.toUpperCase());
}

export const PandemicStressTable = ({ data }: PandemicStressTableProps) => {
  if (!data) return;

  return (
    <CardContainer title="Período Pandemia" description="Maior queda mundial">
      <table.Table>
        <PandemicStressTableHead />
        <table.TableBody className="font-montserrat font-medium">
          {data.map((value, i) => {
            if (!value) return;
            
            return (
              <table.TableRow key={i} className="hover:bg-transparent">
                <table.TableCell>
                  {formatSymbolsName(value.symbol)}
                </table.TableCell>
                <table.TableCell>
                  {formatDate(value.start.period)}
                </table.TableCell>
                <table.TableCell>
                  {formatDate(value.end.period)}
                </table.TableCell>
                <table.TableCell
                  className={Number(value.returnValue) < 0 ? "text-red-500" : ""}
                >
                  {value.returnValue + "%"}
                </table.TableCell>
              </table.TableRow>
            );
          })}
        </table.TableBody>
      </table.Table>
    </CardContainer>
  );
};

const PandemicStressTableHead = () => {
  return (
    <table.TableHeader className="font-poppins">
      <table.TableRow className="hover:bg-transparent">
        <table.TableHead>Ação</table.TableHead>
        <table.TableHead>Começo</table.TableHead>
        <table.TableHead>Fim</table.TableHead>
        <table.TableHead>Retorno</table.TableHead>
      </table.TableRow>
    </table.TableHeader>
  );
};
