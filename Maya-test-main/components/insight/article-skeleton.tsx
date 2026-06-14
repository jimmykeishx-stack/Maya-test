export function ArticleSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="rounded-[1.4rem] border border-black/6 bg-white/55 shadow-[0_18px_60px_rgba(15,12,8,0.06)] overflow-hidden">
        {/* Image placeholder */}
        <div className="aspect-[4/3] bg-gradient-to-br from-[#e8e3dc] to-[#f0ebe4]" />

        <div className="space-y-4 p-5">
          {/* Category */}
          <div className="h-4 w-20 rounded-full bg-gradient-to-r from-[#e8e3dc] to-[#f0ebe4]" />

          {/* Title */}
          <div className="space-y-2">
            <div className="h-6 w-full rounded-lg bg-gradient-to-r from-[#e8e3dc] to-[#f0ebe4]" />
            <div className="h-6 w-3/4 rounded-lg bg-gradient-to-r from-[#e8e3dc] to-[#f0ebe4]" />
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-gradient-to-r from-[#e8e3dc] to-[#f0ebe4]" />
            <div className="h-4 w-5/6 rounded bg-gradient-to-r from-[#e8e3dc] to-[#f0ebe4]" />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-black/5 pt-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#e8e3dc] to-[#f0ebe4]" />
              <div className="h-3 w-24 rounded bg-gradient-to-r from-[#e8e3dc] to-[#f0ebe4]" />
            </div>
            <div className="flex gap-3">
              <div className="h-3 w-16 rounded bg-gradient-to-r from-[#e8e3dc] to-[#f0ebe4]" />
              <div className="h-3 w-12 rounded bg-gradient-to-r from-[#e8e3dc] to-[#f0ebe4]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturedArticleSkeleton() {
  return (
    <div className="animate-pulse min-h-[85vh] relative overflow-hidden">
      {/* Image placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2a2622] to-[#12100f]" />
      
      <div className="site-shell relative flex min-h-[85vh] items-end pb-16">
        <div className="max-w-2xl space-y-6">
          {/* Eyebrow */}
          <div className="flex items-center gap-4">
            <div className="h-6 w-28 rounded-full bg-white/10" />
            <div className="h-4 w-20 rounded-full bg-white/5" />
          </div>

          {/* Title */}
          <div className="space-y-3">
            <div className="h-12 w-full rounded-lg bg-white/10" />
            <div className="h-12 w-4/5 rounded-lg bg-white/10" />
            <div className="h-12 w-3/5 rounded-lg bg-white/10" />
          </div>

          {/* Excerpt */}
          <div className="space-y-2 max-w-xl">
            <div className="h-5 w-full rounded bg-white/5" />
            <div className="h-5 w-4/5 rounded bg-white/5" />
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 pt-4">
            <div className="h-9 w-9 rounded-full bg-white/10" />
            <div className="space-y-1">
              <div className="h-3 w-24 rounded bg-white/10" />
              <div className="h-2 w-16 rounded bg-white/5" />
            </div>
            <div className="h-4 w-24 rounded bg-white/5" />
            <div className="h-4 w-16 rounded bg-white/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
