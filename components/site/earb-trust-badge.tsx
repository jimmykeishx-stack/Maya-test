import Image from "next/image";

import { cn } from "@/lib/utils";

type EarbTrustBadgeProps = {
  className?: string;
  compact?: boolean;
};

export function EarbTrustBadge({ className, compact = false }: EarbTrustBadgeProps) {
  return (
    <article
      className={cn(
        "group overflow-hidden rounded-[1.8rem] border border-[rgba(42,39,34,0.08)] bg-white/72 shadow-[0_18px_60px_rgba(15,12,8,0.05)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(15,12,8,0.09)]",
        compact ? "p-4" : "p-5 sm:p-6",
        className
      )}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-[1.3rem] bg-white">
          <Image
            src="/media/trust/earb-logo.jpeg"
            alt="Estate Agents Registration Board logo"
            fill
            className="object-contain p-2 transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <div className="space-y-2">
          <p className="quiet-label text-[var(--gold-strong)]">Professional Compliance</p>
          <h3 className="font-display text-2xl leading-tight text-foreground">Licensed & Registered</h3>
          <p className="text-sm leading-7 text-muted-foreground">EARB Compliant with a trust-first presentation approach for investors, owners, and globally mobile clients.</p>
        </div>
      </div>
    </article>
  );
}
