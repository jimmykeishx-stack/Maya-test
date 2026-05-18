import { LuxuryButton } from "@/components/site/luxury-button";

export function LeadershipSection() {
  return (
    <section className="section-space">
      <div className="site-shell">
        <div className="mx-auto max-w-5xl space-y-5 text-center md:space-y-6">
          <p className="quiet-label text-[var(--gold-strong)]">Mission & Credibility</p>
          <h2 className="font-display text-3xl leading-tight text-balance sm:text-4xl md:text-5xl">
            Trusted property guidance shaped by discretion, process, and professional discipline.
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base md:text-lg md:leading-8">
            Maya Haven helps clients find a property they can call home within Nairobi and beyond, while offering trusted diaspora consultation and management services.
          </p>
          <div className="grid gap-6 pt-4 md:grid-cols-3">
            <article className="rounded-[1.8rem] border border-black/6 bg-white/60 p-6 text-left">
              <p className="quiet-label text-[var(--gold-strong)]">Mission</p>
              <p className="mt-4 font-display text-2xl leading-tight">To simplify property decisions through trusted advisory, cleaner sourcing, and stronger client protection.</p>
            </article>
            <article className="rounded-[1.8rem] border border-black/6 bg-white/60 p-6 text-left">
              <p className="quiet-label text-[var(--gold-strong)]">EARB Section</p>
              <p className="mt-4 font-display text-2xl leading-tight">A dedicated space for credential references, standards, and professional due diligence signals.</p>
            </article>
            <article className="rounded-[1.8rem] border border-black/6 bg-white/60 p-6 text-left">
              <p className="quiet-label text-[var(--gold-strong)]">Client Trust</p>
              <p className="mt-4 font-display text-2xl leading-tight">Designed for diaspora buyers, landlords, and families who value calm, competent representation.</p>
            </article>
          </div>
          <LuxuryButton href="/diaspora-connect" size="lg" className="w-full justify-center sm:w-auto">
            Explore Diaspora Connect
          </LuxuryButton>
        </div>
      </div>
    </section>
  );
}
