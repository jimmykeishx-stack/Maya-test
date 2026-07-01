"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type PropertyGalleryProps = {
  title: string;
  images: string[];
};

export function PropertyGallery({ title, images }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const galleryImages = images.length ? images : ["/placeholder.jpg"];
  const activeImage = galleryImages[activeIndex] ?? galleryImages[0];

  function showPrevious() {
    setActiveIndex((current) => (current <= 0 ? galleryImages.length - 1 : current - 1));
  }

  function showNext() {
    setActiveIndex((current) => (current >= galleryImages.length - 1 ? 0 : current + 1));
  }

  useEffect(() => {
    if (!isPreviewOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsPreviewOpen(false);
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isPreviewOpen, galleryImages.length]);

  return (
    <div className="space-y-4">
      <motion.button
        key={activeImage}
        type="button"
        onClick={() => setIsPreviewOpen(true)}
        initial={{ opacity: 0.55, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="group relative aspect-[16/10] w-full overflow-hidden rounded-[2rem] bg-black/5 text-left"
        aria-label={`Open fullscreen preview for ${title} image ${activeIndex + 1}`}
      >
        <Image src={activeImage} alt={`${title} view ${activeIndex + 1}`} fill className="object-cover transition duration-700 group-hover:scale-[1.02]" />
        <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white backdrop-blur-md">
          <Maximize2 className="size-4" />
          Preview
        </span>
      </motion.button>

      <div className="grid grid-cols-4 gap-3">
        {galleryImages.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            onDoubleClick={() => {
              setActiveIndex(index);
              setIsPreviewOpen(true);
            }}
            className={cn(
              "relative aspect-[4/3] overflow-hidden rounded-[1.3rem] border bg-black/5",
              activeIndex === index ? "border-[rgba(212,173,94,0.65)]" : "border-black/5"
            )}
            aria-label={`Show ${title} thumbnail ${index + 1}`}
          >
            <Image src={image} alt={`${title} thumbnail ${index + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>

      {isPreviewOpen ? (
        <div className="fixed inset-0 z-[120] grid bg-black/92 text-white" role="dialog" aria-modal="true">
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-4 bg-gradient-to-b from-black/80 to-transparent p-4 sm:p-6">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{title}</p>
              <p className="mt-1 text-xs text-white/60">
                {activeIndex + 1} of {galleryImages.length}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Close fullscreen preview"
            >
              <X className="size-5" />
            </button>
          </div>

          <button
            type="button"
            onClick={showPrevious}
            className="absolute left-3 top-1/2 z-10 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
            aria-label="Previous property image"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            onClick={showNext}
            className="absolute right-3 top-1/2 z-10 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
            aria-label="Next property image"
          >
            <ChevronRight className="size-6" />
          </button>

          <div className="flex h-full w-full items-center justify-center p-4 pt-20 sm:p-8 sm:pt-24">
            <div className="relative h-full w-full">
              <Image
                src={activeImage}
                alt={`${title} fullscreen image ${activeIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
