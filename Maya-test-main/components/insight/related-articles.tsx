import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowUpRight } from "lucide-react";

import type { InsightPost } from "@/data/site";
import { ArticleCard } from "./article-card";

interface RelatedArticlesProps {
  posts: InsightPost[];
  currentSlug: string;
}

export function RelatedArticles({ posts, currentSlug }: RelatedArticlesProps) {
  const filteredPosts = posts.filter((post) => post.slug !== currentSlug).slice(0, 3);

  if (filteredPosts.length === 0) return null;

  return (
    <section className="section-space">
      <div className="site-shell">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="quiet-label text-[var(--gold-strong)]">Continue Reading</p>
            <h2 className="mt-2 font-display text-3xl text-[#12100f] sm:text-4xl">
              Related Articles
            </h2>
          </div>
          <Link
            href="/insight"
            className="hidden items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-[#12100f] sm:flex"
          >
            View All Articles
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/insight"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-[#12100f]"
          >
            View All Articles
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
