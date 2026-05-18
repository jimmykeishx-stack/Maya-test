import {
  getPropertyBySlug as getPropertyBySlugFromData,
  properties,
  type ListingType,
  type MarketSegment,
  type MarketStatus
} from "@/data/properties";

export function queryProperties(filters: {
  listingType?: ListingType;
  segment?: MarketSegment;
  marketStatus?: MarketStatus;
  search?: string;
}) {
  const normalizedSearch = filters.search?.trim().toLowerCase() ?? "";

  return properties.filter((property) => {
    const matchesListingType = !filters.listingType || property.listingType === filters.listingType;
    const matchesSegment = !filters.segment || property.segment === filters.segment;
    const matchesStatus = !filters.marketStatus || property.marketStatus === filters.marketStatus;
    const matchesSearch =
      normalizedSearch.length === 0 ||
      property.title.toLowerCase().includes(normalizedSearch) ||
      property.location.toLowerCase().includes(normalizedSearch) ||
      property.blurb.toLowerCase().includes(normalizedSearch);

    return matchesListingType && matchesSegment && matchesStatus && matchesSearch;
  });
}

export function getPropertyBySlug(slug: string) {
  return getPropertyBySlugFromData(slug);
}
