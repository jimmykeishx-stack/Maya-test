import Image from "next/image";

import { CTASection } from "@/components/site/cta-section";
import { SectionHeading } from "@/components/site/section-heading";
import { createMetadata } from "@/lib/metadata";
import { properties } from "@/data/properties";
import { stats, timeline } from "@/data/site";

export const metadata = createMetadata({
  title: "About",
  description: "Learn about Maya Haven's luxury brand story, mission, editorial philosophy, and market positioning across Nairobi real estate."
});

export default function AboutPage() {
  return (
    <div className="pb-24 pt-32">
      <section className="site-shell space-y-8">
        <SectionHeading
          eyebrow="About Maya Haven"
          title="A luxury real estate platform built around architecture, atmosphere, and trust."
          description="Maya Haven exists to present premium Nairobi homes with the clarity and sophistication international buyers already expect from the world's strongest luxury brands."
        />
        <div className="grid gap-6 md:grid-cols-4">
          {stats.map((stat) => (
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
              Luxury property deserves a story-led experience, not a cluttered marketplace.
            </h2>
            <p className="text-base leading-8 text-muted-foreground md:text-lg">
              Maya Haven positions each home through mood, proportion, and long-term value. That means showing how a residence feels at arrival, how it supports family rhythms, and how it performs as an asset over time.
            </p>
            <p className="text-base leading-8 text-muted-foreground md:text-lg">
              The result is a premium frontend shaped less like a catalog and more like an architectural editorial, designed for clients who want trust and elegance from the first interaction.
            </p>
          </div>
        </div>
      </section>

      <section className="section-space bg-[#12100f] text-white">
        <div className="site-shell grid gap-8 lg:grid-cols-3">
          <article className="rounded-[1.8rem] border border-white/10 bg-white/5 p-7">
            <p className="quiet-label text-[var(--gold)]">Mission</p>
            <p className="mt-4 font-display text-3xl leading-tight">Create a calm, premium path into Nairobi's most desirable homes.</p>
          </article>
          <article className="rounded-[1.8rem] border border-white/10 bg-white/5 p-7">
            <p className="quiet-label text-[var(--gold)]">Positioning</p>
            <p className="mt-4 font-display text-3xl leading-tight">Compete globally while remaining rooted in African luxury and local insight.</p>
          </article>
          <article className="rounded-[1.8rem] border border-white/10 bg-white/5 p-7">
            <p className="quiet-label text-[var(--gold)]">Philosophy</p>
            <p className="mt-4 font-display text-3xl leading-tight">Present fewer homes, better curated, with more meaning and stronger buyer confidence.</p>
          </article>
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

      <CTASection
        primaryHref="/properties"
        primaryLabel="Browse Curated Listings"
      />
    </div>
  );
}
