import Image from "next/image";

import { CTASection } from "@/components/site/cta-section";
import { FounderQuoteBlock } from "@/components/site/founder-quote-block";
import { LuxuryButton } from "@/components/site/luxury-button";
import { createMetadata } from "@/lib/metadata";
import { founder } from "@/data/site";
import { properties } from "@/data/properties";

export const metadata = createMetadata({
  title: "Leadership",
  description: "Meet Winnie Cherotich, CEO and Founder of Maya Haven, and explore the philosophy behind the brand's luxury real estate vision."
});

export default function LeadershipPage() {
  return (
    <div className="pb-24 pt-28">
      <section className="site-shell grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
        <div className="overflow-hidden rounded-[2rem] bg-[#12100f]">
          <Image src={founder.portrait} alt={founder.name} width={1000} height={1400} className="h-full w-full object-cover" />
        </div>
        <div className="space-y-6">
          <p className="quiet-label text-[var(--gold-strong)]">Leadership</p>
          <h1 className="font-display text-5xl leading-tight text-balance md:text-6xl">
            Winnie Cherotich leads Maya Haven with vision, taste, and disciplined luxury.
          </h1>
          <p className="text-xl text-muted-foreground">{founder.role}</p>
          <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">{founder.story}</p>
          <LuxuryButton href="/contact" size="lg">
            Book Leadership Consultation
          </LuxuryButton>
        </div>
      </section>

      <section className="section-space">
        <div className="site-shell grid gap-8 lg:grid-cols-3">
          <article className="rounded-[1.8rem] border border-black/6 bg-white/60 p-7">
            <p className="quiet-label text-[var(--gold-strong)]">Founder Story</p>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              Winnie approaches real estate as a form of cultural positioning, building a brand that treats homes as emotional environments and enduring assets rather than simple inventory units.
            </p>
          </article>
          <article className="rounded-[1.8rem] border border-black/6 bg-white/60 p-7">
            <p className="quiet-label text-[var(--gold-strong)]">Vision for Maya Haven</p>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              Her vision is to create a luxury African platform with the calm authority of a design publication and the clarity of a highly trusted private advisor.
            </p>
          </article>
          <article className="rounded-[1.8rem] border border-black/6 bg-white/60 p-7">
            <p className="quiet-label text-[var(--gold-strong)]">Luxury Philosophy</p>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              Luxury should feel effortless, intelligent, and composed. That belief shapes how Maya Haven presents homes, serves clients, and defines value.
            </p>
          </article>
        </div>
      </section>

      <section className="section-space bg-[#12100f] text-white">
        <div className="site-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="space-y-5">
            <p className="quiet-label text-[var(--gold)]">Mission Statement</p>
            <h2 className="font-display text-4xl leading-tight text-balance md:text-5xl">{founder.mission}</h2>
            <p className="max-w-2xl text-base leading-8 text-white/65 md:text-lg">
              The ambition is not simply to market beautiful homes, but to redefine how modern African luxury is seen, selected, and experienced online.
            </p>
          </div>
          <FounderQuoteBlock />
        </div>
      </section>

      <section className="section-space">
        <div className="site-shell space-y-8">
          <div className="max-w-3xl">
            <p className="quiet-label text-[var(--gold-strong)]">Editorial Imagery</p>
            <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
              An executive presence grounded in architecture, quiet confidence, and polished restraint.
            </h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="overflow-hidden rounded-[2rem]">
              <Image src={properties[5].coverImage} alt="Luxury residence" width={1800} height={1200} className="h-full w-full object-cover" />
            </div>
            <div className="grid gap-5">
              <div className="overflow-hidden rounded-[2rem]">
                <Image src={properties[0].coverImage} alt="Luxury skyline residence" width={1600} height={1200} className="h-full w-full object-cover" />
              </div>
              <div className="rounded-[2rem] border border-black/6 bg-white/60 p-7">
                <p className="quiet-label text-[var(--gold-strong)]">Executive Note</p>
                <p className="mt-4 text-base leading-8 text-muted-foreground">
                  Winnie believes that the next chapter of African luxury will be led by brands that know how to balance timeless design, emotional clarity, and trusted service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        primaryHref="/contact"
        primaryLabel="Request Consultation"
      />
    </div>
  );
}
