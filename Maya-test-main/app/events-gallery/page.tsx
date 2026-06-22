import Image from "next/image";

import { CTASection } from "@/components/site/cta-section";
import { SectionHeading } from "@/components/site/section-heading";
import { createMetadata } from "@/lib/metadata";
import { getPublishedEventGalleryItems } from "@/services/event-gallery";

export const metadata = createMetadata({
  title: "Events & Gallery",
  description: "A curated events and gallery section for briefings, property showcases, and transaction milestones."
});

export const dynamic = "force-dynamic";

export default async function EventsGalleryPage() {
  let eventsGalleryItems: Awaited<ReturnType<typeof getPublishedEventGalleryItems>> = [];

  try {
    eventsGalleryItems = await getPublishedEventGalleryItems();
  } catch {
    eventsGalleryItems = [];
  }

  return (
    <div className="pb-24 pt-32">
      <section className="site-shell space-y-8">
        <SectionHeading
          title="Events & Gallery."
          description="Designed as a flexible content section for launches, showcases, investor sessions, and visual proof of delivery."
        />
        {eventsGalleryItems.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {eventsGalleryItems.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-[1.8rem] border border-black/6 bg-white/55 shadow-[0_18px_60px_rgba(15,12,8,0.06)]">
                <div className="relative aspect-[4/3]">
                  <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                </div>
                <div className="space-y-4 p-6">
                  <p className="quiet-label text-[var(--gold-strong)]">{item.category}</p>
                  <h3 className="font-display text-3xl leading-tight text-balance">{item.title}</h3>
                  <p className="text-base leading-8 text-muted-foreground">{item.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-black/6 bg-white/55 py-16 text-center">
            <p className="text-muted-foreground">No published event or gallery items yet.</p>
          </div>
        )}
      </section>

      <CTASection primaryHref="/contact" primaryLabel="SPEAK WITH US" secondaryHref="/diaspora-connect" secondaryLabel="Global Investor Support" />
    </div>
  );
}
