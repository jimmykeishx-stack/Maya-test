import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type {
  AdminProperty,
  AdminPropertyListResult,
  AdminPropertyPayload,
  AdminPropertyStatus
} from "@/types/admin-property";

type PropertyRow = Database["public"]["Tables"]["properties"]["Row"];
type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"];
type PropertyUpdate = Database["public"]["Tables"]["properties"]["Update"];

export const adminPropertySchema = z.object({
  title: z.string().trim().min(2, "Title is required."),
  slug: z.string().trim().optional(),
  description: z.string().trim().min(10, "Description is required."),
  propertyType: z.string().trim().min(2, "Property type is required."),
  listingType: z.enum(["sale", "rent"]),
  price: z.coerce.number().positive("Price must be greater than zero."),
  location: z.string().trim().min(2, "Location is required."),
  bedrooms: z.coerce.number().int().min(0).nullable().optional(),
  bathrooms: z.coerce.number().int().min(0).nullable().optional(),
  areaSqft: z.coerce.number().int().min(1, "Area is required.").nullable().optional(),
  amenities: z.array(z.string().trim().min(1)).default([]),
  featured: z.boolean().default(false),
  status: z.enum(["available", "rented", "sold"]),
  coverImage: z.string().trim().url("Cover image is required."),
  galleryImages: z.array(z.string().trim().url()).default([])
});

export type AdminPropertyInput = z.infer<typeof adminPropertySchema>;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeStatus(value: unknown): AdminPropertyStatus {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized === "sold") return "sold";
  if (normalized === "rented" || normalized === "rent") return "rented";
  return "available";
}

function normalizeStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  }

  if (typeof value === "string" && value.trim()) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function mapAdminProperty(row: PropertyRow): AdminProperty {
  const amenities = normalizeStringArray(row.amenities);

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    propertyType: row.property_type,
    listingType: row.listing_type,
    price: Number(row.price),
    location: row.location ?? "",
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    areaSqft: row.area_sqft,
    amenities,
    featured: row.featured,
    status: normalizeStatus(row.status),
    coverImage: row.cover_image,
    galleryImages: normalizeStringArray(row.gallery_images),
    createdAt: row.created_at ?? "",
    updatedAt: row.updated_at ?? "",
    createdBy: row.created_by ?? "",
  };
}

function storageObjectFromPublicUrl(url: string) {
  try {
    const parsed = new URL(url);
    const marker = "/storage/v1/object/public/";
    const markerIndex = parsed.pathname.indexOf(marker);
    if (markerIndex === -1) return null;
    const bucketAndPath = decodeURIComponent(parsed.pathname.slice(markerIndex + marker.length));
    const [bucket, ...pathParts] = bucketAndPath.split("/");
    const path = pathParts.join("/");
    if (!bucket || !path) return null;
    return { bucket, path };
  } catch {
    return null;
  }
}

function uniqueImages(coverImage: string | null | undefined, galleryImages: string[] | undefined) {
  return [...new Set([coverImage, ...(galleryImages ?? [])].filter((item): item is string => Boolean(item)))];
}

async function getClient() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  return supabase;
}

export async function createUniquePropertySlug(title: string, preferredSlug?: string, ignoreId?: string) {
  const supabase = await getClient();
  const baseSlug = slugify(preferredSlug || title) || `property-${Date.now()}`;
  let candidate = baseSlug;
  let suffix = 2;

  while (suffix < 100) {
    let query = supabase.from("properties").select("id").eq("slug", candidate);

    if (ignoreId) {
      query = query.neq("id", ignoreId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return candidate;
    }

    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;
}

export async function getAdminProperties({
  page = 1,
  pageSize = 12,
  search = ""
}: {
  page?: number;
  pageSize?: number;
  search?: string;
} = {}): Promise<AdminPropertyListResult> {
  const supabase = await getClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const trimmedSearch = search.trim();

  let query = supabase
    .from("properties")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (trimmedSearch) {
    const escaped = trimmedSearch.replaceAll("%", "\\%").replaceAll(",", " ");
    query = query.or(
      `title.ilike.%${escaped}%,slug.ilike.%${escaped}%,location.ilike.%${escaped}%,location.ilike.%${escaped}%,property_type.ilike.%${escaped}%`
    );
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const totalCount = count ?? 0;

  return {
    properties: ((data ?? []) as PropertyRow[]).map(mapAdminProperty),
    count: totalCount,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil(totalCount / pageSize))
  };
}

export async function getAdminPropertyById(id: string) {
  const supabase = await getClient();
  const { data, error } = await supabase.from("properties").select("*").eq("id", id).maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapAdminProperty(data as PropertyRow) : null;
}

export async function createAdminProperty(payload: AdminPropertyPayload, createdBy: string) {
  const supabase = await getClient();
  const parsed = adminPropertySchema.parse(payload);
  const slug = await createUniquePropertySlug(parsed.title, parsed.slug);
  const now = new Date().toISOString();
  const galleryImages = uniqueImages(parsed.coverImage, parsed.galleryImages);
  const primaryImage = parsed.coverImage || parsed.galleryImages?.[0] || "/placeholder.jpg";

  const insertPayload: PropertyInsert = {
    title: parsed.title,
    slug,
    description: parsed.description,
    property_type: parsed.propertyType,
    listing_type: parsed.listingType,
    status: parsed.status,
    price: parsed.price,
    location: parsed.location,
    bedrooms: parsed.bedrooms ?? null,
    bathrooms: parsed.bathrooms ?? null,
    area_sqft: parsed.areaSqft ?? null,
    amenities: parsed.amenities,
    featured: parsed.featured,
    cover_image: primaryImage,
    gallery_images: galleryImages,
    created_by: createdBy,
    created_at: now,
    updated_at: now
  };

  const { data, error } = await supabase.from("properties").insert(insertPayload).select("*").single();

  if (error) {
    throw new Error(error.message);
  }

  return mapAdminProperty(data as PropertyRow);
}

export async function updateAdminProperty(id: string, payload: AdminPropertyPayload) {
  const supabase = await getClient();
  const parsed = adminPropertySchema.parse(payload);
  const slug = await createUniquePropertySlug(parsed.title, parsed.slug, id);
  const galleryImages = uniqueImages(parsed.coverImage, parsed.galleryImages);
  const primaryImage = parsed.coverImage || parsed.galleryImages?.[0] || "/placeholder.jpg";

  const updatePayload: PropertyUpdate = {
    title: parsed.title,
    slug,
    description: parsed.description,
    property_type: parsed.propertyType,
    listing_type: parsed.listingType,
    status: parsed.status,
    price: parsed.price,
    location: parsed.location,
    bedrooms: parsed.bedrooms ?? null,
    bathrooms: parsed.bathrooms ?? null,
    area_sqft: parsed.areaSqft ?? null,
    amenities: parsed.amenities,
    featured: parsed.featured,
    cover_image: primaryImage,
    gallery_images: galleryImages,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase.from("properties").update(updatePayload).eq("id", id).select("*").single();

  if (error) {
    throw new Error(error.message);
  }

  return mapAdminProperty(data as PropertyRow);
}

export async function deleteAdminProperty(id: string) {
  const supabase = await getClient();
  const property = await getAdminPropertyById(id);

  if (!property) {
    return;
  }

  const storageObjects = uniqueImages(property.coverImage, property.galleryImages)
    .map(storageObjectFromPublicUrl)
    .filter((item): item is { bucket: string; path: string } => Boolean(item));
  const objectsByBucket = storageObjects.reduce((grouped, item) => {
    grouped.set(item.bucket, [...(grouped.get(item.bucket) ?? []), item.path]);
    return grouped;
  }, new Map<string, string[]>());

  for (const [bucket, paths] of objectsByBucket) {
    await supabase.storage.from(bucket).remove(paths);
  }

  const { error } = await supabase.from("properties").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
