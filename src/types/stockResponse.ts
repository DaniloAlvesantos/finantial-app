export enum MetaDataStocks {
  Information = "1. Information",
  Symbol = "2. Symbol",
  LastRefreshed = "3. Last Refreshed",
}

export enum DataAdjustedValuesKeys {
  Open = "1. open",
  High = "2. high",
  Low = "3. low",
  Close = "4. close",
  AdjustedClose = "5. adjusted close",
  Volume = "6. volume",
  DividendAmount = "7. dividend amount",
}

export enum DataAdjustedValuesKeysDaily {
  Open = "1. open",
  High = "2. high",
  Low = "3. low",
  Close = "4. close",
  AdjustedClose = "5. adjusted close",
  Volume = "6. volume",
  DividendAmount = "7. dividend amount",
  SplitCoefficient = "8. split coefficient",
}

export enum PeriodKeys {
  metaData = "Meta Data",
  daily = "Time Series (Daily)",
  weekly = "Weekly Adjusted Time Series",
  monthly = "Monthly Adjusted Time Series",
}

export interface TimeSeriesCommonData {
  [date: string]: {
    [key in DataAdjustedValuesKeys]: string;
  };
}

export interface TimeSeriesDailyData {
  [date: string]: {
    [key in DataAdjustedValuesKeysDaily]: string;
  };
}

export interface StockAPIResponse {
  [PeriodKeys.metaData]: {
    [key in MetaDataStocks]: string;
  };
  [PeriodKeys.daily]?: TimeSeriesDailyData;
  [PeriodKeys.monthly]?: TimeSeriesCommonData;
  [PeriodKeys.weekly]?: TimeSeriesCommonData;
}

export interface TicketsData {
  [DataAdjustedValuesKeys.AdjustedClose]: string;
  [DataAdjustedValuesKeys.DividendAmount]: string;
}
