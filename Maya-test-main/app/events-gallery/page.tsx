import Image from "next/image";

import { CTASection } from "@/components/site/cta-section";
import { SectionHeading } from "@/components/site/section-heading";
import { createMetadata } from "@/lib/metadata";
import { eventsGalleryItems } from "@/data/site";

export const metadata = createMetadata({
  title: "Events & Gallery",
  description: "A curated events and gallery section for briefings, property showcases, and transaction milestones."
});

export default function EventsGalleryPage() {
  return (
    <div className="pb-24 pt-32">
      <section className="site-shell space-y-8">
        <SectionHeading
          title="Events & Gallery."
          description="Designed as a flexible content section for launches, showcases, investor sessions, and visual proof of delivery."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {eventsGalleryItems.map((item) => (
            <article key={item.title} className="overflow-hidden rounded-[1.8rem] border border-black/6 bg-white/55 shadow-[0_18px_60px_rgba(15,12,8,0.06)]">
              <div className="relative aspect-[4/3]">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>
              <div className="space-y-4 p-6">
                <p className="quiet-label text-[var(--gold-strong)]">{item.category}</p>
                <h3 className="font-display text-3xl leading-tight text-balance">{item.title}</h3>
                <p className="text-base leading-8 text-muted-foreground">{item.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CTASection primaryHref="/contact" primaryLabel="SPEAK WITH US" secondaryHref="/diaspora-connect" secondaryLabel="Global Investor Support" />
    </div>
  );
}
