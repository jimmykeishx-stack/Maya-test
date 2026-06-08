import { notFound } from "next/navigation";

import { PropertyForm } from "@/components/admin/properties/property-form";
import { requireAdmin } from "@/lib/auth/admin";
import { createMetadata } from "@/lib/metadata";
import { getAdminPropertyById } from "@/services/admin-properties";

export const metadata = createMetadata({
  title: "Edit Property",
  description: "Edit an existing Maya Haven property listing."
});

export default async function EditPropertyPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireAdmin(`/admin/properties/${id}/edit`);
  const property = await getAdminPropertyById(id);

  if (!property) {
    notFound();
  }

  return (
    <div className="pb-24 pt-32">
      <section className="site-shell space-y-8">
        <div>
          <p className="quiet-label text-[var(--gold-strong)]">Edit Listing</p>
          <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">Update {property.title}.</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
            Update listing details, replace the cover image, add gallery images, or remove images before saving changes.
          </p>
        </div>
        <div className="rounded-[2rem] border border-black/6 bg-white/65 p-5 sm:p-8">
          <PropertyForm mode="edit" property={property} />
        </div>
      </section>
    </div>
  );
}
