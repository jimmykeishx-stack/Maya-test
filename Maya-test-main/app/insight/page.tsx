import Image from "next/image";

import { CTASection } from "@/components/site/cta-section";
import { SectionHeading } from "@/components/site/section-heading";
import { createMetadata } from "@/lib/metadata";
import { insightPosts } from "@/data/site";

export const metadata = createMetadata({
  title: "MAYA HAVEN INSIGHT",
  description: "Market intelligence, global investor guidance, and owner-facing property insight from Maya Haven."
});

export default function InsightPage() {
  return (
    <div className="pb-24 pt-32">
      <section className="site-shell space-y-8">
        <SectionHeading
          eyebrow="MAYA HAVEN INSIGHT"
          title="Market guidance for buyers, international property investors, landlords, and owners."
          description="A cleaner editorial layer for the questions clients actually ask before they buy, rent, list, or move capital."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {insightPosts.map((post) => (
            <article key={post.title} className="overflow-hidden rounded-[1.8rem] border border-black/6 bg-white/55 shadow-[0_18px_60px_rgba(15,12,8,0.06)]">
              <div className="relative aspect-[4/3]">
                <Image src={post.image} alt={post.title} fill className="object-cover" />
              </div>
              <div className="space-y-4 p-6">
                <p className="quiet-label text-[var(--gold-strong)]">{post.category}</p>
                <h3 className="font-display text-3xl leading-tight text-balance">{post.title}</h3>
                <p className="text-base leading-8 text-muted-foreground">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CTASection primaryHref="/contact" primaryLabel="SPEAK WITH US" secondaryHref="/properties" secondaryLabel="View Listings" />
    </div>
  );
}
