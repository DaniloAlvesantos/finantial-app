"use client";

/* Fix when add index, to click once to update it */

import { BacktestForm } from "@/components/forms";
import { Header } from "@/components/header";
import { SubmitHandler } from "react-hook-form";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TicketFormValues } from "@/components/forms/backtest/type";
import { Footer } from "@/components/footer/footer";
import { useMultStocks } from "@/hooks/useMultStocks";
import { BacktestCharts } from "@/components/charts/__backtestCharts";
import { submitChartData } from "@/utils/submitChart";
import { Spin } from "@/components/loading/spin/spin";
import { SubmitResultChartDataProps } from "@/types/chartsDatas";
import { useIndexes } from "@/hooks/useIndexes";
import { useBackTestStore } from "@/stores/backTest";

export default function Home() {
  const [chartState, setChartState] =
    useState<SubmitResultChartDataProps | null>(null);

  const { formState, setFormState, hasProcessedData, setHasProcessedData } =
    useBackTestStore();

  const tickets = useMemo(
    () => formState?.tickets.map((t) => t.ticket).filter((t) => t !== "") || [],
    [formState]
  );

  const indexeState = useMemo(
    () =>
      Object.entries(formState?.config || {})
        .filter(([key, value]) => value === true && key !== "PROCEEDS")
        .map(([key]) => key),
    [formState]
  );

  const stocks = useMultStocks(tickets);
  const indexes = useIndexes({ indexes: indexeState });

  const submit: SubmitHandler<TicketFormValues> = useCallback(
    (values) => {
      setFormState(values);
      setHasProcessedData(false);
    },
    [setHasProcessedData, setFormState]
  );

  useEffect(() => {
    if (!formState || hasProcessedData) return;

    if (stocks.data.length > 0 && !stocks.isLoading) {
      const chartsDatas = submitChartData({
        values: formState,
        stocks,
        indexes: indexeState.length > 0 ? indexes : undefined,
      });

      setChartState(chartsDatas);
      setHasProcessedData(true);
    }
  }, [
    formState,
    stocks.data,
    stocks.isLoading,
    indexes.data,
    indexes.isLoading,
    hasProcessedData,
    setHasProcessedData,
    indexeState,
  ]);

  return (
    <>
      <Header />
      <main className="flex flex-col item-center gap-8 p-4 sm:p-8">
        <BacktestForm onSubmit={submit} />
        <div className="w-full">
          {!chartState ? null : <BacktestCharts chartsDatas={chartState} />}
          {stocks.isLoading && !hasProcessedData && (
            <div className="w-full flex items-center justify-center">
              <Spin />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
