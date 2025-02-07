"use client";

import { BacktestForm } from "@/components/my/forms";
import { Header } from "@/components/my/header";
import { SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { TicketFormValues } from "@/components/my/forms/backtest/type";
import { Footer } from "@/components/my/footer/footer";
import { useMultStocks } from "@/hooks/useMultStocks";
import { BacktestCharts } from "@/components/my/charts/__backtestCharts";
import { submitChartData } from "@/utils/submitChart";
import { Spin } from "@/components/my/loading/spin/spin";
import { SubmitResultChartDataProps } from "@/types/chartsDatas";
import { useIndexes } from "@/hooks/useIndexes";

export default function Home() {
  const [chartState, setChartState] = useState<SubmitResultChartDataProps | null>(null);
  const [tickets, setTickets] = useState<string[]>([]);
  const [indexeState, setIndexeState] = useState<string[]>([]);
  const [formValues, setFormValues] = useState<TicketFormValues | null>(null);
  const [hasProcessedData, setHasProcessedData] = useState(false);
  const stocks = useMultStocks(tickets);
  const indexes = useIndexes({ indexes: indexeState });

  const submit: SubmitHandler<TicketFormValues> = async (values) => {
    setFormValues(values);
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
        formValues &&
        stocks.data.length > 0 &&
        !stocks.isLoading &&
        !hasProcessedData &&
        indexes.data.length &&
        !indexes.isLoading
      ) {
        const chartsDatas = submitChartData({
          values: formValues,
          stocks,
          indexes,
        });
        setChartState(chartsDatas);
        setHasProcessedData(true);
      }
    } else {
      if (
        formValues &&
        stocks.data.length > 0 &&
        !stocks.isLoading &&
        !hasProcessedData
      ) {
        const chartsDatas = submitChartData({
          values: formValues,
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
          {stocks.isLoading && (
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
