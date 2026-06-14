import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar } from "lucide-react";

import type { InsightPost } from "@/data/site";

interface ArticleCardProps {
  post: InsightPost;
  priority?: boolean;
}

export function ArticleCard({ post, priority = false }: ArticleCardProps) {
  return (
    <Link
      href={`/insight/${post.slug}`}
      className="group block overflow-hidden rounded-[1.4rem] border border-black/6 bg-white/55 shadow-[0_18px_60px_rgba(15,12,8,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,12,8,0.12)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute left-4 top-4 rounded-full bg-[var(--gold)]/90 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-[#12100f] backdrop-blur-sm">
          {post.category === "MAYA HAVEN INSIGHT" ? "Insight" : post.category}
        </span>
      </div>

      <div className="space-y-4 p-5">
        <h3 className="font-display text-xl leading-tight text-[#12100f] transition-colors duration-300 group-hover:text-[var(--gold-strong)] sm:text-2xl lg:text-[1.35rem]">
          {post.title}
        </h3>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between border-t border-black/5 pt-4">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full border border-black/10">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xs font-medium text-[#12100f]/80">{post.author.name}</span>
          </div>

          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readingTime} min
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
