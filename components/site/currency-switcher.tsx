"use client";

import { useCurrency } from "@/hooks/use-currency";

const currencyOptions = ["KES", "USD", "GBP", "EUR"] as const;

export function CurrencySwitcher({ className = "" }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <label className={`flex items-center gap-2 text-xs uppercase tracking-[0.22em] ${className}`}>
      <span className="opacity-70">Currency</span>
      <select
        value={currency}
        onChange={(event) => setCurrency(event.target.value as (typeof currencyOptions)[number])}
        className="h-10 rounded-full border border-black/8 bg-white/70 px-3 text-xs tracking-[0.16em] text-foreground outline-none"
        aria-label="Select currency"
      >
        {currencyOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
