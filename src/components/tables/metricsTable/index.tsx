import React from "react";
import { CardContainer, table } from "@/components";

interface MetricsTableProps {
  tableData: Record<string, any>;
}

interface MetricsTableHeaderProps {
  items: string[];
}

const MetricsTableHeader = ({ items }: MetricsTableHeaderProps) => {
  return (
    <table.TableHeader className="font-poppins">
      <table.TableRow className="hover:bg-transparent">
        <table.TableHead className="text-left">Metricas</table.TableHead>
        {items.map((portfolio) => (
          <table.TableHead key={crypto.randomUUID()} className="text-right">
            {portfolio}
          </table.TableHead>
        ))}
      </table.TableRow>
    </table.TableHeader>
  );
};

const FooterMessage = () => (
  <p className="text-sm text-zinc-400 font-montserrat font-medium">
    * Taxa Selic é usado como referência para cálculos. Métricas de valor em
    risco são valores mensais.
  </p>
);

const MetricsTable = ({ tableData }: MetricsTableProps) => {
  if (!tableData) return null;

  const items = Object.keys(tableData);

  const metricNames = Array.from(
    new Set(Object.values(tableData).flatMap((metrics) => Object.keys(metrics)))
  );

  const data = metricNames.map((metric) => {
    return items.map((portfolio) => ({
      value: tableData[portfolio][metric],
    }));
  });

  return (
    <CardContainer title="Metrics" footer={<FooterMessage />}>
      <table.Table>
        <MetricsTableHeader items={items} />

        <table.TableBody className="font-montserrat">
          {metricNames.map((metric, index) => (
            <table.TableRow key={index} className="hover:bg-transparent">
              <table.TableCell className="font-semibold">
                {formatMetricName(metric)}
              </table.TableCell>

              {items.map((_, i) => (
                <table.TableCell key={i} className="font-medium text-right">
                  {formatValue(Number(data[index][i].value))}
                </table.TableCell>
              ))}
            </table.TableRow>
          ))}
        </table.TableBody>
      </table.Table>
    </CardContainer>
  );
};

// Format metric names to a readable format
const formatMetricName = (metric: string) => {
  return metric
    .replace(/([A-Z])/g, " $1")
    .replace(/Mean/, "Mean")
    .replace(/Ratio/, " Ratio")
    .replace(/Deviation/, " Deviation")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
};

// Format values (percentages, decimals, etc.)
const formatValue = (value: number) => {
  if (Math.abs(value) > 1) {
    return `${value.toFixed(2)}%`;
  }
  return value.toFixed(2);
};

export { MetricsTable };
