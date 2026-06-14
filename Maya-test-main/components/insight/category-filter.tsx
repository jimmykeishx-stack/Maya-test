"use client";

import { cn } from "@/lib/utils";
import type { InsightCategory } from "@/data/site";

interface CategoryFilterProps {
  categories: readonly string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="relative">
      {/* Fade edges for horizontal scroll */}
      <div className="pointer-events-none absolute -left-4 top-0 z-10 h-full w-8 bg-gradient-to-r from-[#faf9f7] to-transparent" />
      <div className="pointer-events-none absolute -right-4 top-0 z-10 h-full w-8 bg-gradient-to-l from-[#faf9f7] to-transparent" />

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              "whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-medium uppercase tracking-[0.12em] transition-all duration-300",
              selectedCategory === category
                ? "bg-[#12100f] text-[var(--gold)] shadow-[0_8px_30px_rgba(18,16,15,0.15)]"
                : "border border-black/10 bg-white/70 text-muted-foreground hover:border-[var(--gold)]/30 hover:bg-[var(--gold)]/5 hover:text-[#12100f]"
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
