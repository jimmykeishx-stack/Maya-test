"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus } from "lucide-react";

import { LuxuryButton } from "@/components/site/luxury-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { EventGalleryItem, EventGalleryPayload, EventGalleryStatus } from "@/types/admin-event-gallery";

type EventGalleryFormProps = {
  mode: "create" | "edit";
  item?: EventGalleryItem;
};

async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("files", file);

  const response = await fetch("/api/admin/property-images", {
    method: "POST",
    body: formData
  });
  const body = (await response.json().catch(() => null)) as { error?: string; media?: Array<{ url: string }> } | null;

  if (!response.ok || !body?.media?.[0]?.url) {
    throw new Error(body?.error ?? "Image upload failed.");
  }

  return body.media[0].url;
}

export function EventGalleryForm({ mode, item }: EventGalleryFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(item?.title ?? "");
  const [category, setCategory] = useState(item?.category ?? "");
  const [excerpt, setExcerpt] = useState(item?.excerpt ?? "");
  const [imageUrl, setImageUrl] = useState(item?.imageUrl ?? "");
  const [status, setStatus] = useState<EventGalleryStatus>(item?.status ?? "draft");
  const [eventDate, setEventDate] = useState(item?.eventDate?.slice(0, 10) ?? "");
  const [sortOrder, setSortOrder] = useState(String(item?.sortOrder ?? 0));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState("");

  async function handleImageUpload(file?: File) {
    if (!file) return;
    setError("");
    setIsUploadingImage(true);

    try {
      const url = await uploadImage(file);
      setImageUrl(url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Image upload failed.");
    } finally {
      setIsUploadingImage(false);
    }
  }

  async function handleSubmit() {
    setError("");

    if (!imageUrl.trim()) {
      setError("An image is required. Upload one from your device or paste an image URL.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: EventGalleryPayload = {
        title,
        category,
        excerpt,
        imageUrl,
        status,
        eventDate: eventDate || null,
        sortOrder: Number(sortOrder || 0)
      };

      const res = await fetch(
        mode === "edit" && item
          ? `/api/admin/events-gallery/${item.id}`
          : "/api/admin/events-gallery",
        {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );
      const json = (await res.json().catch(() => null)) as { error?: string } | null;

      if (!res.ok) {
        throw new Error(json?.error ?? "Unable to save event/gallery item.");
      }

      router.push("/admin/events-gallery");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save event/gallery item.");
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
      <div className="grid gap-5 lg:grid-cols-2">
        <AdminField label="Title">
          <Input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Private Buyer Briefing"
          />
        </AdminField>
        <AdminField label="Category">
          <Input
            required
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Investor Event"
          />
        </AdminField>
      </div>

      <AdminField label="Excerpt">
        <Textarea
          required
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value)}
          placeholder="A short public description for this event, gallery entry, or milestone."
        />
      </AdminField>

      <div className="grid gap-5 md:grid-cols-3">
        <AdminField label="Status">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as EventGalleryStatus)}
            className="h-12 rounded-[1.2rem] border border-[rgba(42,39,34,0.12)] bg-white/70 px-4 text-sm outline-none"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </AdminField>
        <AdminField label="Event Date">
          <Input type="date" value={eventDate} onChange={(event) => setEventDate(event.target.value)} />
        </AdminField>
        <AdminField label="Sort Order">
          <Input
            min={0}
            type="number"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            placeholder="0"
          />
        </AdminField>
      </div>

      <div className="grid gap-3">
        <span className="text-sm font-medium text-foreground">Image</span>
        <div className="grid gap-3 rounded-[1.4rem] border border-black/6 bg-white/55 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-black/10 bg-white/80 px-5 py-3 text-sm uppercase tracking-[0.18em] transition hover:-translate-y-0.5">
              <ImagePlus className="size-4" />
              {isUploadingImage ? "Uploading..." : "Upload Image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isUploadingImage}
                onChange={(event) => void handleImageUpload(event.target.files?.[0])}
              />
            </label>
            <Input
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="Uploaded image URL appears here, or paste one manually"
            />
          </div>
          {imageUrl ? (
            <div className="overflow-hidden rounded-[1.2rem] border border-black/6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Event/gallery preview"
                className="aspect-[16/9] w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>
          ) : null}
        </div>
      </div>

      {error ? (
        <p className="rounded-[1.2rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <LuxuryButton type="submit" disabled={isSubmitting || isUploadingImage} size="lg" className="justify-center">
          {isSubmitting ? "Saving..." : mode === "edit" ? "Update Item" : "Create Item"}
        </LuxuryButton>
        <LuxuryButton href="/admin/events-gallery" variant="outline" size="lg" className="justify-center">
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