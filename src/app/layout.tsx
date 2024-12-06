import type { Metadata } from "next";
import localFont from "next/font/local";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/context/query";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-primary",
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-secondary",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Finantial App",
  description: "Create Portifolios and Backtests",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${montserrat.variable} ${poppins.variable} antialiased`}
      >
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
