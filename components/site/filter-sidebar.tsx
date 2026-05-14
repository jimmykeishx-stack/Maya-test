"use client";

import { Search } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { bathroomOptions, bedroomOptions, propertyLocations, propertyTypes } from "@/data/properties";

type FilterValues = {
  search: string;
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

export function FilterSidebar({ values, onChange }: FilterSidebarProps) {
  return (
    <Card className="sticky top-28">
      <CardContent className="space-y-5">
        <div>
          <p className="quiet-label text-[var(--gold-strong)]">Refine Search</p>
          <h3 className="mt-3 font-display text-3xl">Find your ideal address.</h3>
        </div>
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
        <FilterSelect label="Location" value={values.location} onChange={(value) => onChange("location", value)} options={propertyLocations} />
        <FilterSelect label="Bedrooms" value={values.bedrooms} onChange={(value) => onChange("bedrooms", value)} options={bedroomOptions} />
        <FilterSelect label="Bathrooms" value={values.bathrooms} onChange={(value) => onChange("bathrooms", value)} options={bathroomOptions} />
        <FilterSelect label="Property Type" value={values.type} onChange={(value) => onChange("type", value)} options={propertyTypes} />
        <FilterSelect
          label="Price Range"
          value={values.priceRange}
          onChange={(value) => onChange("priceRange", value)}
          options={["All", "Under KES 40M", "KES 40M - 80M", "KES 80M - 150M", "Above KES 150M"]}
        />
      </CardContent>
    </Card>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[] | string[];
}) {
  return (
    <label className="grid gap-3">
      <span className="text-sm font-medium">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-[1.2rem] border border-[rgba(42,39,34,0.12)] bg-white/70 px-4 text-sm outline-none transition focus:border-[rgba(212,173,94,0.55)]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
