"use client";

import { PropertyCard } from "@/components/site/property-card";
import { LuxuryButton } from "@/components/site/luxury-button";
import { properties } from "@/data/properties";
import { useSavedListings } from "@/hooks/use-saved-listings";

export function SavedListingsView() {
  const { savedIds } = useSavedListings();
  const savedProperties = properties.filter((property) => savedIds.includes(property.id));

  if (savedProperties.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-black/10 bg-white/50 px-6 py-14 text-center md:px-10">
        <p className="quiet-label text-[var(--gold-strong)]">Saved Listings</p>
        <h2 className="mt-4 font-display text-4xl">Your shortlist is still open.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Save properties as you explore and Maya Haven will keep your luxury shortlist ready for review.
        </p>
        <div className="mt-8 flex justify-center">
          <LuxuryButton href="/properties" size="lg">
            Explore Properties
          </LuxuryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {savedProperties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
