import Link from "next/link";
import { Building2, KeyRound, MessageSquareMore, Search, ShieldCheck, Users, Video } from "lucide-react";

import { CTASection } from "@/components/site/cta-section";
import { ClientTestimonials } from "@/components/site/client-testimonials";
import { LeadershipSection } from "@/components/site/leadership-section";
import { LuxuryButton } from "@/components/site/luxury-button";
import { PropertyCard } from "@/components/site/property-card";
import { SectionHeading } from "@/components/site/section-heading";
import {
  getAffordableHousingProperties,
  getCommercialProperties,
  getFeaturedProperties
} from "@/lib/property-store";
import { createMetadata } from "@/lib/metadata";
import { eventsGalleryItems, insightPosts, serviceCards } from "@/data/site";

export const metadata = createMetadata({
  title: "Property Marketplace & Global Investor Advisory",
  description:
    "Maya Haven helps clients find a property they can call home within Nairobi and beyond, while offering trusted property consultation, investor support, and management services."
});

export const dynamic = "force-dynamic";

const serviceIconMap = {
  search: Search,
  users: Users,
  key: KeyRound,
  message: MessageSquareMore,
  shield: ShieldCheck,
  building: Building2
};

const categoryLinks = [
  { href: "/properties/for-sale", label: "For Sale" },
  { href: "/properties/for-rent", label: "For Rent" },
  { href: "/properties/commercial", label: "Commercial" },
  { href: "/properties/affordable-housing", label: "Affordable Housing" }
];

export default async function HomePage() {
  const featuredProperties = await getFeaturedProperties();
  const affordableProperties = (await getAffordableHousingProperties()).slice(0, 2);
  const commercialProperties = (await getCommercialProperties()).slice(0, 2);

  return (
    <>
      <section className="relative isolate flex min-h-[92svh] items-end overflow-hidden bg-black pt-24 text-white sm:pt-28">
        <video
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={featuredProperties[0]?.coverImage}
        >
          <source src="/media/hero/maya-haven-hero.mp4" type="video/mp4" />
        </video>
        <div className="film-overlay pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,173,94,0.18),transparent_28%)]" />
        <div className="site-shell relative z-10 pb-14 sm:pb-16 md:pb-24">
          <div className="max-w-4xl space-y-5 sm:space-y-6">
            <p className="quiet-label text-[var(--gold)]">REAL ESTATE</p>
            <h1 className="font-display text-4xl leading-[0.95] text-balance sm:text-5xl md:text-7xl xl:text-[6rem]">
              Find a property you can call home within Nairobi and beyond.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-white/72 sm:text-base md:text-lg md:leading-8">
              Maya Haven combines premium property curation with trusted investor consultation, sourcing, due diligence, and management support for clients buying, renting, investing, or listing in Kenya.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <LuxuryButton href="/properties" size="lg" className="w-full justify-center sm:w-auto">
                Explore Properties
              </LuxuryButton>
              <LuxuryButton href="/contact" size="lg" variant="secondary" className="w-full justify-center sm:w-auto">
                SPEAK WITH US
              </LuxuryButton>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="site-shell space-y-6">
          <SectionHeading
            eyebrow="Browse by Intent"
            title="Clearer pathways for sale, rent, commercial, and affordable housing."
            description="Start with the category that matches your goal, then refine further by location, price band, status, and property type."
          />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {categoryLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-[1.6rem] border border-black/6 bg-white/60 px-5 py-6 text-center font-display text-2xl transition hover:-translate-y-0.5"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="site-shell space-y-10">
          <SectionHeading
            eyebrow="Featured Listings"
            title="Premium listings curated across Nairobi's strongest residential and investment corridors."
            description="A refined mix of homes and mandate-led opportunities for buyers, international property investors, and long-view capital."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredProperties.map((property, index) => (
              <PropertyCard key={property.id} property={property} priority={index < 2} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-[#12100f] text-white">
        <div className="site-shell space-y-10">
          <SectionHeading
            eyebrow="Services"
            title="Advisory and management services designed around trust, sourcing discipline, and client protection."
            description="From finding a property to finding the right buyer or tenant, the service structure is designed to be practical, premium, and quietly effective."
            className="max-w-4xl"
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {serviceCards.map((service) => {
              const Icon = serviceIconMap[service.icon as keyof typeof serviceIconMap] ?? Building2;
              return (
                <article key={service.title} className="rounded-[1.8rem] border border-white/10 bg-white/5 p-6 sm:p-7">
                  <Icon className="size-6 text-[var(--gold)]" />
                  <h3 className="mt-5 font-display text-2xl sm:mt-6 sm:text-3xl">{service.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/62">{service.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <LeadershipSection />

      <section className="section-space">
        <div className="site-shell grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="overflow-hidden rounded-[2rem] border border-black/6 bg-[linear-gradient(135deg,rgba(212,173,94,0.18),rgba(255,255,255,0.4))] p-6 sm:p-8">
            <p className="quiet-label text-[var(--gold-strong)]">Diaspora Connect</p>
            <h3 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">Consultation, sourcing, due diligence, and guided virtual viewings for clients abroad.</h3>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base md:leading-8">
              Designed for investors abroad who need reliable local representation, cleaner property verification, and practical help through purchase completion and management.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <LuxuryButton href="/diaspora-connect" size="lg" className="w-full justify-center sm:w-auto">
                Explore Diaspora Connect
              </LuxuryButton>
              <LuxuryButton href="/contact" variant="outline" size="lg" className="w-full justify-center sm:w-auto">
                SPEAK WITH US
              </LuxuryButton>
            </div>
          </div>
          <div className="grid gap-5 rounded-[2rem] border border-black/6 bg-white/60 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <ShieldCheck className="mt-1 size-5 text-[var(--gold-strong)]" />
              <div>
                <h3 className="font-display text-[1.7rem] leading-tight sm:text-2xl">Due Diligence First</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">Support that starts with verification, seller and developer vetting, and clearer documentation before commitment.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Video className="mt-1 size-5 text-[var(--gold-strong)]" />
              <div>
                <h3 className="font-display text-[1.7rem] leading-tight sm:text-2xl">Guided Virtual Viewings</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">Live walkthroughs, recorded recaps, and practical commentary for clients making decisions from outside Kenya.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Building2 className="mt-1 size-5 text-[var(--gold-strong)]" />
              <div>
                <h3 className="font-display text-[1.7rem] leading-tight sm:text-2xl">Property Management Support</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">Ongoing support for owners who need local coordination after purchase, tenancy placement, or handover.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="site-shell space-y-10">
          <SectionHeading
            eyebrow="Affordable Housing Options"
            title="Structured options for practical ownership and dependable family living."
            description="Affordable housing deserves clear presentation too, especially for first-time buyers, family-backed purchases, and realistic rental planning."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {affordableProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-[#12100f] text-white">
        <div className="site-shell space-y-10">
          <SectionHeading
            eyebrow="Commercial"
            title="Commercial properties for lease, acquisition, and mandate-led investor conversations."
            description="Selected office, retail, and mixed-use opportunities for operators, landlords, and clients expanding into Kenya."
            className="max-w-4xl"
          />
          <div className="grid gap-6 md:grid-cols-2">
            {commercialProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      <ClientTestimonials />

      <section className="section-space">
        <div className="site-shell space-y-10">
          <SectionHeading
            eyebrow="MAYA HAVEN INSIGHT"
            title="Editorial guidance for buyers, landlords, and international property investors."
            description="Context, not clutter. A more useful content layer for the questions people ask before they transact."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {insightPosts.map((post) => (
              <article key={post.title} className="rounded-[1.8rem] border border-black/6 bg-white/60 p-6">
                <p className="quiet-label text-[var(--gold-strong)]">{post.category}</p>
                <h3 className="mt-4 font-display text-3xl leading-tight">{post.title}</h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-[#12100f] text-white">
        <div className="site-shell space-y-10">
          <SectionHeading
            eyebrow="Events & Gallery"
            title="A CMS-ready layer for briefings, showcases, and client milestones."
            description="Built to host property launches, investor briefings, gallery updates, and transaction milestones with the same premium restraint."
            className="max-w-4xl"
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {eventsGalleryItems.map((item) => (
              <article key={item.title} className="rounded-[1.8rem] border border-white/10 bg-white/5 p-6">
                <p className="quiet-label text-[var(--gold)]">{item.category}</p>
                <h3 className="mt-4 font-display text-3xl leading-tight">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/65">{item.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTASection primaryHref="/contact" primaryLabel="SPEAK WITH US" secondaryHref="/list-with-us" secondaryLabel="List With Us" />
    </>
  );
}
