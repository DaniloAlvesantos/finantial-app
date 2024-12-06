export enum TicketResponseKeys {
  symbol = "1. symbol",
  name = "2. name",
  type = "3. type",
  region = "4. region",
  marketOpen = "5. marketOpen",
  marketClose = "6. marketClose",
  timezone = "7. timezone",
  currency = "8. currency",
  matchScore = "9. matchScore",
}

export type Ticket = {
  [key in TicketResponseKeys]: string;
};

export interface TicketResponse {
  bestMatches: Ticket[];
}
