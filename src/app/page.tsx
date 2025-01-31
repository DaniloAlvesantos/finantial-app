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
import { ChartDatas } from "@/types/chartsDatas";

export default function Home() {
  const [chartState, setChartState] = useState<ChartDatas | null>(null);
  const [tickets, setTickets] = useState<string[]>([]);
  const [formValues, setFormValues] = useState<TicketFormValues | null>(null);
  const [hasProcessedData, setHasProcessedData] = useState(false);
  const stocks = useMultStocks(tickets);

  const submit: SubmitHandler<TicketFormValues> = async (values) => {
    setFormValues(values);
    setHasProcessedData(false);

    const ticketsVal = values.tickets
      .map((ticket) => ticket.ticket)
      .filter((ticket) => ticket !== "");

    setTickets(ticketsVal);
  };

  useEffect(() => {
    if (
      formValues &&
      stocks.data.length > 0 &&
      !stocks.isLoading &&
      !hasProcessedData
    ) {
      const chartsDatas = submitChartData({ values: formValues, stocks });
      setChartState(chartsDatas);
      setHasProcessedData(true);
    }
  }, [stocks.data, stocks.isLoading, hasProcessedData]);

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
