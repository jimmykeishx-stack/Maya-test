"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Maximize2, X } from "lucide-react";

type OwnerSubmissionImage = {
  hash: string;
  fileName: string;
  mimeType: string;
  size: number;
  dataUrl?: string;
};

type OwnerSubmissionGalleryProps = {
  submissionId: string;
  propertyType: string;
  images: OwnerSubmissionImage[];
};

function ownerImageUrl(submissionId: string, hash: string) {
  return `/api/admin/owner-listings/${submissionId}/images/${hash}`;
}

function ownerImageDownloadUrl(submissionId: string, hash: string) {
  return `/api/admin/owner-listings/${submissionId}/images/${hash}/download`;
}

function formatSize(size: number) {
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

export function OwnerSubmissionGallery({ submissionId, propertyType, images }: OwnerSubmissionGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeImage = activeIndex === null ? null : images[activeIndex] ?? null;
  const imageUrls = useMemo(
    () => images.map((image) => ({
      ...image,
      previewUrl: image.dataUrl || ownerImageUrl(submissionId, image.hash),
      downloadUrl: ownerImageDownloadUrl(submissionId, image.hash)
    })),
    [images, submissionId]
  );

  function showPrevious() {
    setActiveIndex((current) => {
      if (current === null) return null;
      return current <= 0 ? images.length - 1 : current - 1;
    });
  }

  function showNext() {
    setActiveIndex((current) => {
      if (current === null) return null;
      return current >= images.length - 1 ? 0 : current + 1;
    });
  }

  useEffect(() => {
    if (activeIndex === null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIndex]);

  if (!images.length) return null;

  return (
    <>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {imageUrls.map((image, index) => (
          <article key={image.hash} className="overflow-hidden rounded-[1.2rem] border border-black/6 bg-white/75">
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group block w-full bg-black/5 text-left"
              aria-label={`Preview ${propertyType} upload ${index + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.previewUrl}
                alt={`${propertyType} upload ${index + 1}`}
                className="aspect-[4/3] w-full object-cover transition group-hover:scale-[1.03]"
              />
            </button>
            <div className="grid gap-2 px-3 py-3 text-xs text-muted-foreground">
              <span className="truncate">{image.fileName}</span>
              <span>{formatSize(image.size)}</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-white px-3 py-2 uppercase tracking-[0.16em] text-[var(--gold-strong)]"
                >
                  <Maximize2 className="size-3" />
                  Preview
                </button>
                <a href={image.downloadUrl} className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-white px-3 py-2 uppercase tracking-[0.16em] text-foreground">
                  <Download className="size-3" />
                  Download
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {activeImage !== null && activeIndex !== null ? (
        <div className="fixed inset-0 z-[120] grid bg-black/92 text-white" role="dialog" aria-modal="true">
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-4 bg-gradient-to-b from-black/80 to-transparent p-4 sm:p-6">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{activeImage.fileName}</p>
              <p className="mt-1 text-xs text-white/60">
                {activeIndex + 1} of {images.length} / {formatSize(activeImage.size)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={ownerImageDownloadUrl(submissionId, activeImage.hash)}
                className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Download image"
              >
                <Download className="size-5" />
              </a>
              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Close preview"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={showPrevious}
            className="absolute left-3 top-1/2 z-10 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
            aria-label="Previous image"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            onClick={showNext}
            className="absolute right-3 top-1/2 z-10 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
            aria-label="Next image"
          >
            <ChevronRight className="size-6" />
          </button>

          <div className="flex h-full w-full items-center justify-center p-4 pt-20 sm:p-8 sm:pt-24">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage.dataUrl || ownerImageUrl(submissionId, activeImage.hash)}
              alt={`${propertyType} upload ${activeIndex + 1}`}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}



