"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { formatCompactPrice, formatPrice, type SupportedCurrency } from "@/lib/utils";

const STORAGE_KEY = "maya-haven-currency";

type CurrencyContextValue = {
  currency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
  formatAmount: (amount: number) => string;
  formatCompactAmount: (amount: number) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<SupportedCurrency>("KES");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as SupportedCurrency | null;
    if (stored === "KES" || stored === "USD" || stored === "GBP" || stored === "EUR") {
      setCurrency(stored);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, currency);
  }, [currency]);

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      setCurrency,
      formatAmount: (amount) => formatPrice(amount, currency),
      formatCompactAmount: (amount) => formatCompactPrice(amount, currency)
    }),
    [currency]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }

  return context;
}
