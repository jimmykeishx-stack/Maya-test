import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, MoveUpRight, Sparkles } from "lucide-react";

import { CTASection } from "@/components/site/cta-section";
import { PropertyCard } from "@/components/site/property-card";
import { PropertyGallery } from "@/components/site/property-gallery";
import { PropertyPrice } from "@/components/site/property-price";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { companyContact } from "@/data/site";
import {
  getListingLabel,
  getMandateLabel,
  getMarketStatusLabel,
  getSegmentLabel
} from "@/data/properties";
import { getProperties, getPropertyBySlug, getSimilarProperties } from "@/lib/property-store";
import { createMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const properties = await getProperties();

  return properties.map((property) => ({
    slug: property.slug
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return createMetadata({
      title: "Property Not Found",
      description: "This Maya Haven property could not be found."
    });
  }
  const primaryImage = property.coverImage || property.gallery?.[0] || "/placeholder.jpg";

  return createMetadata({
    title: property.title,
    description: property.blurb || property.description,
    image: primaryImage
  });
}

export default async function PropertyDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const similarProperties = await getSimilarProperties(property.slug, property.segment, property.listingType);
  const primaryImage = property.coverImage || property.gallery?.[0] || "/placeholder.jpg";
  const galleryImages = property.gallery.length ? property.gallery : [primaryImage];

  return (
    <div className="pb-24 pt-24 sm:pt-28">
      <section className="site-shell space-y-8">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge>{property.type}</Badge>
              <Badge>{getListingLabel(property.listingType)}</Badge>
              <Badge>{getSegmentLabel(property.segment)}</Badge>
              <Badge>{getMarketStatusLabel(property.marketStatus)}</Badge>
              {property.mandateType === "exclusive" ? <Badge>{getMandateLabel(property.mandateType)}</Badge> : null}
            </div>
            <h1 className="font-display text-4xl leading-tight text-balance sm:text-5xl md:text-6xl">{property.title}</h1>
            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4 text-[var(--gold-strong)]" />
              {property.location}, Nairobi
            </p>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base md:text-lg md:leading-8">{property.description}</p>
          </div>
          <div className="rounded-[2rem] border border-black/6 bg-white/60 p-5 shadow-[0_24px_80px_rgba(15,12,8,0.06)] sm:p-6">
            <p className="quiet-label text-[var(--gold-strong)]">Signature Highlight</p>
            <p className="mt-4 font-display text-2xl leading-tight sm:text-3xl">{property.highlight}</p>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">{property.agentNote}</p>
          </div>
        </div>

        <div className="space-y-10">
          <PropertyGallery title={property.title} images={galleryImages} />
          <div className="rounded-[2rem] border border-black/6 bg-[#12100f] p-5 text-white shadow-[0_28px_90px_rgba(0,0,0,0.22)] sm:p-7">
            <p className="quiet-label text-[var(--gold)]">Property Overview</p>
            <PropertyPrice amount={property.price} suffix={property.priceSuffix} className="mt-4 block font-display text-3xl sm:text-4xl" />
            <div className="mt-6 grid gap-4 text-sm text-white/70 md:grid-cols-2 xl:grid-cols-4">
              {property.metrics.map((metric) => (
                <span key={metric.label} className="rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-4">
                  <span className="block text-[0.68rem] uppercase tracking-[0.22em] text-white/52">{metric.label}</span>
                  <span className="mt-2 block text-white">{metric.value}</span>
                </span>
              ))}
            </div>
            <Separator className="my-6 bg-[linear-gradient(90deg,transparent,rgba(212,173,94,0.4),transparent)]" />
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/contact"
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#d4ad5e_0%,#b89041_100%)] px-6 text-sm font-medium uppercase tracking-[0.18em] text-black sm:w-auto"
              >
                SPEAK WITH US
              </Link>
              <a
                href={companyContact.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/10 px-6 text-sm uppercase tracking-[0.18em] text-white/80 sm:w-auto"
              >
                WhatsApp Inquiry
              </a>
            </div>
          </div>
          {property.youtubeVideoId ? (
            <div className="overflow-hidden rounded-[2rem] border border-black/6 bg-white/60 p-5 sm:p-7">
              <p className="quiet-label text-[var(--gold-strong)]">Property Video</p>
              <div className="mt-6 aspect-video overflow-hidden rounded-[1.6rem]">
                <iframe
                  src={`https://www.youtube.com/embed/${property.youtubeVideoId}`}
                  title={`${property.title} video tour`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="section-space">
        <div className="site-shell grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-black/6 bg-white/55 p-6 sm:p-8">
            <p className="quiet-label text-[var(--gold-strong)]">Amenities</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {property.amenities.map((amenity) => (
                <div key={amenity} className="rounded-[1.3rem] border border-black/6 bg-white/70 px-4 py-4 text-sm text-muted-foreground">
                  {amenity}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-black/6 bg-white/55 p-6 sm:p-8">
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
          <div className="overflow-hidden rounded-[2rem] border border-black/6 bg-[#12100f] p-6 text-white sm:p-8">
            <p className="quiet-label text-[var(--gold)]">Interactive Map</p>
            <div className="mt-6 flex min-h-72 items-end rounded-[1.6rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(212,173,94,0.18))] p-6">
              <div>
                <p className="font-display text-2xl sm:text-3xl">{property.location} district context</p>
                <p className="mt-3 max-w-md text-sm leading-7 text-white/68">
                  Frontend placeholder for an interactive neighbourhood map showing access routes, schools, lifestyle nodes, and premium services.
                </p>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-black/6 bg-white/55 p-6 sm:p-8">
            <p className="quiet-label text-[var(--gold-strong)]">Virtual Tour</p>
            <div className="mt-6 flex min-h-72 items-end rounded-[1.6rem] border border-dashed border-black/10 bg-[linear-gradient(135deg,rgba(212,173,94,0.12),rgba(255,255,255,0.55))] p-6">
              <div>
                <p className="font-display text-2xl sm:text-3xl">Immersive walkthrough ready</p>
                <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
                  Reserved for a future 3D tour, cinematic reel, or additional guided media support where needed.
                </p>
                <a
                  href={companyContact.whatsappHref}
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
              <h2 className="mt-4 font-display text-3xl sm:text-4xl">More Maya Haven homes in this rhythm.</h2>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {similarProperties.map((similar) => (
              <PropertyCard key={similar.id} property={similar} />
            ))}
          </div>
        </div>
      </section>

      <CTASection primaryHref="/contact" primaryLabel="SPEAK WITH US" secondaryHref="/list-with-us" secondaryLabel="List With Us" />
    </div>
  );
}
