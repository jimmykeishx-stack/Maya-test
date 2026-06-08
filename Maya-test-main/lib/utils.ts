import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type SupportedCurrency = "KES" | "USD" | "GBP" | "EUR";

export const currencyRates: Record<SupportedCurrency, number> = {
  KES: 1,
  USD: 129,
  GBP: 165,
  EUR: 140
};

export function convertFromKes(amount: number, currency: SupportedCurrency) {
  if (currency === "KES") return amount;
  return amount / currencyRates[currency];
}

export function formatCurrencyAmount(amount: number, currency: SupportedCurrency, compact = false) {
  return new Intl.NumberFormat(currency === "KES" ? "en-KE" : "en", {
    style: "currency",
    currency,
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 0
  }).format(convertFromKes(amount, currency));
}

export function formatPrice(amount: number, currency: SupportedCurrency = "KES") {
  return formatCurrencyAmount(amount, currency);
}

export function formatCompactPrice(amount: number, currency: SupportedCurrency = "KES") {
  return formatCurrencyAmount(amount, currency, true);
}
