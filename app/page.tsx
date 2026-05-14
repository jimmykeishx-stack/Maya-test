import { Building2, Landmark, ShieldCheck, Sparkles, TrendingUp, Users } from "lucide-react";

import { CTASection } from "@/components/site/cta-section";
import { LeadershipSection } from "@/components/site/leadership-section";
import { LuxuryButton } from "@/components/site/luxury-button";
import { PropertyCard } from "@/components/site/property-card";
import { SectionHeading } from "@/components/site/section-heading";
import { TestimonialCarousel } from "@/components/site/testimonial-carousel";
import { createMetadata } from "@/lib/metadata";
import { getFeaturedProperties } from "@/data/properties";
import { lifestylePillars } from "@/data/site";

export const metadata = createMetadata({
  title: "Luxury Nairobi Real Estate",
  description:
    "Discover Maya Haven, a cinematic luxury real estate platform for curated residences, penthouses, and investment-led Nairobi living."
});

const trustPillars = [
  {
    title: "Curated Inventory",
    description: "Every listing is positioned through architecture, mood, and long-term desirability, not just square footage.",
    icon: Building2
  },
  {
    title: "Discreet Advisory",
    description: "Private consultation, polished viewings, and tailored shortlists designed for decisive high-net-worth buyers.",
    icon: ShieldCheck
  },
  {
    title: "Investment Clarity",
    description: "We frame properties around scarcity, rental appeal, and futureproof urban relevance across Nairobi.",
    icon: TrendingUp
  }
];

export default function HomePage() {
  const featuredProperties = getFeaturedProperties();

  return (
    <>
      <section className="relative isolate flex min-h-screen items-end overflow-hidden bg-black pt-28 text-white">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={featuredProperties[0].coverImage}
        >
          <source src="/media/hero/maya-haven-hero.mp4" type="video/mp4" />
        </video>
        <div className="film-overlay absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,173,94,0.18),transparent_28%)]" />
        <div className="site-shell relative z-10 grid gap-10 pb-16 md:pb-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="space-y-6">
            <p className="quiet-label text-[var(--gold)]">Luxury African Real Estate</p>
            <h1 className="max-w-4xl font-display text-5xl leading-[0.95] text-balance md:text-7xl xl:text-[6rem]">
              Curated Nairobi residences for a life of quiet distinction.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-white/72 md:text-lg">
              Maya Haven presents high-end apartments, cinematic penthouses, expat-ready homes, and investment addresses through an editorial lens that feels calm, architectural, and globally refined.
            </p>
            <div className="flex flex-wrap gap-3">
              <LuxuryButton href="/properties" size="lg">
                Explore Properties
              </LuxuryButton>
              <LuxuryButton href="/contact" size="lg" variant="secondary">
                Schedule Viewing
              </LuxuryButton>
            </div>
          </div>
          <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/6 p-6 backdrop-blur-xl">
            <p className="quiet-label text-[var(--gold)]">Currently Featured</p>
            <div>
              <p className="font-display text-3xl">{featuredProperties[0].title}</p>
              <p className="mt-3 text-sm leading-7 text-white/68">{featuredProperties[0].highlight}</p>
            </div>
            <div className="grid gap-3 text-sm text-white/62">
              <span>Westlands, Karen, Kilimani, Riverside, Kileleshwa, Runda</span>
              <span>Private consultations for buyers, expats, and investors</span>
              <span>Luxury presentation built around atmosphere and confidence</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="site-shell space-y-10">
          <SectionHeading
            eyebrow="Featured Properties"
            title="Six residences chosen for drama, polish, and lasting desirability."
            description="A selection of premium Nairobi homes designed to reflect how the next generation of luxury buyers actually wants to live."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredProperties.map((property, index) => (
              <PropertyCard key={property.id} property={property} priority={index < 2} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="site-shell space-y-10">
          <SectionHeading
            eyebrow="Lifestyle Directions"
            title="Luxury living, interpreted through the rhythms that matter."
            description="From elevated skyline rituals to investment-minded acquisitions, Maya Haven frames each home around the life it supports."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {lifestylePillars.map((pillar) => (
              <article key={pillar.title} className="rounded-[1.8rem] border border-black/6 bg-white/55 p-6 shadow-[0_18px_60px_rgba(15,12,8,0.06)]">
                <p className="quiet-label text-[var(--gold-strong)]">{pillar.title}</p>
                <p className="mt-5 text-lg leading-8 text-muted-foreground">{pillar.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-[#12100f] text-white">
        <div className="site-shell space-y-10">
          <SectionHeading
            eyebrow="Why Maya Haven"
            title="Trust, aesthetic judgment, and conversion-focused calm."
            description="Luxury property buyers need more than listings. They need clarity, atmosphere, and an experience that feels aligned with the homes themselves."
            className="max-w-4xl"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {trustPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <article key={pillar.title} className="rounded-[1.8rem] border border-white/10 bg-white/5 p-7">
                  <Icon className="size-6 text-[var(--gold)]" />
                  <h3 className="mt-6 font-display text-3xl">{pillar.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/62">{pillar.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <LeadershipSection />

      <section className="section-space">
        <div className="site-shell grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="overflow-hidden rounded-[2rem] border border-black/6 bg-[linear-gradient(135deg,rgba(212,173,94,0.18),rgba(255,255,255,0.4))] p-8">
            <p className="quiet-label text-[var(--gold-strong)]">Private Market Access</p>
            <h3 className="mt-4 font-display text-4xl leading-tight">Some of our most compelling homes never become public inventory.</h3>
            <p className="mt-4 max-w-xl text-base leading-8 text-muted-foreground">
              Buyers working with Maya Haven receive elevated guidance, discreet opportunities, and neighborhoods framed around lifestyle fit, not generic filters.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LuxuryButton href="/contact" size="lg">
                Book a Consultation
              </LuxuryButton>
              <LuxuryButton href="/about" variant="outline" size="lg">
                Discover the Brand
              </LuxuryButton>
            </div>
          </div>
          <div className="grid gap-5 rounded-[2rem] border border-black/6 bg-white/60 p-8">
            <div className="flex items-start gap-4">
              <Sparkles className="mt-1 size-5 text-[var(--gold-strong)]" />
              <div>
                <h3 className="font-display text-2xl">Editorial Property Positioning</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">Homes are presented through feeling, tone, and visual hierarchy rather than template-driven catalog design.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Users className="mt-1 size-5 text-[var(--gold-strong)]" />
              <div>
                <h3 className="font-display text-2xl">High-Touch Client Journey</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">Every step, from shortlist to viewing, is designed to remove noise and increase buyer confidence.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Landmark className="mt-1 size-5 text-[var(--gold-strong)]" />
              <div>
                <h3 className="font-display text-2xl">A Global Standard, Rooted in Nairobi</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">The visual language feels international while staying grounded in the city, neighborhoods, and buyers we know deeply.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TestimonialCarousel />

      <CTASection
        title="Book a private consultation shaped around the way you want to live."
        description="Whether you are relocating, acquiring a family residence, or building a long-term real estate position in Nairobi, Maya Haven can curate the right next move."
        primaryHref="/contact"
        primaryLabel="Book Consultation"
        secondaryHref="/properties"
        secondaryLabel="View Listings"
      />
    </>
  );
}
