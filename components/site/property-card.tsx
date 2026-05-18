"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import { motion } from "framer-motion";

import { PropertyPrice } from "@/components/site/property-price";
import {
  getListingLabel,
  getMandateLabel,
  getMarketStatusLabel,
  getSegmentLabel,
  type Property
} from "@/data/properties";
import { useSavedListings } from "@/hooks/use-saved-listings";
import { cn } from "@/lib/utils";

type PropertyCardProps = {
  property: Property;
  priority?: boolean;
};

export function PropertyCard({ property, priority = false }: PropertyCardProps) {
  const { isSaved, toggleSaved } = useSavedListings();
  const saved = isSaved(property.id);
  const isUnavailable = property.marketStatus !== "available";

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group overflow-hidden rounded-[2rem] border border-black/6 bg-[rgba(255,251,244,0.84)] shadow-[0_28px_90px_rgba(15,12,8,0.08)]"
    >
      <div className="relative aspect-[4/4.5] overflow-hidden">
        <Image
          src={property.coverImage}
          alt={property.title}
          fill
          priority={priority}
          className={cn("object-cover transition duration-700 group-hover:scale-105", isUnavailable && "opacity-80 grayscale-[0.08]")}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,16,15,0.08),rgba(18,16,15,0.72))]" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2 sm:left-5 sm:top-5">
          <span className="rounded-full border border-white/15 bg-white/8 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.24em] sm:px-3 sm:text-[0.7rem]">
            {getListingLabel(property.listingType)}
          </span>
          <span className="rounded-full border border-white/15 bg-white/8 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.24em] sm:px-3 sm:text-[0.7rem]">
            {getSegmentLabel(property.segment)}
          </span>
          {property.mandateType === "exclusive" ? (
            <span className="rounded-full border border-[rgba(212,173,94,0.45)] bg-[rgba(212,173,94,0.22)] px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.24em] text-[var(--gold)] sm:px-3 sm:text-[0.7rem]">
              {getMandateLabel(property.mandateType)}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => toggleSaved(property.id)}
          className={cn(
            "absolute right-4 top-4 rounded-full border p-2.5 backdrop-blur-md transition sm:right-5 sm:top-5 sm:p-3",
            saved ? "border-[rgba(212,173,94,0.45)] bg-[rgba(212,173,94,0.16)] text-[var(--gold-strong)]" : "border-white/12 bg-black/20 text-white"
          )}
          aria-label={saved ? "Remove from saved listings" : "Save listing"}
        >
          <Heart className={cn("size-4", saved && "fill-current")} />
        </button>
        <div className="absolute inset-x-4 bottom-4 space-y-3 text-white sm:inset-x-5 sm:bottom-5">
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
            <span className="rounded-full border border-white/15 bg-white/8 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.24em] sm:px-3 sm:text-[0.7rem]">
              {property.type}
            </span>
            <span className="rounded-full border border-white/15 bg-white/8 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.24em] sm:px-3 sm:text-[0.7rem]">
              {getMarketStatusLabel(property.marketStatus)}
            </span>
          </div>
          <div>
            <PropertyPrice amount={property.price} compact suffix={property.priceSuffix} className="font-display text-[1.85rem] sm:text-3xl" />
            <h3 className="mt-2 font-display text-[1.55rem] leading-tight sm:text-2xl">{property.title}</h3>
            <p className="mt-2 flex items-center gap-2 text-sm text-white/72">
              <MapPin className="size-4" />
              {property.location}, Nairobi
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-5 p-5 sm:p-6">
        <p className="text-sm leading-7 text-muted-foreground">{property.blurb}</p>
        <div className="grid gap-3 text-sm text-muted-foreground min-[360px]:grid-cols-3">
          {property.metrics.slice(0, 3).map((metric) => (
            <span key={metric.label} className="rounded-[1rem] border border-black/6 bg-white/55 px-3 py-3">
              <span className="block text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">{metric.label}</span>
              <span className="mt-1 block font-medium text-foreground">{metric.value}</span>
            </span>
          ))}
        </div>
        <div className="flex flex-col items-start justify-between gap-3 min-[430px]:flex-row min-[430px]:items-center">
          <PropertyPrice amount={property.price} suffix={property.priceSuffix} className="text-sm font-medium text-foreground" />
          <Link href={`/properties/${property.slug}`} className="quiet-label text-[var(--gold-strong)]">
            {isUnavailable ? "View Record" : "View Property"}
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
