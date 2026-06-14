import Image from "next/image";

import { CTASection } from "@/components/site/cta-section";
import { SectionHeading } from "@/components/site/section-heading";
import { createMetadata } from "@/lib/metadata";
// Fallback implementation for getPublishedBlogPosts (replace with real service when available)
async function getPublishedBlogPosts(): Promise<
  {
    id: string;
    slug: string;
    title: string;
    excerpt?: string | null;
    category?: string | null;
    featuredImageUrl?: string | null;
  }[]
> {
  // Return an empty array by default; replace with actual fetching logic or restore the import.
  return [];
}

export const metadata = createMetadata({
  title: "MAYA HAVEN INSIGHT",
});

export const dynamic = "force-dynamic";

export default async function InsightPage() {
  let posts: Awaited<ReturnType<typeof getPublishedBlogPosts>> = [];

  try {
    posts = await getPublishedBlogPosts();
  } catch {
    // Supabase not configured — show empty state gracefully
    posts = [];
  }

  return (
    <div className="pb-24 pt-32">
      <section className="site-shell space-y-8">
        <SectionHeading
          eyebrow="MAYA HAVEN INSIGHT"
        />
        {posts.length === 0 ? (
          <div className="rounded-[2rem] border border-black/6 bg-white/55 py-16 text-center">
            <p className="text-muted-foreground">No published insights yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <a
                key={post.id}
                href={`/insight/${post.slug}`}
                className="group overflow-hidden rounded-[1.8rem] border border-black/6 bg-white/55 shadow-[0_18px_60px_rgba(15,12,8,0.06)] transition-shadow hover:shadow-[0_24px_70px_rgba(15,12,8,0.1)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={post.featuredImageUrl ?? "/placeholder.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-4 p-6">
                  <p className="quiet-label text-[var(--gold-strong)]">{post.category}</p>
                  <h3 className="font-display text-3xl leading-tight text-balance">{post.title}</h3>
                  <p className="text-base leading-8 text-muted-foreground">{post.excerpt}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      <CTASection
        primaryHref="/contact"
        primaryLabel="SPEAK WITH US"
        secondaryHref="/properties"
        secondaryLabel="View Listings"
      />
    </div>
  );
}
