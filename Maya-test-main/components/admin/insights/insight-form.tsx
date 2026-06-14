"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { LuxuryButton } from "@/components/site/luxury-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { BlogPost, BlogPostPayload } from "@/types/admin-blog-post";

type InsightFormProps = {
  mode: "create" | "edit";
  post?: BlogPost;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseTags(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function InsightForm({ mode, post }: InsightFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [status, setStatus] = useState<"draft" | "published" | "archived">(post?.status ?? "draft");
  const [category, setCategory] = useState(post?.category ?? "");
  const [tagsText, setTagsText] = useState(post?.tags.join(", ") ?? "");
  const [featuredImageUrl, setFeaturedImageUrl] = useState(post?.featuredImageUrl ?? "");
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(post?.seoDescription ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const generatedSlug = useMemo(() => slugify(title), [title]);

  useEffect(() => {
    if (mode === "create" || !slug) {
      setSlug(generatedSlug);
    }
  }, [generatedSlug, mode, slug]);

  async function handleSubmit() {
    setError("");

    if (!featuredImageUrl.trim()) {
      setError("A featured image URL is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: BlogPostPayload = {
        title,
        slug,
        excerpt,
        body,
        status,
        category,
        tags: parseTags(tagsText),
        featuredImageUrl: featuredImageUrl || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        publishedAt: null
      };

      const res = await fetch(
        mode === "edit" && post
          ? `/api/admin/insights/${post.id}`
          : "/api/admin/insights",
        {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );
      const json = (await res.json().catch(() => null)) as { error?: string } | null;

      if (!res.ok) {
        throw new Error(json?.error ?? "Unable to save post.");
      }

      router.push("/admin/insights");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save post.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="grid gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit();
      }}
    >
      {/* Title & Slug */}
      <div className="grid gap-5 lg:grid-cols-2">
        <AdminField label="Title">
          <Input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="How Investors Abroad Can Reduce Risk Before Paying a Deposit"
          />
        </AdminField>
        <AdminField label="Slug">
          <Input
            required
            value={slug}
            onChange={(event) => setSlug(slugify(event.target.value))}
            placeholder="how-investors-abroad-reduce-risk"
          />
        </AdminField>
      </div>

      {/* Excerpt */}
      <AdminField label="Excerpt">
        <Textarea
          required
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value)}
          placeholder="A brief summary shown on the insight listing card and SEO meta description fallback."
        />
      </AdminField>

      {/* Status, Category, Tags */}
      <div className="grid gap-5 md:grid-cols-3">
        <AdminField label="Status">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as "draft" | "published" | "archived")}
            className="h-12 rounded-[1.2rem] border border-[rgba(42,39,34,0.12)] bg-white/70 px-4 text-sm outline-none"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </AdminField>
        <AdminField label="Category">
          <Input
            required
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Market Intelligence"
          />
        </AdminField>
        <AdminField label="Tags">
          <Input
            value={tagsText}
            onChange={(event) => setTagsText(event.target.value)}
            placeholder="investment, due diligence, Kenya"
          />
        </AdminField>
      </div>

      {/* Featured Image */}
      <AdminField label="Featured Image URL">
        <Input
          required
          type="url"
          value={featuredImageUrl}
          onChange={(event) => setFeaturedImageUrl(event.target.value)}
          placeholder="https://images.unsplash.com/photo-..."
        />
        {featuredImageUrl ? (
          <div className="mt-3 overflow-hidden rounded-[1.2rem] border border-black/6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featuredImageUrl}
              alt="Featured preview"
              className="aspect-[16/9] w-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        ) : null}
      </AdminField>

      {/* Body */}
      <AdminField label="Body Content">
        <Textarea
          required
          value={body}
          onChange={(event) => setBody(event.target.value)}
          className="min-h-80 font-mono text-sm"
          placeholder="Write the full post content here. Markdown is not yet supported — plain text only for now."
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {body.length} characters
        </p>
      </AdminField>

      {/* SEO */}
      <div className="rounded-[1.8rem] border border-black/6 bg-white/50 p-5">
        <p className="quiet-label text-[var(--gold-strong)]">SEO (Optional)</p>
        <div className="mt-4 grid gap-5">
          <AdminField label="SEO Title">
            <Input
              value={seoTitle}
              onChange={(event) => setSeoTitle(event.target.value)}
              placeholder="Custom title for search engines (defaults to post title if empty)"
            />
          </AdminField>
          <AdminField label="SEO Description">
            <Textarea
              value={seoDescription}
              onChange={(event) => setSeoDescription(event.target.value)}
              placeholder="Custom meta description for search engines (160 characters recommended)"
            />
          </AdminField>
        </div>
      </div>

      {error ? (
        <p className="rounded-[1.2rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <LuxuryButton type="submit" disabled={isSubmitting} size="lg" className="justify-center">
          {isSubmitting ? "Saving..." : mode === "edit" ? "Update Post" : "Create Post"}
        </LuxuryButton>
        <LuxuryButton href="/admin/insights" variant="outline" size="lg" className="justify-center">
          Cancel
        </LuxuryButton>
      </div>
    </form>
  );
}

function AdminField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-3">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}
