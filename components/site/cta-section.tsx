import { LuxuryButton } from "@/components/site/luxury-button";

type CTASectionProps = {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function CTASection({
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel
}: CTASectionProps) {
  return (
    <section className="section-space">
      <div className="site-shell">
        <div className="overflow-hidden rounded-[2.2rem] border border-[rgba(212,173,94,0.18)] bg-[#12100f] px-6 py-10 text-white shadow-[0_30px_90px_rgba(0,0,0,0.24)] md:px-10 md:py-12">
          <div className="space-y-6 text-center">
            <p className="quiet-label text-[var(--gold)]">Let&apos;s Talk</p>
            <div className="flex flex-wrap justify-center gap-3">
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
