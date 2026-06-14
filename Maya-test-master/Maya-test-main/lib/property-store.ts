import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  getFeaturedProperties as getFeaturedPropertiesFromSeed,
  properties as seedProperties,
  type ListingType,
  type MarketSegment,
  type MarketStatus,
  type Property
} from "@/data/properties";
import {
  getAffordableHousingProperties as getDynamicAffordableHousingProperties,
  getCommercialProperties as getDynamicCommercialProperties,
  getFeaturedProperties as getDynamicFeaturedProperties,
  getProperties as getDynamicProperties,
  getPropertyBySlug as getDynamicPropertyBySlug,
  getSimilarProperties as getDynamicSimilarProperties,
  queryProperties as queryDynamicProperties
} from "@/services/properties";

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "property-records.json");

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

async function ensurePropertyFile() {
  await mkdir(dataDir, { recursive: true });

  try {
    await readFile(filePath, "utf8");
  } catch {
    await writeFile(filePath, JSON.stringify(seedProperties, null, 2), "utf8");
  }
}

async function readLocalProperties() {
  await ensurePropertyFile();

  try {
    const raw = await readFile(filePath, "utf8");
    return (JSON.parse(raw) as Property[]).map(normalizeProperty);
  } catch {
    return seedProperties.map(normalizeProperty);
  }
}

async function saveProperties(records: Property[]) {
  await ensurePropertyFile();
  await writeFile(filePath, JSON.stringify(records.map(normalizeProperty), null, 2), "utf8");
}

export async function getProperties() {
  return getDynamicProperties();
}

export async function queryProperties(filters: {
  listingType?: ListingType;
  segment?: MarketSegment;
  marketStatus?: MarketStatus;
  search?: string;
}) {
  return queryDynamicProperties(filters);
}

export async function getPropertyBySlug(slug: string) {
  return getDynamicPropertyBySlug(slug);
}

export async function getFeaturedProperties() {
  return getDynamicFeaturedProperties();
}

export async function getAffordableHousingProperties() {
  return getDynamicAffordableHousingProperties();
}

export async function getCommercialProperties() {
  return getDynamicCommercialProperties();
}

export async function getSimilarProperties(slug: string, segment: MarketSegment, listingType: ListingType) {
  return getDynamicSimilarProperties(slug, segment, listingType);
}

export async function createProperty(property: Property) {
  const records = await readLocalProperties();
  const normalized = normalizeProperty(property);
  const nextRecords = [normalized, ...records.filter((record) => record.id !== property.id && record.slug !== property.slug)];
  await saveProperties(nextRecords);
  return normalized;
}

export async function updateProperty(id: string, updates: Property) {
  const records = await readLocalProperties();
  const normalized = normalizeProperty(updates);
  const nextRecords = records.map((property) => (property.id === id ? normalized : property));
  await saveProperties(nextRecords);
  return normalized;
}

export async function deleteProperty(id: string) {
  const records = await readLocalProperties();
  const nextRecords = records.filter((property) => property.id !== id);
  await saveProperties(nextRecords);
}

export async function getSeedPropertiesSnapshot() {
  return getFeaturedPropertiesFromSeed();
}
