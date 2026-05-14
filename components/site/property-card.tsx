"use client";

import Image from "next/image";
import Link from "next/link";
import { BedDouble, Heart, MapPin, Bath, Ruler } from "lucide-react";
import { motion } from "framer-motion";

import type { Property } from "@/data/properties";
import { useSavedListings } from "@/hooks/use-saved-listings";
import { cn, formatCompactPrice, formatPrice } from "@/lib/utils";

type PropertyCardProps = {
  property: Property;
  priority?: boolean;
};

export function PropertyCard({ property, priority = false }: PropertyCardProps) {
  const { isSaved, toggleSaved } = useSavedListings();
  const saved = isSaved(property.id);

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
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,16,15,0.08),rgba(18,16,15,0.72))]" />
        <button
          type="button"
          onClick={() => toggleSaved(property.id)}
          className={cn(
            "absolute right-5 top-5 rounded-full border p-3 backdrop-blur-md transition",
            saved ? "border-[rgba(212,173,94,0.45)] bg-[rgba(212,173,94,0.16)] text-[var(--gold-strong)]" : "border-white/12 bg-black/20 text-white"
          )}
          aria-label={saved ? "Remove from saved listings" : "Save listing"}
        >
          <Heart className={cn("size-4", saved && "fill-current")} />
        </button>
        <div className="absolute inset-x-5 bottom-5 space-y-3 text-white">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[0.7rem] uppercase tracking-[0.28em]">
              {property.type}
            </span>
            <span className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[0.7rem] uppercase tracking-[0.28em]">
              {property.status}
            </span>
          </div>
          <div>
            <p className="font-display text-3xl">{formatCompactPrice(property.price)}</p>
            <h3 className="mt-2 font-display text-2xl">{property.title}</h3>
            <p className="mt-2 flex items-center gap-2 text-sm text-white/72">
              <MapPin className="size-4" />
              {property.location}, Nairobi
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-5 p-6">
        <p className="text-sm leading-7 text-muted-foreground">{property.blurb}</p>
        <div className="grid grid-cols-3 gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-2"><BedDouble className="size-4 text-[var(--gold-strong)]" /> {property.bedrooms} Beds</span>
          <span className="flex items-center gap-2"><Bath className="size-4 text-[var(--gold-strong)]" /> {property.bathrooms} Baths</span>
          <span className="flex items-center gap-2"><Ruler className="size-4 text-[var(--gold-strong)]" /> {property.sqft.toLocaleString()} sqft</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-foreground">{formatPrice(property.price)}</p>
          <Link href={`/properties/${property.slug}`} className="quiet-label text-[var(--gold-strong)]">
            View Property
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
