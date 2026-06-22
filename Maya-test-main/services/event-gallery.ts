import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  EventGalleryItem,
  EventGalleryListResult,
  EventGalleryPayload,
  EventGalleryStatus
} from "@/types/admin-event-gallery";

type EventGalleryRow = {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  image_url: string;
  image_urls: string[] | null;
  status: EventGalleryStatus;
  event_date: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type EventGalleryInsert = {
  title: string;
  category: string;
  excerpt: string;
  image_url: string;
  image_urls?: string[];
  status?: EventGalleryStatus;
  event_date?: string | null;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
};

type EventGalleryUpdate = Partial<EventGalleryInsert>;

export const eventGallerySchema = z.object({
  title: z.string().trim().min(2, "Title is required."),
  category: z.string().trim().min(2, "Category is required."),
  excerpt: z.string().trim().min(10, "Excerpt is required."),
  imageUrl: z.string().url("Image must be a valid URL."),
  imageUrls: z.array(z.string().url()).max(10, "Upload up to 10 images.").default([]),
  status: z.enum(["draft", "published", "archived"]),
  eventDate: z.string().trim().nullable().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0)
});

function normalizeImageUrls(imageUrl: string, imageUrls?: string[] | null) {
  return [...new Set([imageUrl, ...(imageUrls ?? [])].filter(Boolean))].slice(0, 10);
}

function mapEventGalleryItem(row: EventGalleryRow): EventGalleryItem {
  const imageUrls = normalizeImageUrls(row.image_url, row.image_urls);

  return {
    id: row.id,
    title: row.title,
    category: row.category,
    excerpt: row.excerpt,
    imageUrl: row.image_url,
    imageUrls,
    status: row.status,
    eventDate: row.event_date,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function getClient() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  return supabase;
}

export async function getPublishedEventGalleryItems(limit?: number): Promise<EventGalleryItem[]> {
  const supabase = await getClient();

  let query = supabase
    .from("event_gallery_items")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("event_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as EventGalleryRow[]).map(mapEventGalleryItem);
}

export async function getAdminEventGalleryItems({
  page = 1,
  pageSize = 12,
  search = ""
}: {
  page?: number;
  pageSize?: number;
  search?: string;
} = {}): Promise<EventGalleryListResult> {
  const supabase = await getClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const trimmedSearch = search.trim();

  let query = supabase
    .from("event_gallery_items")
    .select("*", { count: "exact" })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (trimmedSearch) {
    const escaped = trimmedSearch.replaceAll("%", "\\%");
    query = query.or(`title.ilike.%${escaped}%,category.ilike.%${escaped}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const totalCount = count ?? 0;

  return {
    items: ((data ?? []) as EventGalleryRow[]).map(mapEventGalleryItem),
    count: totalCount,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil(totalCount / pageSize))
  };
}

export async function getAdminEventGalleryItemById(id: string): Promise<EventGalleryItem | null> {
  const supabase = await getClient();
  const { data, error } = await supabase
    .from("event_gallery_items")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapEventGalleryItem(data as EventGalleryRow) : null;
}

export async function createAdminEventGalleryItem(payload: EventGalleryPayload) {
  const supabase = await getClient();
  const parsed = eventGallerySchema.parse(payload);
  const now = new Date().toISOString();
  const imageUrls = normalizeImageUrls(parsed.imageUrl, parsed.imageUrls);

  const insertPayload: EventGalleryInsert = {
    title: parsed.title,
    category: parsed.category,
    excerpt: parsed.excerpt,
    image_url: imageUrls[0],
    image_urls: imageUrls,
    status: parsed.status,
    event_date: parsed.eventDate || null,
    sort_order: parsed.sortOrder,
    created_at: now,
    updated_at: now
  };

  const { data, error } = await supabase
    .from("event_gallery_items")
    .insert(insertPayload)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapEventGalleryItem(data as EventGalleryRow);
}

export async function updateAdminEventGalleryItem(id: string, payload: EventGalleryPayload) {
  const supabase = await getClient();
  const parsed = eventGallerySchema.parse(payload);
  const imageUrls = normalizeImageUrls(parsed.imageUrl, parsed.imageUrls);

  const updatePayload: EventGalleryUpdate = {
    title: parsed.title,
    category: parsed.category,
    excerpt: parsed.excerpt,
    image_url: imageUrls[0],
    image_urls: imageUrls,
    status: parsed.status,
    event_date: parsed.eventDate || null,
    sort_order: parsed.sortOrder,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from("event_gallery_items")
    .update(updatePayload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapEventGalleryItem(data as EventGalleryRow);
}

export async function deleteAdminEventGalleryItem(id: string) {
  const supabase = await getClient();
  const { error } = await supabase.from("event_gallery_items").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
