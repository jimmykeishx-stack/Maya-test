import { notFound } from "next/navigation";

import { EventGalleryForm } from "@/components/admin/events-gallery/event-gallery-form";
import { requireAdmin } from "@/lib/auth/admin";
import { createMetadata } from "@/lib/metadata";
import { getAdminEventGalleryItemById } from "@/services/event-gallery";

export const metadata = createMetadata({
  title: "Edit Event/Gallery Item",
  description: "Edit an existing Maya Haven event or gallery item."
});

export default async function EditEventGalleryPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireAdmin(`/admin/events-gallery/${id}/edit`);
  const item = await getAdminEventGalleryItemById(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="pb-24 pt-32">
      <section className="site-shell space-y-8">
        <div>
          <p className="quiet-label text-[var(--gold-strong)]">Edit Item</p>
          <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
            Update &ldquo;{item.title}&rdquo;.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
            Update the image, copy, category, date, sort order, or publishing status before saving.
          </p>
        </div>
        <div className="rounded-[2rem] border border-black/6 bg-white/65 p-5 sm:p-8">
          <EventGalleryForm mode="edit" item={item} />
        </div>
      </section>
    </div>
  );
}
