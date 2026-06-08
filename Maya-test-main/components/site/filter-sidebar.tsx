"use client";

import { Search } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  bathroomOptions,
  bedroomOptions,
  listingTypeOptions,
  propertyLocations,
  propertyTypes,
  segmentOptions
} from "@/data/properties";

export type FilterValues = {
  search: string;
  listingType: string;
  segment: string;
  availability: string;
  location: string;
  bedrooms: string;
  bathrooms: string;
  type: string;
  priceRange: string;
};

type FilterSidebarProps = {
  values: FilterValues;
  onChange: (field: keyof FilterValues, value: string) => void;
};

type FilterOption = {
  value: string;
  label: string;
};

const saleStatusOptions: FilterOption[] = [
  { value: "available", label: "Available" },
  { value: "sold", label: "Sold Out" },
  { value: "archived", label: "Archived" },
  { value: "all", label: "All Sale Statuses" }
];

const rentStatusOptions: FilterOption[] = [
  { value: "available", label: "Available" },
  { value: "rented", label: "Leased" },
  { value: "archived", label: "Archived" },
  { value: "all", label: "All Rental Statuses" }
];

const mixedStatusOptions: FilterOption[] = [
  { value: "available", label: "Available" },
  { value: "sold", label: "Sold Out" },
  { value: "rented", label: "Leased" },
  { value: "archived", label: "Archived" },
  { value: "all", label: "All Statuses" }
];

const salePriceOptions: FilterOption[] = [
  { value: "all", label: "All Sale Budgets" },
  { value: "sale-under-40m", label: "Under KES 40M" },
  { value: "sale-40m-80m", label: "KES 40M - 80M" },
  { value: "sale-80m-150m", label: "KES 80M - 150M" },
  { value: "sale-above-150m", label: "Above KES 150M" }
];

const rentPriceOptions: FilterOption[] = [
  { value: "all", label: "All Rental Budgets" },
  { value: "rent-0-100k", label: "0 - 100K" },
  { value: "rent-100k-250k", label: "100K - 250K" },
  { value: "rent-250k-500k", label: "250K - 500K" },
  { value: "rent-500k-1m", label: "500K - 1,000,000" },
  { value: "rent-above-1m", label: "1,000,000+" }
];

export function FilterSidebar({ values, onChange }: FilterSidebarProps) {
  const statusOptions = values.listingType === "Sale" ? saleStatusOptions : values.listingType === "Rent" ? rentStatusOptions : mixedStatusOptions;
  const priceOptions = values.listingType === "Rent" ? rentPriceOptions : salePriceOptions;

  return (
    <Card>
      <CardContent className="space-y-5 p-4 sm:p-6">
        <div className="space-y-2">
          <p className="quiet-label text-[var(--gold-strong)]">Refine Search</p>
          <h3 className="mt-3 font-display text-2xl sm:text-3xl">Find your ideal address.</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.4fr_repeat(8,minmax(0,1fr))] xl:items-end">
          <label className="grid gap-3">
            <span className="text-sm font-medium">Search</span>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={values.search}
                onChange={(event) => onChange("search", event.target.value)}
                placeholder="Westlands penthouse"
                className="pl-11"
              />
            </div>
          </label>
          <FilterSelect label="Sale / Rent" value={values.listingType} onChange={(value) => onChange("listingType", value)} options={listingTypeOptions} />
          <FilterSelect label="Category" value={values.segment} onChange={(value) => onChange("segment", value)} options={segmentOptions} />
          <FilterSelect
            label="Status"
            value={values.availability}
            onChange={(value) => onChange("availability", value)}
            options={statusOptions}
            helperText="Status labels adapt to sale or rent so you only see outcomes relevant to the market you are browsing."
          />
          <FilterSelect label="Location" value={values.location} onChange={(value) => onChange("location", value)} options={propertyLocations} />
          <FilterSelect label="Bedrooms" value={values.bedrooms} onChange={(value) => onChange("bedrooms", value)} options={bedroomOptions} />
          <FilterSelect label="Bathrooms" value={values.bathrooms} onChange={(value) => onChange("bathrooms", value)} options={bathroomOptions} />
          <FilterSelect label="Property Type" value={values.type} onChange={(value) => onChange("type", value)} options={propertyTypes} />
          <FilterSelect
            label="Price Range"
            value={values.priceRange}
            onChange={(value) => onChange("priceRange", value)}
            options={priceOptions}
            helperText={
              values.listingType === "Rent"
                ? "Monthly rental brackets appear automatically when rent is selected."
                : values.listingType === "Sale"
                  ? "Purchase price bands stay focused on capital values for sale listings."
                  : "Choose Sale or Rent to switch between purchase and rental price bands."
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  helperText
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[] | string[] | FilterOption[];
  helperText?: string;
}) {
  const normalizedOptions = options.map((option) => (typeof option === "string" ? { value: option, label: option } : option));

  return (
    <label className="grid gap-3">
      <span className="text-sm font-medium">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-[1.2rem] border border-[rgba(42,39,34,0.12)] bg-white/70 px-4 text-sm outline-none transition focus:border-[rgba(212,173,94,0.55)]"
      >
        {normalizedOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helperText ? <span className="text-xs leading-5 text-muted-foreground">{helperText}</span> : null}
    </label>
  );
}
