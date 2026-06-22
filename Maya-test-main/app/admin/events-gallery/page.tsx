import { Plus } from "lucide-react";

import { EventsGalleryTable } from "@/components/admin/events-gallery/events-gallery-table";
import { LuxuryButton } from "@/components/site/luxury-button";
import { requireAdmin } from "@/lib/auth/admin";
import { createMetadata } from "@/lib/metadata";
import { getAdminEventGalleryItems } from "@/services/event-gallery";
import type { EventGalleryListResult } from "@/types/admin-event-gallery";

export const metadata = createMetadata({
  title: "Manage Events & Gallery",
  description: "Manage Maya Haven event and gallery items."
});

export const dynamic = "force-dynamic";

export default async function AdminEventsGalleryPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  await requireAdmin("/admin/events-gallery");
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const search = params.search ?? "";
  let setupError = "";
  let result: EventGalleryListResult = {
    items: [],
    count: 0,
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: 12,
    pageCount: 1
  };

  try {
    result = await getAdminEventGalleryItems({
      page: Number.isFinite(page) && page > 0 ? page : 1,
      search
    });
  } catch (error) {
    setupError = error instanceof Error ? error.message : "Unable to load event/gallery items.";
  }

  return (
    <div className="pb-24 pt-32">
      <section className="site-shell space-y-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="quiet-label text-[var(--gold-strong)]">Events & Gallery</p>
            <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
              Manage event and gallery items.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
              Create, edit, and publish public event/gallery cards. Only published items appear on the website.
            </p>
          </div>
          <LuxuryButton href="/admin/events-gallery/new" size="lg" icon={false} className="justify-center">
            <Plus className="size-4" />
            New Item
          </LuxuryButton>
        </div>

        {setupError ? (
          <div className="rounded-[1.8rem] border border-red-200 bg-red-50 px-5 py-4 text-sm leading-7 text-red-800">
            Events & Gallery could not load because Supabase returned: {setupError}. Run the event gallery grants migration, then refresh this page.
          </div>
        ) : null}

        <EventsGalleryTable result={result} search={search} />
      </section>
    </div>
  );
}
