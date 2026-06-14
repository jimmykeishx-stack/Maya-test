import { FeaturedArticleSkeleton } from "@/components/insight/article-skeleton";
import { ArticleSkeleton } from "@/components/insight/article-skeleton";
import { SectionHeading } from "@/components/site/section-heading";

export default function Loading() {
  return (
    <>
      {/* Hero Skeleton */}
      <FeaturedArticleSkeleton />

      {/* Content Skeleton */}
      <section className="section-space">
        <div className="site-shell space-y-8">
          <SectionHeading
            eyebrow="MAYA HAVEN INSIGHT"
            title="Market guidance for buyers, international property investors, landlords, and owners."
            description="A cleaner editorial layer for the questions clients actually ask before they buy, rent, list, or move capital."
          />

          {/* Search and Filter placeholders */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="h-12 w-full animate-pulse rounded-[1.2rem] border border-black/5 bg-[#e8e3dc]/50 sm:max-w-sm" />
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-10 w-20 animate-pulse rounded-full bg-[#e8e3dc]/50" />
              ))}
            </div>
          </div>

          {/* Grid Skeletons */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ArticleSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
