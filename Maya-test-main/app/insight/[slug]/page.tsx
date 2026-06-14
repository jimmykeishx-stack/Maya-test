import Image from "next/image";
import { notFound } from "next/navigation";

import { CTASection } from "@/components/site/cta-section";
import { createMetadata } from "@/lib/metadata";
import { getBlogPostBySlug, getPublishedBlogPosts } from "@/services/blog-posts";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug).catch(() => null);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return createMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    image: post.featuredImageUrl ?? undefined
  });
}

export async function generateStaticParams() {
  let posts: Awaited<ReturnType<typeof getPublishedBlogPosts>> = [];
  try {
    posts = await getPublishedBlogPosts();
  } catch {
    return [];
  }
  return posts.map((post) => ({ slug: post.slug }));
}

export const dynamic = "force-dynamic";

export default async function InsightPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug).catch(() => null);

  if (!post) {
    notFound();
  }

  const publishedDate = post.publishedAt
    ? new Intl.DateTimeFormat("en-KE", {
        year: "numeric",
        month: "long",
        day: "numeric"
      }).format(new Date(post.publishedAt))
    : null;

  return (
    <div className="pb-24 pt-32">
      {/* Hero */}
      <section className="site-shell">
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[2rem]">
          <Image
            src={post.featuredImageUrl ?? "/placeholder.jpg"}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      </section>

      {/* Content */}
      <section className="site-shell mt-12">
        <div className="mx-auto max-w-3xl">
          <p className="quiet-label text-[var(--gold-strong)]">{post.category}</p>
          <h1 className="mt-4 font-display text-4xl leading-tight md:text-6xl">{post.title}</h1>
          {publishedDate ? (
            <p className="mt-4 text-sm text-muted-foreground">Published {publishedDate}</p>
          ) : null}
          {post.tags.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-black/8 bg-white/70 px-4 py-1.5 text-xs uppercase tracking-[0.16em] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <hr className="mt-10 border-black/8" />

          <div className="prose prose-lg mt-10 max-w-none">
            <p className="text-xl leading-8 text-muted-foreground">{post.excerpt}</p>
            <div className="mt-8 whitespace-pre-wrap text-base leading-8">{post.body}</div>
          </div>
        </div>
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
