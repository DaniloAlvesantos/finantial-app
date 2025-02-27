import { Button, table } from "@/components";
import { CardContainer } from "@/components/cards/CardContainer";
import { currencyFormatter } from "@/lib/currencyFormatter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface MonthlyReturnsTableHeaderProps {
  items: String[];
}

interface MonthlyReturnsTableProps {
  tableData: Record<string, any>[];
}

const MonthlyReturnsTableHeader = ({
  items,
}: MonthlyReturnsTableHeaderProps) => {
  return (
    <table.TableHeader className="font-poppins">
      <table.TableRow className="hover:bg-transparent">
        <table.TableHead rowSpan={2}>Ano</table.TableHead>
        <table.TableHead rowSpan={2}>Mês</table.TableHead>
        {items.map((value, i) => (
          <table.TableHead key={i} colSpan={2} className="text-center">
            {value}
          </table.TableHead>
        ))}
      </table.TableRow>
      <table.TableRow className="hover:bg-transparent">
        {items.map((value, i) => (
          <>
            <table.TableHead key={i} className="border-l">
              Retorno
            </table.TableHead>
            <table.TableHead key={i + 1} className="border-r">
              Valor
            </table.TableHead>
          </>
        ))}
      </table.TableRow>
    </table.TableHeader>
  );
};

export const MonthlyReturnsTable = ({
  tableData,
}: MonthlyReturnsTableProps) => {
  const [itemsQuantity, setItemsQuantity] = useState(12);
  const items = Object.keys(tableData[0]).filter((key) => key !== "period");

  const handleNext = () => {
    setItemsQuantity((prev) => prev + 12);
  };

  const handlePrev = () => {
    setItemsQuantity((prev) => prev - 12);
  };

  return (
    <CardContainer title="Retorno Mensal">
      <table.Table>
        <MonthlyReturnsTableHeader items={items} />
        <table.TableBody className="font-montserrat font-medium">
          {tableData
            .slice(itemsQuantity - 12, itemsQuantity)
            .map((value, i) => {
              const datas = Object.entries(value).filter(
                (data) => data[0] !== "period"
              );
              const year = new Date(value.period).getFullYear();
              const month = new Date(value.period).toLocaleString("pt-br", {
                month: "2-digit",
              });

              return (
                <table.TableRow key={crypto.randomUUID()} className="text-sm">
                  <table.TableCell>{year}</table.TableCell>
                  <table.TableCell>{month}</table.TableCell>
                  {datas.map((value, i) => (
                    <>
                      <table.TableCell
                        key={i}
                        className={
                          value[1].percentage < 0 ? "text-red-500" : ""
                        }
                      >
                        {value[1].percentage.toFixed(2) + "%"}
                      </table.TableCell>
                      <table.TableCell key={i + 1}>
                        {currencyFormatter.format(value[1].value)}
                      </table.TableCell>
                    </>
                  ))}
                </table.TableRow>
              );
            })}
        </table.TableBody>
        <table.TableFooter className="bg-transparent font-poppins">
          <table.TableRow className="hover:bg-transparent">
            <table.TableCell>
              <Button
                variant="link"
                onClick={handleNext}
                disabled={itemsQuantity >= tableData.length}
              >
                Próximo <ChevronRight />
              </Button>
            </table.TableCell>
            <table.TableCell>
              <Button
                variant="link"
                onClick={handlePrev}
                disabled={itemsQuantity <= 12}
              >
                <ChevronLeft /> Anterior
              </Button>
            </table.TableCell>
            <table.TableCell className="underline">{`${itemsQuantity} - ${
              itemsQuantity + 12 > tableData.length
                ? itemsQuantity
                : itemsQuantity + 12
            } de ${tableData.length}`}</table.TableCell>
          </table.TableRow>
        </table.TableFooter>
      </table.Table>
    </CardContainer>
  );
};
