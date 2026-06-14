import { properties as seedProperties, type Property } from "@/data/properties";
import { getProperties, getPropertyBySlug, queryProperties } from "@/lib/property-store";

type PropertyListQuery = {
  listingType?: "sale" | "rent";
  segment?: "residential" | "commercial" | "affordable-housing";
  Status?: "available" | "sold" | "rented" | "archived";
  search?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  minBathrooms?: number;
  sort: "featured" | "price-desc" | "price-asc" | "size-desc";
  page: number;
  pageSize: number;
};

function applyAdditionalFilters(property: Property, query: PropertyListQuery) {
  const matchesLocation = !query.location || property.location === query.location;
  const matchesMinPrice = !query.minPrice || property.price >= query.minPrice;
  const matchesMaxPrice = !query.maxPrice || property.price <= query.maxPrice;
  const matchesMinBedrooms = !query.minBedrooms || (property.bedrooms ?? 0) >= query.minBedrooms;
  const matchesMinBathrooms = !query.minBathrooms || (property.bathrooms ?? 0) >= query.minBathrooms;

  return matchesLocation && matchesMinPrice && matchesMaxPrice && matchesMinBedrooms && matchesMinBathrooms;
}

function sortProperties(items: Property[], sort: PropertyListQuery["sort"]) {
  if (sort === "price-desc") return [...items].sort((a, b) => b.price - a.price);
  if (sort === "price-asc") return [...items].sort((a, b) => a.price - b.price);
  if (sort === "size-desc") return [...items].sort((a, b) => b.sqft - a.sqft);
  return [...items].sort((a, b) => seedProperties.findIndex((item) => item.id === a.id) - seedProperties.findIndex((item) => item.id === b.id));
}

export async function listProperties(query: PropertyListQuery) {
  const base = await queryProperties({
    listingType: query.listingType,
    segment: query.segment,
    marketStatus: query.Status,
    search: query.search
  });

  const filtered = sortProperties(base.filter((property) => applyAdditionalFilters(property, query)), query.sort);
  const start = (query.page - 1) * query.pageSize;
  const paginated = filtered.slice(start, start + query.pageSize);

  return {
    records: paginated,
    total: filtered.length,
    page: query.page,
    pageSize: query.pageSize,
    totalPages: Math.max(1, Math.ceil(filtered.length / query.pageSize))
  };
}

export async function getPropertyDetails(slug: string) {
  return getPropertyBySlug(slug);
}

export async function getSearchSuggestions(term: string) {
  const trimmed = term.trim().toLowerCase();
  if (!trimmed) return [];

  const items = await getProperties();
  const suggestions = new Set<string>();

  items.forEach((property) => {
    [property.title, property.location, property.type].forEach((candidate) => {
      if (candidate.toLowerCase().includes(trimmed)) {
        suggestions.add(candidate);
      }
    });
  });

  return [...suggestions].slice(0, 8);
}
