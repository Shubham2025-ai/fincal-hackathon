import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata = {
  title: "Retirement Planning Calculator | FinCal Innovation Hackathon – Technex '26",
  description:
    "Estimate your retirement corpus and the monthly SIP required to achieve it. " +
    "Built for the FinCal Innovation Hackathon co-sponsored by HDFC Mutual Fund at Technex '26, IIT BHU.",
  keywords: [
    "retirement calculator",
    "SIP calculator",
    "mutual fund",
    "HDFC Mutual Fund",
    "financial planning",
    "retirement corpus",
  ],
  authors: [{ name: "FinCal Hackathon Team" }],
  // WCAG: declare language on <html>
  // (lang is set via htmlLang in the layout below)
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <head>
        {/* Prevent zoom issues on mobile while keeping accessibility zoom working */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
