"use client";

import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-24 text-center">
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
        <AlertCircle className="h-10 w-10 text-red-500" />
      </div>

      <h1 className="font-display text-2xl text-[#12100f] sm:text-3xl">
        Something went wrong
      </h1>

      <p className="mt-3 max-w-sm text-sm text-muted-foreground">
        We encountered an error loading this page. Please try again or return to the insights overview.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/5 px-6 py-3 text-sm font-medium text-[#12100f] transition-all duration-300 hover:bg-[var(--gold)]/10"
        >
          Try Again
        </button>

        <Link
          href="/insight"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#12100f] px-6 py-3 text-sm font-medium text-[var(--gold)] transition-all duration-300 hover:bg-[#1d1915]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Insights
        </Link>
      </div>
    </div>
  );
}
