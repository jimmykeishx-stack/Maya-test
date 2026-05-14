"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

type PropertyGalleryProps = {
  title: string;
  images: string[];
};

export function PropertyGallery({ title, images }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-4">
      <motion.div
        key={images[activeIndex]}
        initial={{ opacity: 0.55, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative aspect-[16/10] overflow-hidden rounded-[2rem]"
      >
        <Image src={images[activeIndex]} alt={`${title} view ${activeIndex + 1}`} fill className="object-cover" />
      </motion.div>
      <div className="grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`relative aspect-[4/3] overflow-hidden rounded-[1.3rem] border ${
              activeIndex === index ? "border-[rgba(212,173,94,0.65)]" : "border-black/5"
            }`}
          >
            <Image src={image} alt={`${title} thumbnail ${index + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
