import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bath, BedDouble, Building2, MapPin, MoveUpRight, Ruler, Sparkles } from "lucide-react";

import { CTASection } from "@/components/site/cta-section";
import { PropertyCard } from "@/components/site/property-card";
import { PropertyGallery } from "@/components/site/property-gallery";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getPropertyBySlug, getSimilarProperties, properties } from "@/data/properties";
import { formatPrice } from "@/lib/utils";

export async function generateStaticParams() {
  return properties.map((property) => ({
    slug: property.slug
  }));
}

export default async function PropertyDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const similarProperties = getSimilarProperties(property.slug, property.location);

  return (
    <div className="pb-24 pt-28">
      <section className="site-shell space-y-8">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-4">
            <Badge>{property.type}</Badge>
            <h1 className="font-display text-5xl leading-tight text-balance md:text-6xl">{property.title}</h1>
            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4 text-[var(--gold-strong)]" />
              {property.location}, Nairobi
            </p>
            <p className="max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">{property.description}</p>
          </div>
          <div className="rounded-[2rem] border border-black/6 bg-white/60 p-6 shadow-[0_24px_80px_rgba(15,12,8,0.06)]">
            <p className="quiet-label text-[var(--gold-strong)]">Signature Highlight</p>
            <p className="mt-4 font-display text-3xl leading-tight">{property.highlight}</p>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">{property.agentNote}</p>
          </div>
        </div>

        <div className="space-y-10">
          <PropertyGallery title={property.title} images={property.gallery} />
          <div className="rounded-[2rem] border border-black/6 bg-[#12100f] p-7 text-white shadow-[0_28px_90px_rgba(0,0,0,0.22)]">
            <p className="quiet-label text-[var(--gold)]">Property Overview</p>
            <p className="mt-4 font-display text-4xl">{formatPrice(property.price)}</p>
            <div className="mt-6 grid gap-4 text-sm text-white/70 md:grid-cols-2 xl:grid-cols-4">
              <span className="flex items-center gap-3"><BedDouble className="size-4 text-[var(--gold)]" /> {property.bedrooms} Bedrooms</span>
              <span className="flex items-center gap-3"><Bath className="size-4 text-[var(--gold)]" /> {property.bathrooms} Bathrooms</span>
              <span className="flex items-center gap-3"><Ruler className="size-4 text-[var(--gold)]" /> {property.sqft.toLocaleString()} sqft</span>
              <span className="flex items-center gap-3"><Building2 className="size-4 text-[var(--gold)]" /> {property.status}</span>
            </div>
            <Separator className="my-6 bg-[linear-gradient(90deg,transparent,rgba(212,173,94,0.4),transparent)]" />
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#d4ad5e_0%,#b89041_100%)] px-6 text-sm font-medium uppercase tracking-[0.18em] text-black"
              >
                Schedule Viewing
              </Link>
              <a
                href="https://wa.me/254720584744"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 px-6 text-sm uppercase tracking-[0.18em] text-white/80"
              >
                WhatsApp Inquiry
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="site-shell grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-black/6 bg-white/55 p-8">
            <p className="quiet-label text-[var(--gold-strong)]">Amenities</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {property.amenities.map((amenity) => (
                <div key={amenity} className="rounded-[1.3rem] border border-black/6 bg-white/70 px-4 py-4 text-sm text-muted-foreground">
                  {amenity}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-black/6 bg-white/55 p-8">
            <p className="quiet-label text-[var(--gold-strong)]">Property Details</p>
            <div className="mt-6 grid gap-4">
              {property.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3 rounded-[1.3rem] border border-black/6 bg-white/70 px-4 py-4 text-sm text-muted-foreground">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-[var(--gold-strong)]" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="site-shell grid gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[2rem] border border-black/6 bg-[#12100f] p-8 text-white">
            <p className="quiet-label text-[var(--gold)]">Interactive Map</p>
            <div className="mt-6 flex min-h-72 items-end rounded-[1.6rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(212,173,94,0.18))] p-6">
              <div>
                <p className="font-display text-3xl">{property.location} district context</p>
                <p className="mt-3 max-w-md text-sm leading-7 text-white/68">
                  Frontend placeholder for an interactive neighbourhood map showing access routes, schools, lifestyle nodes, and premium services.
                </p>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-black/6 bg-white/55 p-8">
            <p className="quiet-label text-[var(--gold-strong)]">Virtual Tour</p>
            <div className="mt-6 flex min-h-72 items-end rounded-[1.6rem] border border-dashed border-black/10 bg-[linear-gradient(135deg,rgba(212,173,94,0.12),rgba(255,255,255,0.55))] p-6">
              <div>
                <p className="font-display text-3xl">Immersive walkthrough ready</p>
                <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
                  Reserved for a future 3D tour, cinematic reel, or agent-guided walkthrough embed.
                </p>
                <a
                  href="https://wa.me/254720584744"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-[var(--gold-strong)]"
                >
                  Request the full viewing reel
                  <MoveUpRight className="size-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="site-shell space-y-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="quiet-label text-[var(--gold-strong)]">Similar Properties</p>
              <h2 className="mt-4 font-display text-4xl">More Maya Haven homes in this rhythm.</h2>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {similarProperties.map((similar) => (
              <PropertyCard key={similar.id} property={similar} />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        primaryHref="/contact"
        primaryLabel="Speak With Maya Haven"
      />
    </div>
  );
}
