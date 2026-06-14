"use client";

import { useRef, useState } from "react";

import { companyContact } from "@/data/site";
import { LuxuryButton } from "@/components/site/luxury-button";
import { LuxuryInput } from "@/components/site/luxury-input";
import { Textarea } from "@/components/ui/textarea";

type UploadPreview = {
  file: File;
  previewUrl: string;
  signature: string;
};

const MAX_IMAGES = 30;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

function replaceExtension(name: string, extension: string) {
  return name.replace(/\.[^.]+$/, extension);
}

async function hashFile(file: File) {
  const buffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function optimizeImage(file: File) {
  if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const longestSide = Math.max(bitmap.width, bitmap.height);
  const scale = longestSide > 2200 ? 2200 / longestSide : 1;
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    return file;
  }

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const outputType = file.type === "image/webp" ? "image/webp" : "image/jpeg";
  const extension = outputType === "image/webp" ? ".webp" : ".jpg";

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, outputType, 0.82);
  });

  if (!blob || blob.size >= file.size) {
    return file;
  }

  return new File([blob], replaceExtension(file.name, extension), {
    type: outputType,
    lastModified: file.lastModified
  });
}

export function ListWithUsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [images, setImages] = useState<UploadPreview[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    propertyType: "",
    location: "",
    listingType: "sale",
    expectedPrice: "",
    propertyDescription: "",
    ownershipConfirmed: false
  });

  function clearImages() {
    images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    setImages([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function addImages(files: File[]) {
    if (!files.length) {
      return;
    }

    setError("");

    const nextImages = [...images];
    const seenSignatures = new Set(nextImages.map((image) => image.signature));
    let skippedDuplicates = 0;
    let skippedInvalid = 0;
    let message = "";

    for (const rawFile of files) {
      if (nextImages.length >= MAX_IMAGES) {
        message = `You can upload up to ${MAX_IMAGES} images per listing.`;
        break;
      }

      if (!rawFile.type.startsWith("image/") || rawFile.size > MAX_IMAGE_SIZE * 2) {
        skippedInvalid += 1;
        continue;
      }

      const optimizedFile = await optimizeImage(rawFile);

      if (optimizedFile.size > MAX_IMAGE_SIZE) {
        skippedInvalid += 1;
        continue;
      }

      const signature = await hashFile(optimizedFile);

      if (seenSignatures.has(signature)) {
        skippedDuplicates += 1;
        continue;
      }

      seenSignatures.add(signature);
      nextImages.push({
        file: optimizedFile,
        previewUrl: URL.createObjectURL(optimizedFile),
        signature
      });
    }

    setImages((current) => {
      current
        .filter((image) => !nextImages.some((nextImage) => nextImage.signature === image.signature))
        .forEach((image) => URL.revokeObjectURL(image.previewUrl));
      return nextImages;
    });

    if (!message && skippedDuplicates > 0 && skippedInvalid === 0) {
      message = `${skippedDuplicates} duplicate image${skippedDuplicates === 1 ? "" : "s"} removed from this submission.`;
    } else if (!message && skippedInvalid > 0) {
      message = `${skippedInvalid} image${skippedInvalid === 1 ? "" : "s"} could not be added. Use image files under 20MB before optimization.`;
    }

    if (message) {
      setError(message);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setSubmitted(false);
        setError("");
        setIsSubmitting(true);

        try {
          const payload = new FormData();
          payload.append("fullName", formData.fullName);
          payload.append("phoneNumber", formData.phoneNumber);
          payload.append("email", formData.email);
          payload.append("propertyType", formData.propertyType);
          payload.append("location", formData.location);
          payload.append("listingType", formData.listingType);
          payload.append("expectedPrice", formData.expectedPrice);
          payload.append("propertyDescription", formData.propertyDescription);
          payload.append("ownershipConfirmed", String(formData.ownershipConfirmed));

          images.forEach((image) => {
            payload.append("images", image.file);
          });

          const response = await fetch("/api/owner-listings", {
            method: "POST",
            body: payload
          });

          if (!response.ok) {
            const body = (await response.json().catch(() => null)) as { error?: string } | null;
            throw new Error(body?.error ?? "Unable to submit owner listing.");
          }

          setSubmitted(true);
          setFormData({
            fullName: "",
            phoneNumber: "",
            email: "",
            propertyType: "",
            location: "",
            listingType: "sale",
            expectedPrice: "",
            propertyDescription: "",
            ownershipConfirmed: false
          });
          clearImages();
        } catch (submitError) {
          setError(submitError instanceof Error ? submitError.message : "We could not save your property submission just now. Please try again.");
        } finally {
          setIsSubmitting(false);
        }
      }}
      className="space-y-5"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <LuxuryInput
          label="Full Name"
          placeholder="Your full name"
          required
          value={formData.fullName}
          onChange={(event) => setFormData((current) => ({ ...current, fullName: event.target.value }))}
        />
        <LuxuryInput
          label="Phone Number"
          placeholder="+254 720 584 744"
          required
          value={formData.phoneNumber}
          onChange={(event) => setFormData((current) => ({ ...current, phoneNumber: event.target.value }))}
        />
        <LuxuryInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          required
          value={formData.email}
          onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
        />
        <LuxuryInput
          label="Property Type"
          placeholder="Apartment, office suite, townhouse..."
          required
          value={formData.propertyType}
          onChange={(event) => setFormData((current) => ({ ...current, propertyType: event.target.value }))}
        />
        <LuxuryInput
          label="Location"
          placeholder="Westlands, Karen, Upper Hill..."
          required
          value={formData.location}
          onChange={(event) => setFormData((current) => ({ ...current, location: event.target.value }))}
        />
        <label className="grid gap-3">
          <span className="text-sm font-medium text-foreground">Rent / Sale</span>
          <select
            value={formData.listingType}
            onChange={(event) => setFormData((current) => ({ ...current, listingType: event.target.value }))}
            required
            className="h-12 rounded-[1.2rem] border border-[rgba(42,39,34,0.12)] bg-white/70 px-4 text-sm outline-none transition focus:border-[rgba(212,173,94,0.55)]"
          >
            <option value="sale">Sale</option>
            <option value="rent">Rent</option>
          </select>
        </label>
      </div>

      <LuxuryInput
        label="Expected Price"
        placeholder="KES 18,500,000 or KES 180,000 per month"
        required
        value={formData.expectedPrice}
        onChange={(event) => setFormData((current) => ({ ...current, expectedPrice: event.target.value }))}
      />

      <label className="grid gap-3">
        <span className="text-sm font-medium text-foreground">Property Description</span>
        <Textarea
          placeholder="Share the property overview, current status, tenure details, amenities, and anything we should know before follow-up."
          required
          value={formData.propertyDescription}
          onChange={(event) => setFormData((current) => ({ ...current, propertyDescription: event.target.value }))}
        />
      </label>

      <div className="grid gap-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-medium text-foreground">Property Images</span>
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{images.length} / {MAX_IMAGES} optimized images selected</span>
        </div>
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={async (event) => {
            event.preventDefault();
            setIsDragging(false);
            await addImages(Array.from(event.dataTransfer.files));
          }}
          className={`rounded-[1.4rem] border border-dashed px-5 py-6 transition ${isDragging ? "border-[rgba(212,173,94,0.65)] bg-[rgba(212,173,94,0.08)]" : "border-[rgba(42,39,34,0.12)] bg-white/65"}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={async (event) => {
              await addImages(Array.from(event.target.files ?? []));
            }}
            className="hidden"
          />
          <div className="space-y-3 text-center">
            <p className="font-display text-2xl text-foreground">Drop up to 30 images or browse from your device.</p>
            <p className="mx-auto max-w-2xl text-sm leading-7 text-muted-foreground">
              Images are optimized before upload, duplicates are removed automatically, and larger batches are prepared for smoother review.
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-full border border-black/10 bg-white/75 px-5 py-3 text-sm uppercase tracking-[0.18em] text-foreground transition hover:-translate-y-0.5"
              >
                Browse Images
              </button>
            </div>
          </div>
        </div>
        <p className="text-xs leading-6 text-muted-foreground">Recommended: 20 to 30 clear property images. Each file must be 10MB or smaller after optimization.</p>
      </div>

      {images.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {images.map((image, index) => (
            <article key={image.signature} className="overflow-hidden rounded-[1.4rem] border border-black/6 bg-white/65">
              <div className="relative aspect-[4/3]">
                <img src={image.previewUrl} alt={`Property upload preview ${index + 1}`} className="h-full w-full object-cover" />
              </div>
              <div className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{image.file.name}</p>
                  <p className="text-xs text-muted-foreground">{(image.file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    URL.revokeObjectURL(image.previewUrl);
                    setImages((current) => current.filter((currentImage) => currentImage.signature !== image.signature));
                  }}
                  className="rounded-full border border-black/10 bg-white/80 px-3 py-2 text-[0.72rem] uppercase tracking-[0.16em] text-foreground"
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      <label className="flex items-start gap-3 rounded-[1.2rem] border border-[rgba(42,39,34,0.08)] bg-white/55 px-4 py-4 text-sm text-muted-foreground">
        <input
          type="checkbox"
          required
          checked={formData.ownershipConfirmed}
          onChange={(event) => setFormData((current) => ({ ...current, ownershipConfirmed: event.target.checked }))}
          className="mt-1"
        />
        <span>I confirm that I am authorized to list this property and to share the supporting details above.</span>
      </label>

      <LuxuryButton type="submit" className="w-full" size="lg" icon={!isSubmitting} disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Property"}
      </LuxuryButton>

      <p className="text-xs text-muted-foreground">
        For direct owner coordination, you can also email{" "}
        <a href={`mailto:${companyContact.primaryEmail}`} className="text-foreground underline decoration-black/20 underline-offset-4 transition hover:text-[var(--gold-strong)]">
          {companyContact.primaryEmail}
        </a>{" "}
        or{" "}
        <a href={`mailto:${companyContact.secondaryEmail}`} className="text-foreground underline decoration-black/20 underline-offset-4 transition hover:text-[var(--gold-strong)]">
          {companyContact.secondaryEmail}
        </a>
        .
      </p>
      {submitted ? <p className="text-sm text-[var(--gold-strong)]">Your property submission has been received for review.</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </form>
  );
}
