"use client";

import { startTransition, useDeferredValue, useMemo, useState } from "react";

import { FilterSidebar, type FilterValues } from "@/components/site/filter-sidebar";
import { PropertyCard } from "@/components/site/property-card";
import { Input } from "@/components/ui/input";
import {
  sortOptions,
  type Property
} from "@/data/properties";

type PropertiesBrowserProps = {
  properties: Property[];
  initialFilters?: Partial<FilterValues>;
};

const defaultFilters: FilterValues = {
  search: "",
  listingType: "All",
  segment: "All",
  availability: "Live Listings",
  location: "All",
  bedrooms: "Any",
  bathrooms: "Any",
  type: "All",
  priceRange: "All"
};

export function PropertiesBrowser({ properties, initialFilters }: PropertiesBrowserProps) {
  const [visibleCount, setVisibleCount] = useState(6);
  const [notifyPhone, setNotifyPhone] = useState("");
  const [notifyRequested, setNotifyRequested] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    ...defaultFilters,
    ...initialFilters
  });
  const [sortBy, setSortBy] = useState<(typeof sortOptions)[number]["value"]>("featured");
  const deferredSearch = useDeferredValue(filters.search);
  const normalizedNotifyPhone = notifyPhone.replace(/\s+/g, "");
  const canRequestNotify = /^\+254\d{9}$/.test(normalizedNotifyPhone);

  const filtered = useMemo(() => {
    return properties
      .filter((property) => {
        const normalizedSearch = deferredSearch.trim().toLowerCase();
        const matchesSearch =
          normalizedSearch.length === 0 ||
          property.title.toLowerCase().includes(normalizedSearch) ||
          property.location.toLowerCase().includes(normalizedSearch) ||
          property.blurb.toLowerCase().includes(normalizedSearch);

        const matchesListingType =
          filters.listingType === "All" ||
          (filters.listingType === "Sale" && property.listingType === "sale") ||
          (filters.listingType === "Rent" && property.listingType === "rent");

        const matchesSegment =
          filters.segment === "All" ||
          (filters.segment === "Residential" && property.segment === "residential") ||
          (filters.segment === "Commercial" && property.segment === "commercial") ||
          (filters.segment === "Affordable Housing" && property.segment === "affordable-housing");

        const matchesAvailability =
          filters.availability === "All Statuses" ||
          (filters.availability === "Live Listings" && property.marketStatus === "available") ||
          (filters.availability === "Sold" && property.marketStatus === "sold") ||
          (filters.availability === "Rented" && property.marketStatus === "rented") ||
          (filters.availability === "Archived" && property.marketStatus === "archived");

        const matchesLocation = filters.location === "All" || property.location === filters.location;
        const matchesType = filters.type === "All" || property.type === filters.type;

        const minimumBeds = parseInt(filters.bedrooms, 10);
        const minimumBaths = parseInt(filters.bathrooms, 10);
        const matchesBedrooms = Number.isNaN(minimumBeds) || (property.bedrooms ?? 0) >= minimumBeds;
        const matchesBathrooms = Number.isNaN(minimumBaths) || (property.bathrooms ?? 0) >= minimumBaths;

        const matchesPrice =
          filters.priceRange === "All" ||
          (filters.priceRange === "Under KES 40M" && property.price < 40000000) ||
          (filters.priceRange === "KES 40M - 80M" && property.price >= 40000000 && property.price <= 80000000) ||
          (filters.priceRange === "KES 80M - 150M" && property.price > 80000000 && property.price <= 150000000) ||
          (filters.priceRange === "Above KES 150M" && property.price > 150000000);

        return (
          matchesSearch &&
          matchesListingType &&
          matchesSegment &&
          matchesAvailability &&
          matchesLocation &&
          matchesType &&
          matchesBedrooms &&
          matchesBathrooms &&
          matchesPrice
        );
      })
      .sort((a, b) => {
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "size-desc") return b.sqft - a.sqft;
        return properties.indexOf(a) - properties.indexOf(b);
      });
  }, [deferredSearch, filters, properties, sortBy]);

  return (
    <div className="space-y-6">
      <FilterSidebar
        values={filters}
        onChange={(field, value) => {
          startTransition(() => {
            setVisibleCount(6);
            setNotifyRequested(false);
            setFilters((current) => ({ ...current, [field]: value }));
          });
        }}
      />

      <div className="flex flex-col gap-4 rounded-[1.7rem] border border-black/6 bg-white/55 p-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{Math.min(filtered.length, visibleCount)}</span> of{" "}
          <span className="font-medium text-foreground">{filtered.length}</span> curated opportunities
        </p>
        <label className="flex items-center gap-3 text-sm text-muted-foreground">
          Sort by
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as (typeof sortOptions)[number]["value"])}
            className="h-11 rounded-full border border-black/6 bg-white/70 px-4 text-foreground outline-none"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.slice(0, visibleCount).map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[1.8rem] border border-dashed border-black/10 bg-white/45 p-10 text-center">
          <p className="font-display text-3xl">No exact match yet.</p>
          <p className="mt-3 text-muted-foreground">Leave your number and we will notify you when a matching opportunity becomes available.</p>
          <div className="mx-auto mt-6 max-w-md space-y-4">
            <Input
              type="tel"
              inputMode="tel"
              value={notifyPhone}
              onChange={(event) => {
                setNotifyRequested(false);
                setNotifyPhone(event.target.value);
              }}
              placeholder="+254 720 584 744"
              aria-label="Phone number for availability alerts"
              className="bg-white/80 text-center"
            />
            <button
              type="button"
              disabled={!canRequestNotify}
              onClick={() => setNotifyRequested(true)}
              className="inline-flex h-12 w-full items-center justify-center rounded-full border border-[rgba(42,39,34,0.1)] bg-[#12100f] px-6 text-sm uppercase tracking-[0.2em] text-white transition enabled:hover:-translate-y-0.5 enabled:hover:bg-[#1b1814] disabled:cursor-not-allowed disabled:bg-black/20 disabled:text-black/35"
            >
              Notify Me When Available
            </button>
            {notifyRequested ? (
              <p className="text-sm text-[var(--gold-strong)]">Alert request saved in this frontend preview for {notifyPhone.trim()}.</p>
            ) : (
              <p className="text-xs text-muted-foreground">Enter a phone number starting with +254 to unlock availability alerts.</p>
            )}
          </div>
        </div>
      ) : null}

      {visibleCount < filtered.length ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + 3)}
            className="rounded-full border border-[rgba(42,39,34,0.1)] bg-white/70 px-6 py-3 text-sm uppercase tracking-[0.2em] text-foreground transition hover:-translate-y-0.5"
          >
            Load More Listings
          </button>
        </div>
      ) : null}
    </div>
  );
}
