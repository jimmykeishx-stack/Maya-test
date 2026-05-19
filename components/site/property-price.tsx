"use client";

import { useCurrency } from "@/hooks/use-currency";

type PropertyPriceProps = {
  amount: number;
  compact?: boolean;
  suffix?: string;
  className?: string;
};

export function PropertyPrice({ amount, compact = false, suffix, className }: PropertyPriceProps) {
  const { formatAmount, formatCompactAmount } = useCurrency();
  const formatted = compact ? formatCompactAmount(amount) : formatAmount(amount);
  const normalizedSuffix = suffix?.trim().toLowerCase() === "asking" ? undefined : suffix;

  return (
    <span className={className}>
      {formatted}
      {normalizedSuffix ? <span className="ml-2 text-[0.7em] uppercase tracking-[0.18em] opacity-70">{normalizedSuffix}</span> : null}
    </span>
  );
}
