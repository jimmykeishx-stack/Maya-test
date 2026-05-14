import { LuxuryButton } from "@/components/site/luxury-button";

type CTASectionProps = {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function CTASection({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel
}: CTASectionProps) {
  return (
    <section className="section-space">
      <div className="site-shell">
        <div className="overflow-hidden rounded-[2.2rem] border border-[rgba(212,173,94,0.18)] bg-[#12100f] px-6 py-10 text-white shadow-[0_30px_90px_rgba(0,0,0,0.24)] md:px-10 md:py-14">
          <div className="grid gap-8 md:grid-cols-[1.4fr_0.8fr] md:items-end">
            <div className="space-y-4">
              <p className="quiet-label text-[var(--gold)]">Private Consultation</p>
              <h2 className="font-display text-4xl leading-tight text-balance md:text-5xl">{title}</h2>
              <p className="max-w-2xl text-base leading-7 text-white/68 md:text-lg">{description}</p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <LuxuryButton href={primaryHref} size="lg">
                {primaryLabel}
              </LuxuryButton>
              {secondaryHref && secondaryLabel ? (
                <LuxuryButton href={secondaryHref} variant="secondary" size="lg">
                  {secondaryLabel}
                </LuxuryButton>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
