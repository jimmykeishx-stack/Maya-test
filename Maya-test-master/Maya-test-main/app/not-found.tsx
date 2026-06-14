import Link from "next/link";

import { LuxuryButton } from "@/components/site/luxury-button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-28">
      <div className="site-shell">
        <div className="rounded-[2.4rem] border border-[rgba(212,173,94,0.18)] bg-[#12100f] px-6 py-16 text-center text-white shadow-[0_30px_90px_rgba(0,0,0,0.28)] md:px-10">
          <p className="quiet-label text-[var(--gold)]">404 • Maya Haven</p>
          <h1 className="mt-5 font-display text-5xl leading-tight text-balance md:text-7xl">This address is off the market.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/68 md:text-lg">
            The page you requested is no longer staged for viewing. Return to the Maya Haven collection and continue exploring luxury Nairobi residences.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <LuxuryButton href="/" size="lg">
              Return Home
            </LuxuryButton>
            <Link
              href="/properties"
              className="inline-flex h-14 items-center justify-center rounded-full border border-white/12 px-7 text-sm uppercase tracking-[0.18em] text-white/75"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
