"use client";

import { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { useMultStocks } from "@/hooks/useMultStocks";
import { useIndexes } from "@/hooks/useIndexes";
import { useBackTestStore } from "@/stores/backTest";

import {
  Header,
  Footer,
  BacktestCharts,
  Spin,
  BacktestForm,
} from "@/components";

import { TicketFormValues } from "@/components/forms/backtest/type";
import { submitChartData } from "@/utils/submitChart";
import { SubmitResultChartDataProps } from "@/types/chartsDatas";

export default function Home() {
  const [chartState, setChartState] =
    useState<SubmitResultChartDataProps | null>(null);

  const {
    formState,
    setFormState,
    hasProcessedData,
    setHasProcessedData,
    indexeState,
    setIndexeState,
    setTickets,
    tickets,
  } = useBackTestStore();

  const stocks = useMultStocks(tickets);
  const indexes = useIndexes({ indexes: indexeState });

  const submit: SubmitHandler<TicketFormValues> = async (values) => {
    setFormState(values);
    setHasProcessedData(false);

    const ticketsVal = values.tickets
      .map((ticket) => ticket.ticket)
      .filter((ticket) => ticket !== "");

    const indexesVal = Object.entries(values.config)
      .filter((index) => index[1] === true && index[0] !== "PROCEEDS")
      .map((index) => index[0]);

    setTickets(ticketsVal);
    setIndexeState(indexesVal);
  };

  useEffect(() => {
    if (indexeState.length) {
      if (
        formState &&
        stocks.data.length > 0 &&
        !stocks.isLoading &&
        !hasProcessedData &&
        indexes.data.length &&
        !indexes.isLoading
      ) {
        const chartsDatas = submitChartData({
          values: formState,
          stocks,
          indexes,
        });
        setChartState(chartsDatas);
        setHasProcessedData(true);
      }
    } else {
      if (
        formState &&
        stocks.data.length > 0 &&
        !stocks.isLoading &&
        !hasProcessedData
      ) {
        const chartsDatas = submitChartData({
          values: formState,
          stocks,
        });
        setChartState(chartsDatas);
        setHasProcessedData(true);
      }
    }
  }, [
    stocks.data,
    stocks.isLoading,
    hasProcessedData,
    indexes.data,
    indexes.isLoading,
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
