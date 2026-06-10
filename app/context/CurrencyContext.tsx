"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Static exchange rates relative to 1 USD
export const exchangeRates: Record<string, number> = {
  USD: 1.0,
  INR: 83.5,
  EUR: 0.93,
  GBP: 0.79,
  AED: 3.67,
  CAD: 1.36,
};

// Currency symbols
export const currencySymbols: Record<string, string> = {
  USD: "$",
  INR: "₹",
  EUR: "€",
  GBP: "£",
  AED: "د.إ",
  CAD: "C$",
};

interface CurrencyContextType {
  selectedCurrency: string;
  setSelectedCurrency: (curr: string) => void;
  convertPrice: (amount: number, fromCurrency: string) => { amount: number; formatted: string };
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // Defaulting to INR or USD. Since the API currently returns INR, let's default to USD to show conversion.
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  const convertPrice = (amount: number, fromCurrency: string) => {
    // If the currencies are the same, no conversion needed
    if (fromCurrency === selectedCurrency) {
      return {
        amount,
        formatted: `${currencySymbols[fromCurrency] || fromCurrency} ${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
      };
    }

    // Convert from `fromCurrency` to USD first
    const rateToUsd = exchangeRates[fromCurrency] || 1;
    const amountInUsd = amount / rateToUsd;

    // Convert from USD to `selectedCurrency`
    const rateToTarget = exchangeRates[selectedCurrency] || 1;
    const finalAmount = amountInUsd * rateToTarget;

    const symbol = currencySymbols[selectedCurrency] || selectedCurrency;
    
    return {
      amount: finalAmount,
      formatted: `${symbol} ${finalAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    };
  };

  return (
    <CurrencyContext.Provider value={{ selectedCurrency, setSelectedCurrency, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
