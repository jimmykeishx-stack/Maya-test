import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  BlogPost,
  BlogPostListResult,
  BlogPostPayload,
  BlogPostStatus
} from "@/types/admin-blog-post";

type BlogPostRow = {
  id: string;
  author_profile_id: string | null;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  status: BlogPostStatus;
  category: string;
  tags: string[];
  featured_image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type BlogPostInsert = {
  author_profile_id?: string | null;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  status: BlogPostStatus;
  category: string;
  tags?: string[];
  featured_image_url?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

type BlogPostUpdate = Partial<BlogPostInsert>;

export const blogPostSchema = z.object({
  title: z.string().trim().min(2, "Title is required."),
  slug: z.string().trim().optional(),
  excerpt: z.string().trim().min(10, "Excerpt is required."),
  body: z.string().trim().min(20, "Body content is required."),
  status: z.enum(["draft", "published", "archived"]),
  category: z.string().trim().min(2, "Category is required."),
  tags: z.array(z.string().trim().min(1)).default([]),
  featuredImageUrl: z.string().url("Featured image must be a valid URL.").nullable().optional(),
  seoTitle: z.string().trim().nullable().optional(),
  seoDescription: z.string().trim().nullable().optional(),
  publishedAt: z.string().trim().nullable().optional()
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapBlogPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    status: row.status as BlogPostStatus,
    category: row.category,
    tags: Array.isArray(row.tags) ? row.tags : [],
    featuredImageUrl: row.featured_image_url,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    authorProfileId: row.author_profile_id
  };
}

async function getClient() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  return supabase;
}

export async function createUniqueBlogSlug(title: string, preferredSlug?: string, ignoreId?: string) {
  const supabase = await getClient();
  const baseSlug = slugify(preferredSlug || title) || `post-${Date.now()}`;
  let candidate = baseSlug;
  let suffix = 2;

  while (suffix < 100) {
    let query = supabase.from("blog_posts").select("id").eq("slug", candidate);

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

// ─── Public queries ───────────────────────────────────────────────────────────

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const supabase = await getClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as BlogPostRow[]).map(mapBlogPost);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await getClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapBlogPost(data as BlogPostRow) : null;
}

// ─── Admin queries ────────────────────────────────────────────────────────────

export async function getAdminBlogPosts({
  page = 1,
  pageSize = 12,
  search = ""
}: {
  page?: number;
  pageSize?: number;
  search?: string;
} = {}): Promise<BlogPostListResult> {
  const supabase = await getClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const trimmedSearch = search.trim();

  let query = supabase
    .from("blog_posts")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (trimmedSearch) {
    const escaped = trimmedSearch.replaceAll("%", "\\%");
    query = query.or(
      `title.ilike.%${escaped}%,slug.ilike.%${escaped}%,category.ilike.%${escaped}%`
    );
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const totalCount = count ?? 0;

  return {
    posts: ((data ?? []) as BlogPostRow[]).map(mapBlogPost),
    count: totalCount,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil(totalCount / pageSize))
  };
}

export async function getAdminBlogPostById(id: string): Promise<BlogPost | null> {
  const supabase = await getClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapBlogPost(data as BlogPostRow) : null;
}

export async function createAdminBlogPost(payload: BlogPostPayload, authorId: string) {
  const supabase = await getClient();
  const parsed = blogPostSchema.parse(payload);
  const slug = await createUniqueBlogSlug(parsed.title, parsed.slug);
  const now = new Date().toISOString();

  const insertPayload: BlogPostInsert = {
    author_profile_id: authorId,
    slug,
    title: parsed.title,
    excerpt: parsed.excerpt,
    body: parsed.body,
    status: parsed.status,
    category: parsed.category,
    tags: parsed.tags,
    featured_image_url: parsed.featuredImageUrl ?? null,
    seo_title: parsed.seoTitle ?? null,
    seo_description: parsed.seoDescription ?? null,
    published_at: parsed.status === "published" ? (parsed.publishedAt ?? now) : null,
    created_at: now,
    updated_at: now
  };

  const { data, error } = await supabase
    .from("blog_posts")
    .insert(insertPayload)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapBlogPost(data as BlogPostRow);
}

export async function updateAdminBlogPost(id: string, payload: BlogPostPayload) {
  const supabase = await getClient();
  const parsed = blogPostSchema.parse(payload);
  const slug = await createUniqueBlogSlug(parsed.title, parsed.slug, id);
  const now = new Date().toISOString();

  const updatePayload: BlogPostUpdate = {
    slug,
    title: parsed.title,
    excerpt: parsed.excerpt,
    body: parsed.body,
    status: parsed.status,
    category: parsed.category,
    tags: parsed.tags,
    featured_image_url: parsed.featuredImageUrl ?? null,
    seo_title: parsed.seoTitle ?? null,
    seo_description: parsed.seoDescription ?? null,
    published_at: parsed.status === "published" ? (parsed.publishedAt ?? now) : null,
    updated_at: now
  };

  const { data, error } = await supabase
    .from("blog_posts")
    .update(updatePayload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapBlogPost(data as BlogPostRow);
}

export async function deleteAdminBlogPost(id: string) {
  const supabase = await getClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
