import { EventGalleryForm } from "@/components/admin/events-gallery/event-gallery-form";
import { requireAdmin } from "@/lib/auth/admin";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "New Event/Gallery Item",
  description: "Create a new Maya Haven event or gallery item."
});

export default async function NewEventGalleryPage() {
  await requireAdmin("/admin/events-gallery/new");

  return (
    <div className="pb-24 pt-32">
      <section className="site-shell space-y-8">
        <div>
          <p className="quiet-label text-[var(--gold-strong)]">Create Item</p>
          <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
            Add an event or gallery item.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
            Add the public card details, set the status to &ldquo;Published&rdquo; when ready, and it will appear on Events & Gallery.
          </p>
        </div>
        <div className="rounded-[2rem] border border-black/6 bg-white/65 p-5 sm:p-8">
          <EventGalleryForm mode="create" />
        </div>
      </section>
    </div>
  );
}
