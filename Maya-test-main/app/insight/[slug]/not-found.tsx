import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-24 text-center">
      <div className="mb-8">
        <span className="font-display text-8xl text-[var(--gold)]/20">404</span>
      </div>

      <h1 className="font-display text-2xl text-[#12100f] sm:text-3xl">
        Article not found
      </h1>

      <p className="mt-3 max-w-sm text-sm text-muted-foreground">
        The article you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <Link
        href="/insight"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#12100f] px-6 py-3 text-sm font-medium text-[var(--gold)] transition-all duration-300 hover:bg-[#1d1915]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Insights
      </Link>
    </div>
  );
}
