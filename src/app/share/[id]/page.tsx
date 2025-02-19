"use client";

import { BacktestCharts, Footer, Header } from "@/components";
import { TicketFormValues } from "@/components/forms/backtest/type";
import { useIndexes, useMultStocks } from "@/hooks";
import { useBackTestStore } from "@/stores/backTest";
import { SubmitResultChartDataProps } from "@/types/chartsDatas";
import { decodeValues } from "@/utils/encodeValues";
import { submitChartData } from "@/utils/submitChart";
import { use, useEffect, useState } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const formValues: TicketFormValues = decodeValues({ value: id });
  const { hasProcessedData, setHasProcessedData } = useBackTestStore();
  const chosenTickets = formValues.tickets.map((ticket) => ticket.ticket);
  const chosenIndexes = Object.entries(formValues?.config || {})
    .filter(([key, value]) => value === true && key !== "PROCEEDS")
    .map(([key]) => key);

  const stocks = useMultStocks(chosenTickets);
  const indexes = useIndexes({ indexes: chosenIndexes });

  const [chartState, setChartState] =
    useState<SubmitResultChartDataProps | null>(null);

  useEffect(() => {
    if (!formValues || hasProcessedData) return;

    if (stocks.data.length > 0 && !stocks.isLoading) {
      const chartsDatas = submitChartData({
        stocks,
        indexes,
        values: formValues,
      });

      setHasProcessedData(true);
      setChartState(chartsDatas);
    }
  }, [
    stocks.data,
    stocks.isLoading,
    indexes.data,
    indexes.isLoading,
    hasProcessedData,
  ]);

  return (
    <>
      <Header />
      <div className="w-full p-8">
        {!chartState ? null : (
          <BacktestCharts chartsDatas={chartState} isShared />
        )}
      </div>

      <Footer />
    </>
  );
}
