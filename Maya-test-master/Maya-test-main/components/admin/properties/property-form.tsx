"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Trash2 } from "lucide-react";

import { LuxuryButton } from "@/components/site/luxury-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AdminProperty, AdminPropertyPayload } from "@/types/admin-property";

type ImageDraft = {
  id: string;
  file?: File;
  previewUrl: string;
  persistedUrl?: string;
};

type PropertyFormProps = {
  mode: "create" | "edit";
  property?: AdminProperty;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function imageDraftFromUrl(url: string): ImageDraft {
  return {
    id: url,
    previewUrl: url,
    persistedUrl: url
  };
}

function parseAmenities(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function PropertyForm({ mode, property }: PropertyFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(property?.title ?? "");
  const [slug, setSlug] = useState(property?.slug ?? "");
  const [description, setDescription] = useState(property?.description ?? "");
  const [propertyType, setPropertyType] = useState(property?.propertyType ?? "Apartment");
  const [listingType, setListingType] = useState<"sale" | "rent">(property?.listingType ?? "sale");
  const [price, setPrice] = useState(property ? String(property.price) : "");
  const [location, setLocation] = useState(property?.location ?? "");
  const [bedrooms, setBedrooms] = useState(property?.bedrooms === null || property?.bedrooms === undefined ? "" : String(property.bedrooms));
  const [bathrooms, setBathrooms] = useState(property?.bathrooms === null || property?.bathrooms === undefined ? "" : String(property.bathrooms));
  const [areaSqft, setAreaSqft] = useState(property?.areaSqft === null || property?.areaSqft === undefined ? "" : String(property.areaSqft));
  const [amenitiesText, setAmenitiesText] = useState(property?.amenities.join(", ") ?? "");
  const [featured, setFeatured] = useState(Boolean(property?.featured));
  const [status, setStatus] = useState<"available" | "rented" | "sold">(property?.status ?? "available");
  const [coverImage, setCoverImage] = useState<ImageDraft | null>(property?.coverImage ? imageDraftFromUrl(property.coverImage) : null);
  const [galleryImages, setGalleryImages] = useState<ImageDraft[]>((property?.galleryImages ?? []).map(imageDraftFromUrl));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const generatedSlug = useMemo(() => slugify(title), [title]);

  useEffect(() => {
    if (mode === "create" || !slug) {
      setSlug(generatedSlug);
    }
  }, [generatedSlug, mode, slug]);

  function setCoverFile(file?: File) {
    if (!file) return;
    if (coverImage?.file) URL.revokeObjectURL(coverImage.previewUrl);
    setCoverImage({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file)
    });
  }

  function addGalleryFiles(files: File[]) {
    const drafts = files
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file)
      }));

    setGalleryImages((current) => [...current, ...drafts]);
  }

  function removeGalleryImage(id: string) {
    setGalleryImages((current) => {
      const target = current.find((item) => item.id === id);
      if (target?.file) URL.revokeObjectURL(target.previewUrl);
      return current.filter((item) => item.id !== id);
    });
  }

  async function uploadFiles(files: File[]) {
    if (!files.length) return [];

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await fetch("/api/admin/property-images", {
      method: "POST",
      body: formData
    });
    const body = (await response.json().catch(() => null)) as { error?: string; media?: Array<{ url: string }> } | null;

    if (!response.ok || !body?.media) {
      throw new Error(body?.error ?? "Image upload failed.");
    }

    return body.media.map((item) => item.url);
  }

  async function handleSubmit() {
    setError("");

    if (!coverImage) {
      setError("A cover image is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const [uploadedCoverUrl] = coverImage.file ? await uploadFiles([coverImage.file]) : [coverImage.persistedUrl ?? coverImage.previewUrl];
      const newGalleryFiles = galleryImages.filter((item) => item.file).map((item) => item.file!);
      const uploadedGalleryUrls = await uploadFiles(newGalleryFiles);
      const persistedGalleryUrls = galleryImages.filter((item) => !item.file).map((item) => item.persistedUrl ?? item.previewUrl);
      const galleryUrls = [...new Set([uploadedCoverUrl, ...persistedGalleryUrls, ...uploadedGalleryUrls].filter(Boolean))];

      const payload: AdminPropertyPayload = {
        title,
        slug,
        description,
        propertyType,
        listingType,
        price: Number(price),
        location,
        bedrooms: bedrooms ? Number(bedrooms) : null,
        bathrooms: bathrooms ? Number(bathrooms) : null,
        areaSqft: areaSqft ? Number(areaSqft) : null,
        amenities: parseAmenities(amenitiesText),
        featured,
        status,
        coverImage: uploadedCoverUrl,
        galleryImages: galleryUrls
      };

      const response = await fetch(mode === "edit" && property ? `/api/admin/properties/${property.id}` : "/api/admin/properties", {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const body = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        throw new Error(body?.error ?? "Unable to save property.");
      }

      router.push("/admin/properties");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save property.");
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
          <Input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Modern residence in Kilimani" />
        </AdminField>
        <AdminField label="Slug">
          <Input required value={slug} onChange={(event) => setSlug(slugify(event.target.value))} placeholder="modern-residence-kilimani" />
        </AdminField>
      </div>

      <AdminField label="Description">
        <Textarea required value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the property, positioning, finishes, and buyer/renter fit." />
      </AdminField>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AdminField label="Property Type">
          <Input required value={propertyType} onChange={(event) => setPropertyType(event.target.value)} placeholder="Apartment, Villa, Office..." />
        </AdminField>
        <AdminField label="Listing Type">
          <select value={listingType} onChange={(event) => setListingType(event.target.value as "sale" | "rent")} className="h-12 rounded-[1.2rem] border border-[rgba(42,39,34,0.12)] bg-white/70 px-4 text-sm outline-none">
            <option value="sale">Sale</option>
            <option value="rent">Rent</option>
          </select>
        </AdminField>
        <AdminField label="Status">
          <select value={status} onChange={(event) => setStatus(event.target.value as "available" | "rented" | "sold")} className="h-12 rounded-[1.2rem] border border-[rgba(42,39,34,0.12)] bg-white/70 px-4 text-sm outline-none">
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="sold">Sold</option>
          </select>
        </AdminField>
        <AdminField label="Price">
          <Input required min={1} type="number" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="45000000" />
        </AdminField>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AdminField label="Location">
          <Input required value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Westlands, Nairobi" />
        </AdminField>
        <AdminField label="Bedrooms">
          <Input min={0} type="number" value={bedrooms} onChange={(event) => setBedrooms(event.target.value)} placeholder="3" />
        </AdminField>
        <AdminField label="Bathrooms">
          <Input min={0} type="number" value={bathrooms} onChange={(event) => setBathrooms(event.target.value)} placeholder="3" />
        </AdminField>
        <AdminField label="Area">
          <Input required min={1} type="number" value={areaSqft} onChange={(event) => setAreaSqft(event.target.value)} placeholder="2400" />
        </AdminField>
      </div>

      <AdminField label="Amenities">
        <Textarea value={amenitiesText} onChange={(event) => setAmenitiesText(event.target.value)} placeholder="Pool, Gym, Backup generator, CCTV" />
      </AdminField>

      <label className="flex items-center gap-3 rounded-[1.4rem] border border-black/6 bg-white/60 px-4 py-4 text-sm">
        <input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} className="size-4 accent-[var(--gold-strong)]" />
        Feature this property on premium sections
      </label>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[1.8rem] border border-black/6 bg-white/60 p-5">
          <p className="quiet-label text-[var(--gold-strong)]">Cover Image</p>
          <div className="mt-4 overflow-hidden rounded-[1.4rem] border border-dashed border-black/10 bg-white/50">
            {coverImage ? <img src={coverImage.previewUrl} alt="Cover preview" className="aspect-[4/3] w-full object-cover" /> : <div className="flex aspect-[4/3] items-center justify-center text-sm text-muted-foreground">No cover selected</div>}
          </div>
          <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-black/10 bg-white/75 px-5 py-3 text-sm uppercase tracking-[0.18em]">
            <ImagePlus className="size-4" />
            Upload Cover
            <input type="file" accept="image/*" className="hidden" onChange={(event) => setCoverFile(event.target.files?.[0])} />
          </label>
        </div>

        <div className="rounded-[1.8rem] border border-black/6 bg-white/60 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="quiet-label text-[var(--gold-strong)]">Gallery Images</p>
              <p className="mt-2 text-sm text-muted-foreground">{galleryImages.length} image{galleryImages.length === 1 ? "" : "s"} selected</p>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-black/10 bg-white/75 px-5 py-3 text-sm uppercase tracking-[0.18em]">
              <ImagePlus className="size-4" />
              Add Images
              <input type="file" accept="image/*" multiple className="hidden" onChange={(event) => addGalleryFiles(Array.from(event.target.files ?? []))} />
            </label>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {galleryImages.map((image) => (
              <article key={image.id} className="overflow-hidden rounded-[1.2rem] border border-black/6 bg-white/70">
                <img src={image.previewUrl} alt="Gallery preview" className="aspect-[4/3] w-full object-cover" />
                <button type="button" onClick={() => removeGalleryImage(image.id)} className="flex w-full items-center justify-center gap-2 px-3 py-3 text-xs uppercase tracking-[0.16em] text-red-700">
                  <Trash2 className="size-3.5" />
                  Remove
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>

      {error ? <p className="rounded-[1.2rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <LuxuryButton type="submit" disabled={isSubmitting} size="lg" className="justify-center">
          {isSubmitting ? "Saving..." : mode === "edit" ? "Update Property" : "Create Property"}
        </LuxuryButton>
        <LuxuryButton href="/admin/properties" variant="outline" size="lg" className="justify-center">
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
