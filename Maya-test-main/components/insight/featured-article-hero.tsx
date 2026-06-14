import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, Calendar } from "lucide-react";

import type { InsightPost } from "@/data/site";

interface FeaturedArticleHeroProps {
  post: InsightPost;
}

export function FeaturedArticleHero({ post }: FeaturedArticleHeroProps) {
  return (
    <section className="relative min-h-[85vh] overflow-hidden sm:min-h-[90vh]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#12100f]/85 via-[#12100f]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12100f]/80 via-[#12100f]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#12100f]/20 via-transparent to-transparent" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[var(--gold)]/5 blur-[120px]" />
      <div className="absolute bottom-20 right-20 h-64 w-64 rounded-full bg-[var(--gold)]/8 blur-[80px]" />

      {/* Content */}
      <div className="site-shell relative flex min-h-[85vh] items-end pb-16 sm:min-h-[90vh] sm:pb-24">
        <div className="max-w-2xl space-y-6 sm:max-w-3xl lg:max-w-[60%]">
          {/* Eyebrow */}
          <div className="flex items-center gap-4">
            <span className="inline-block rounded-full bg-[var(--gold)]/20 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--gold)] backdrop-blur-sm">
              Featured Article
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">
              {post.category === "MAYA HAVEN INSIGHT" ? "Insight" : post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 gap-y-2 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <div className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-white/20">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="block text-xs font-medium text-white">{post.author.name}</span>
                <span className="block text-[10px] text-white/50">{post.author.role}</span>
              </div>
            </div>

            <span className="h-4 w-px bg-white/20" />

            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric"
              })}
            </span>

            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {post.readingTime} min read
            </span>
          </div>

          {/* CTA */}
          <div className="pt-4">
            <Link
              href={`/insight/${post.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#d4ad5e_0%,#b89041_100%)] px-7 py-4 text-sm font-medium uppercase tracking-[0.14em] text-[#16120d] shadow-[0_20px_50px_rgba(212,173,94,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(212,173,94,0.4)]"
            >
              Read Article
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="h-6 w-6 rounded-full border-2 border-white/30">
          <div className="mt-2 ml-0.5 h-1.5 w-1.5 rounded-full bg-white/50" />
        </div>
      </div>
    </section>
  );
}
