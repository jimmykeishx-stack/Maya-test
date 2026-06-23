"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Star, Trash2 } from "lucide-react";

import { LuxuryButton } from "@/components/site/luxury-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { EventGalleryItem, EventGalleryPayload, EventGalleryStatus } from "@/types/admin-event-gallery";

const MAX_GALLERY_IMAGES = 10;
const ACCEPTED_IMAGE_TYPES = "image/*,.heic,.heif,.avif,.webp,.jpg,.jpeg,.png,.gif,.bmp,.tif,.tiff,.svg";

type GalleryImage = {
  url: string;
  source: "uploaded" | "manual";
};

function uniqueUrls(urls: string[]) {
  return Array.from(new Set(urls.map((url) => url.trim()).filter(Boolean))).slice(0, MAX_GALLERY_IMAGES);
}

function replaceExtension(name: string, extension: string) {
  return name.replace(/\.[^.]+$/, extension);
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Image could not be read."));
    reader.readAsDataURL(file);
  });
}

async function fileToGalleryImageUrl(file: File) {
  if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") {
    return readFileAsDataUrl(file);
  }

  let bitmap: ImageBitmap;

  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return readFileAsDataUrl(file);
  }

  const longestSide = Math.max(bitmap.width, bitmap.height);
  const scale = longestSide > 1800 ? 1800 / longestSide : 1;
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    bitmap.close();
    return readFileAsDataUrl(file);
  }

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const outputType = file.type === "image/webp" ? "image/webp" : "image/jpeg";
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, outputType, 0.78);
  });

  if (!blob) {
    return readFileAsDataUrl(file);
  }

  return readFileAsDataUrl(
    new File([blob], replaceExtension(file.name, outputType === "image/webp" ? ".webp" : ".jpg"), {
      type: outputType,
      lastModified: file.lastModified
    })
  );
}

export function EventGalleryForm({ mode, item }: EventGalleryFormProps) {
  const router = useRouter();
  const initialImageUrls = useMemo(
    () => uniqueUrls(item?.imageUrls?.length ? item.imageUrls : item?.imageUrl ? [item.imageUrl] : []),
    [item]
  );
  const [title, setTitle] = useState(item?.title ?? "");
  const [category, setCategory] = useState(item?.category ?? "");
  const [excerpt, setExcerpt] = useState(item?.excerpt ?? "");
  const [imageUrls, setImageUrls] = useState<GalleryImage[]>(initialImageUrls.map((url) => ({ url, source: "uploaded" })));
  const [manualImageUrl, setManualImageUrl] = useState("");
  const [status, setStatus] = useState<EventGalleryStatus>(item?.status ?? "draft");
  const [eventDate, setEventDate] = useState(item?.eventDate?.slice(0, 10) ?? "");
  const [sortOrder, setSortOrder] = useState(String(item?.sortOrder ?? 0));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState("");

  const coverUrl = imageUrls[0]?.url ?? "";

  async function handleImageUpload(fileList?: FileList | null) {
    const remainingSlots = MAX_GALLERY_IMAGES - imageUrls.length;
    const files = Array.from(fileList ?? []).slice(0, remainingSlots);

    if (!files.length) {
      if ((fileList?.length ?? 0) > 0 && remainingSlots <= 0) {
        setError(`Upload up to ${MAX_GALLERY_IMAGES} images per event/gallery item.`);
      }
      return;
    }

    setError("");
    setIsUploadingImage(true);

    try {
      const urls = await Promise.all(files.map(fileToGalleryImageUrl));
      setImageUrls((current) => uniqueUrls([...current.map((image) => image.url), ...urls]).map((url) => ({ url, source: "uploaded" })));

      if ((fileList?.length ?? 0) > files.length) {
        setError(`Only ${remainingSlots} more image${remainingSlots === 1 ? "" : "s"} could be added. Maximum is ${MAX_GALLERY_IMAGES}.`);
      }
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Image upload failed.");
    } finally {
      setIsUploadingImage(false);
    }
  }

  function addManualImageUrl() {
    const nextUrl = manualImageUrl.trim();

    if (!nextUrl) return;
    if (imageUrls.length >= MAX_GALLERY_IMAGES) {
      setError(`Upload up to ${MAX_GALLERY_IMAGES} images per event/gallery item.`);
      return;
    }

    setError("");
    setImageUrls((current) => uniqueUrls([...current.map((image) => image.url), nextUrl]).map((url) => ({ url, source: url === nextUrl ? "manual" : "uploaded" })));
    setManualImageUrl("");
  }

  function removeImage(url: string) {
    setImageUrls((current) => current.filter((image) => image.url !== url));
  }

  function makeCover(url: string) {
    setImageUrls((current) => {
      const selected = current.find((image) => image.url === url);
      if (!selected) return current;
      return [selected, ...current.filter((image) => image.url !== url)];
    });
  }

  async function handleSubmit() {
    setError("");

    const galleryUrls = uniqueUrls(imageUrls.map((image) => image.url));

    if (!galleryUrls.length) {
      setError("At least one image is required. Upload from your device or paste an image URL.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: EventGalleryPayload = {
        title,
        category,
        excerpt,
        imageUrl: galleryUrls[0],
        imageUrls: galleryUrls,
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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-medium text-foreground">Images</span>
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{imageUrls.length} / {MAX_GALLERY_IMAGES} selected</span>
        </div>
        <div className="grid gap-4 rounded-[1.4rem] border border-black/6 bg-white/55 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-black/10 bg-white/80 px-5 py-3 text-sm uppercase tracking-[0.18em] transition hover:-translate-y-0.5">
              <ImagePlus className="size-4" />
              {isUploadingImage ? "Preparing..." : "Select Images"}
              <input
                type="file"
                accept={ACCEPTED_IMAGE_TYPES}
                multiple
                className="hidden"
                disabled={isUploadingImage || imageUrls.length >= MAX_GALLERY_IMAGES}
                onChange={(event) => {
                  void handleImageUpload(event.target.files);
                  event.currentTarget.value = "";
                }}
              />
            </label>
            <div className="grid flex-1 gap-3 sm:grid-cols-[1fr_auto]">
              <Input
                type="url"
                value={manualImageUrl}
                onChange={(event) => setManualImageUrl(event.target.value)}
                placeholder="Paste an image URL"
              />
              <button
                type="button"
                onClick={addManualImageUrl}
                disabled={!manualImageUrl.trim() || imageUrls.length >= MAX_GALLERY_IMAGES}
                className="rounded-full border border-black/10 bg-white/80 px-5 py-3 text-xs uppercase tracking-[0.16em] disabled:opacity-45"
              >
                Add URL
              </button>
            </div>
          </div>

          {coverUrl ? (
            <div className="overflow-hidden rounded-[1.2rem] border border-black/6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverUrl}
                alt="Event/gallery cover preview"
                className="aspect-[16/9] w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>
          ) : null}

          {imageUrls.length ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {imageUrls.map((image, index) => (
                <article key={image.url} className="overflow-hidden rounded-[1rem] border border-black/6 bg-white/70">
                  <div className="relative aspect-[4/3] bg-black/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.url} alt={`Gallery image ${index + 1}`} className="h-full w-full object-cover" />
                    {index === 0 ? (
                      <span className="absolute left-2 top-2 rounded-full bg-[#1c1712]/85 px-3 py-1 text-[0.65rem] uppercase tracking-[0.14em] text-white">
                        Cover
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2 p-3">
                    <button
                      type="button"
                      onClick={() => makeCover(image.url)}
                      disabled={index === 0}
                      className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-white px-3 py-2 text-[0.7rem] uppercase tracking-[0.14em] disabled:opacity-45"
                    >
                      <Star className="size-3" />
                      Cover
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(image.url)}
                      className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-[0.7rem] uppercase tracking-[0.14em] text-red-700"
                    >
                      <Trash2 className="size-3" />
                      Remove
                    </button>
                  </div>
                </article>
              ))}
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

type EventGalleryFormProps = {
  mode: "create" | "edit";
  item?: EventGalleryItem;
};

function AdminField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-3">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}
