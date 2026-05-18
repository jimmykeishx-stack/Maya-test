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
        <div className="overflow-hidden rounded-[1.8rem] border border-[rgba(212,173,94,0.18)] bg-[#12100f] px-5 py-8 text-white shadow-[0_30px_90px_rgba(0,0,0,0.24)] sm:px-6 md:rounded-[2.2rem] md:px-10 md:py-12">
          <div className="space-y-5 text-center md:space-y-6">
            <p className="quiet-label text-[var(--gold)]">Let&apos;s Talk</p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
              <LuxuryButton href={primaryHref} size="lg" className="w-full justify-center sm:w-auto">
                {primaryLabel}
              </LuxuryButton>
              {secondaryHref && secondaryLabel ? (
                <LuxuryButton href={secondaryHref} variant="secondary" size="lg" className="w-full justify-center sm:w-auto">
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
