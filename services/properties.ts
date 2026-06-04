import {
  properties as fallbackProperties,
  type ListingType,
  type MarketSegment,
  type MarketStatus,
  type MandateType,
  type Property,
  type PropertyMetric
} from "@/data/properties";
import { supabase } from "@/lib/supabase";

type PropertyFilters = {
  listingType?: ListingType;
  segment?: MarketSegment;
  marketStatus?: MarketStatus;
  search?: string;
};

type PropertyRecord = Record<string, unknown> & {
  id: string;
  slug: string;
  title: string;
  cover_image?: string | null;
  gallery_images?: string[] | null;
};

const fallbackCoverImage = "/placeholder.jpg";
const SUPABASE_TIMEOUT_MS = 4500;

function createAbortSignal() {
  if (typeof AbortSignal === "undefined" || typeof AbortSignal.timeout !== "function") {
    return undefined;
  }

  return AbortSignal.timeout(SUPABASE_TIMEOUT_MS);
}

function logSupabaseWarning(scope: string, error: { message?: string } | null) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[Maya Haven] ${scope}.`, error?.message ?? "Unknown Supabase error");
  }
}

function normalizeProperty(property: Property): Property {
  return {
    ...property,
    priceSuffix: property.priceSuffix?.trim().toLowerCase() === "asking" ? undefined : property.priceSuffix,
    metrics: property.metrics.map((metric) => ({
      ...metric,
      label: metric.label === "Footprint" ? "Size" : metric.label
    }))
  };
}

function fallbackRecords() {
  return fallbackProperties.map(normalizeProperty);
}

function readString(row: Record<string, unknown>, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return fallback;
}

function readNumber(row: Record<string, unknown>, keys: string[], fallback = 0) {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Number(value);
  }

  return fallback;
}

function readNullableNumber(row: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (value === null) return null;
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Number(value);
  }

  return null;
}

function readStringArray(row: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = row[key];

    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    }

    if (typeof value === "string" && value.trim()) {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
}

function normalizeListingType(value: unknown): ListingType {
  return String(value ?? "").toLowerCase() === "rent" ? "rent" : "sale";
}

function normalizeSegment(row: Record<string, unknown>): MarketSegment {
  const raw = readString(row, ["segment", "category", "market_segment"]).toLowerCase().replace(/_/g, "-");
  if (raw === "commercial") return "commercial";
  if (raw === "affordable-housing") return "affordable-housing";

  const type = readString(row, ["property_type", "type"]).toLowerCase();
  if (type.includes("office") || type.includes("retail") || type.includes("mixed-use")) return "commercial";

  return "residential";
}

function normalizeMarketStatus(row: Record<string, unknown>): MarketStatus {
  const raw = readString(row, ["market_status", "status", "availability"], "available").toLowerCase();
  if (raw.includes("sold")) return "sold";
  if (raw.includes("rent") || raw.includes("lease") || raw.includes("leased")) return "rented";
  if (raw.includes("archive")) return "archived";
  return "available";
}

function normalizeMandate(value: unknown): MandateType {
  return String(value ?? "").toLowerCase() === "exclusive" ? "exclusive" : "open";
}

function buildMetrics(row: Record<string, unknown>) {
  const storedMetrics = row.metrics;

  if (Array.isArray(storedMetrics)) {
    const metrics = storedMetrics
      .map((item) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) return null;
        const label = "label" in item ? item.label : null;
        const value = "value" in item ? item.value : null;
        if (typeof label !== "string" || typeof value !== "string") return null;
        return { label: label === "Footprint" ? "Size" : label, value };
      })
      .filter((metric): metric is PropertyMetric => Boolean(metric));

    if (metrics.length) return metrics;
  }

  const bedrooms = readNullableNumber(row, ["bedrooms"]);
  const bathrooms = readNullableNumber(row, ["bathrooms"]);
  const parkingSpaces = readNullableNumber(row, ["parking_spaces"]);
  const sizeSqft = readNullableNumber(row, ["area_sqft", "size_sqft", "sqft"]);
  const metrics: PropertyMetric[] = [];

  if (bedrooms !== null) metrics.push({ label: "Bedrooms", value: String(bedrooms) });
  if (bathrooms !== null) metrics.push({ label: "Bathrooms", value: String(bathrooms) });
  if (bedrooms === null && parkingSpaces !== null) metrics.push({ label: "Parking Bays", value: String(parkingSpaces) });
  if (sizeSqft !== null) metrics.push({ label: "Size", value: `${sizeSqft.toLocaleString("en-KE")} sqft` });

  return metrics.length ? metrics : [{ label: "Size", value: "Available on request" }];
}

function mapProperty(row: PropertyRecord): Property {
  const listingType = normalizeListingType(row.listing_type);
  const location = readString(row, ["location_label", "area", "city", "location"], "Westlands");
  const description = readString(row, ["description"], "A curated Maya Haven property with details available on request.");
  const galleryFromRow = readStringArray(row, ["gallery_images", "gallery", "images"]);
  const primaryImage = row.cover_image || row.gallery_images?.[0] || fallbackCoverImage;
  const gallery = [...new Set([primaryImage, ...galleryFromRow].filter(Boolean))];
  const amenities = readStringArray(row, ["amenities"]);
  const propertyType = readString(row, ["property_type", "type"], "Residence");
  const priceSuffix = readString(row, ["price_suffix"], listingType === "rent" ? "per month" : "");
  const size = readNumber(row, ["area_sqft", "size_sqft", "sqft"]);
  const features = readStringArray(row, ["features"]);

  return normalizeProperty({
    id: row.id,
    slug: row.slug,
    title: row.title,
    location: location as Property["location"],
    type: propertyType as Property["type"],
    listingType,
    segment: normalizeSegment(row),
    marketStatus: normalizeMarketStatus(row),
    mandateType: normalizeMandate(row.mandate_type),
    price: readNumber(row, ["price"]),
    priceSuffix: priceSuffix || undefined,
    bedrooms: readNullableNumber(row, ["bedrooms"]),
    bathrooms: readNullableNumber(row, ["bathrooms"]),
    sqft: size,
    highlight: readString(row, ["highlight"], row.title),
    blurb: readString(row, ["blurb", "short_description"], description),
    description,
    metrics: buildMetrics(row),
    coverImage: primaryImage,
    gallery,
    amenities,
    features: features.length
      ? features
      : [
          `${propertyType} listed for ${listingType === "sale" ? "sale" : "rent"}`,
          `${size.toLocaleString("en-KE")} sqft`,
          `Current status: ${normalizeMarketStatus(row)}`
        ],
    agentNote: readString(row, ["agent_note"], "A Maya Haven advisor can share current availability, viewing windows, and next steps."),
    youtubeVideoId: readString(row, ["youtube_video_id"]) || undefined
  });
}

async function hydrateProperties(rows: PropertyRecord[]) {
  return rows.map(mapProperty);
}

async function fetchRows(options: { featuredOnly?: boolean; limit?: number; slug?: string } = {}) {
  let query = supabase.from("properties").select("*");

  if (options.slug) {
    query = query.eq("slug", options.slug);
  }

  if (options.featuredOnly) {
    query = query.eq("featured", true);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  let request = query.order("created_at", { ascending: false });
  const signal = createAbortSignal();
  if (signal) request = request.abortSignal(signal);

  try {
    const { data, error } = await request;

    if (error) {
      logSupabaseWarning("Properties could not be loaded from Supabase", error);
      return null;
    }

    return (data ?? []) as PropertyRecord[];
  } catch (error) {
    logSupabaseWarning("Properties request timed out", error instanceof Error ? error : null);
    return null;
  }
}

export async function getProperties(): Promise<Property[]> {
  const rows = await fetchRows();
  if (!rows) return fallbackRecords();
  return hydrateProperties(rows);
}

export async function getFeaturedProperties(): Promise<Property[]> {
  const rows = await fetchRows({ featuredOnly: true, limit: 6 });
  if (!rows) {
    return fallbackRecords()
      .filter((property) => property.marketStatus === "available")
      .slice(0, 6);
  }

  return hydrateProperties(rows);
}

export async function getPropertyBySlug(slug: string): Promise<Property | undefined> {
  const rows = await fetchRows({ slug });

  if (!rows) {
    return fallbackRecords().find((property) => property.slug === slug);
  }

  const [property] = await hydrateProperties(rows);
  return property;
}

export async function queryProperties(filters: PropertyFilters): Promise<Property[]> {
  const records = await getProperties();
  const normalizedSearch = filters.search?.trim().toLowerCase() ?? "";

  return records.filter((property) => {
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

export async function getAffordableHousingProperties() {
  const records = await getProperties();
  return records.filter((property) => property.segment === "affordable-housing" && property.marketStatus === "available");
}

export async function getCommercialProperties() {
  const records = await getProperties();
  return records.filter((property) => property.segment === "commercial" && property.marketStatus !== "archived");
}

export async function getSimilarProperties(slug: string, segment: MarketSegment, listingType: ListingType) {
  const records = await getProperties();
  return records
    .filter(
      (property) =>
        property.slug !== slug &&
        property.segment === segment &&
        property.listingType === listingType &&
        property.marketStatus !== "archived"
    )
    .slice(0, 3);
}
