import Image from "next/image";

import { CTASection } from "@/components/site/cta-section";
import { SectionHeading } from "@/components/site/section-heading";
import { createMetadata } from "@/lib/metadata";
import { getProperties } from "@/lib/property-store";
import { aboutStats, timeline, trustIndicators } from "@/data/site";

export const metadata = createMetadata({
  title: "About",
  description: "Learn about Maya Haven's mission, trust-led approach, diaspora advisory positioning, and professional property services."
});

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const properties = await getProperties();

  return (
    <div className="pb-24 pt-32">
      <section className="site-shell space-y-8">
        <SectionHeading
          eyebrow="About Maya Haven"
          title="A modern property marketplace built around trust, clarity, and better on-ground support."
          description="Maya Haven helps clients find a property they can call home within Nairobi and beyond, while offering trusted diaspora consultation and management services."
        />
        <div className="grid gap-6 md:grid-cols-4">
          {aboutStats.map((stat) => (
            <article key={stat.label} className="rounded-[1.8rem] border border-black/6 bg-white/60 p-6">
              <p className="font-display text-4xl">{stat.value}</p>
              <p className="mt-3 text-sm uppercase tracking-[0.24em] text-muted-foreground">{stat.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-space">
        <div className="site-shell grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="overflow-hidden rounded-[2rem]">
            <Image
              src={properties[1].coverImage}
              alt="Maya Haven luxury lifestyle"
              width={1600}
              height={1200}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-6">
            <p className="quiet-label text-[var(--gold-strong)]">Brand Story</p>
            <h2 className="font-display text-4xl leading-tight text-balance md:text-5xl">
              Property decisions deserve more than noise, pressure, or generic listing portals.
            </h2>
            <p className="text-base leading-8 text-muted-foreground md:text-lg">
              Maya Haven combines sourcing discipline, presentation quality, and practical transaction support for clients buying, renting, listing, or managing property in Kenya.
            </p>
            <p className="text-base leading-8 text-muted-foreground md:text-lg">
              That includes diaspora clients who need local representation, owner-clients who need stronger tenant or buyer sourcing, and families who want a calmer route into homeownership.
            </p>
          </div>
        </div>
      </section>

      <section className="section-space bg-[#12100f] text-white">
        <div className="site-shell grid gap-8 lg:grid-cols-3">
          <article className="rounded-[1.8rem] border border-white/10 bg-white/5 p-7">
            <p className="quiet-label text-[var(--gold)]">Mission</p>
            <p className="mt-4 font-display text-3xl leading-tight">Create a calmer, more trusted path into property decisions within Nairobi and beyond.</p>
          </article>
          <article className="rounded-[1.8rem] border border-white/10 bg-white/5 p-7">
            <p className="quiet-label text-[var(--gold)]">Diaspora Focus</p>
            <p className="mt-4 font-display text-3xl leading-tight">Support Kenyans abroad with guided sourcing, due diligence, and local coordination.</p>
          </article>
          <article className="rounded-[1.8rem] border border-white/10 bg-white/5 p-7">
            <p className="quiet-label text-[var(--gold)]">Professional Standards</p>
            <p className="mt-4 font-display text-3xl leading-tight">Maintain a visible trust framework, including space for EARB and professional compliance references.</p>
          </article>
        </div>
      </section>

      <section className="section-space">
        <div className="site-shell space-y-8">
          <SectionHeading
            eyebrow="Trust Indicators"
            title="A credibility-led company profile designed around discretion rather than personality exposure."
            description="The business prefers minimal personal exposure and stronger emphasis on standards, service clarity, and client confidence."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {trustIndicators.map((item) => (
              <article key={item.title} className="rounded-[1.8rem] border border-black/6 bg-white/60 p-7">
                <p className="quiet-label text-[var(--gold-strong)]">{item.eyebrow}</p>
                <h3 className="mt-4 font-display text-3xl leading-tight">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="site-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="quiet-label text-[var(--gold-strong)]">Timeline</p>
            <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">The journey from boutique advisory to premium digital real estate experience.</h2>
          </div>
          <div className="grid gap-5">
            {timeline.map((item) => (
              <article key={item.year} className="rounded-[1.8rem] border border-black/6 bg-white/60 p-6">
                <p className="quiet-label text-[var(--gold-strong)]">{item.year}</p>
                <h3 className="mt-3 font-display text-2xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTASection primaryHref="/contact" primaryLabel="SPEAK WITH US" secondaryHref="/diaspora-connect" secondaryLabel="Diaspora Connect" />
    </div>
  );
}
