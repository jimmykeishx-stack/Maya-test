import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  getPropertyBySlug as getPropertyBySlugFromSeed,
  getFeaturedProperties as getFeaturedPropertiesFromSeed,
  properties as seedProperties,
  type ListingType,
  type MarketSegment,
  type MarketStatus,
  type Property
} from "@/data/properties";

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "property-records.json");

async function ensurePropertyFile() {
  await mkdir(dataDir, { recursive: true });

  try {
    await readFile(filePath, "utf8");
  } catch {
    await writeFile(filePath, JSON.stringify(seedProperties, null, 2), "utf8");
  }
}

export async function getProperties() {
  await ensurePropertyFile();

  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as Property[];
  } catch {
    return seedProperties;
  }
}

async function saveProperties(records: Property[]) {
  await ensurePropertyFile();
  await writeFile(filePath, JSON.stringify(records, null, 2), "utf8");
}

export async function queryProperties(filters: {
  listingType?: ListingType;
  segment?: MarketSegment;
  marketStatus?: MarketStatus;
  search?: string;
}) {
  const normalizedSearch = filters.search?.trim().toLowerCase() ?? "";
  const records = await getProperties();

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

export async function getPropertyBySlug(slug: string) {
  const records = await getProperties();
  return records.find((property) => property.slug === slug) ?? getPropertyBySlugFromSeed(slug);
}

export async function getFeaturedProperties() {
  const records = await getProperties();
  return records.filter((property) => property.marketStatus === "available").slice(0, 6);
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

export async function createProperty(property: Property) {
  const records = await getProperties();
  const nextRecords = [property, ...records.filter((record) => record.id !== property.id && record.slug !== property.slug)];
  await saveProperties(nextRecords);
  return property;
}

export async function updateProperty(id: string, updates: Property) {
  const records = await getProperties();
  const nextRecords = records.map((property) => (property.id === id ? updates : property));
  await saveProperties(nextRecords);
  return updates;
}

export async function deleteProperty(id: string) {
  const records = await getProperties();
  const nextRecords = records.filter((property) => property.id !== id);
  await saveProperties(nextRecords);
}

export async function getSeedPropertiesSnapshot() {
  return getFeaturedPropertiesFromSeed();
}
