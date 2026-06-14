import { PropertyForm } from "@/components/admin/properties/property-form";
import { requireAdmin } from "@/lib/auth/admin";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Create Property",
  description: "Create a new Maya Haven property listing."
});

export default async function NewPropertyPage() {
  await requireAdmin("/admin/properties/new");

  return (
    <div className="pb-24 pt-32">
      <section className="site-shell space-y-8">
        <div>
          <p className="quiet-label text-[var(--gold-strong)]">Create Listing</p>
          <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">Add a new property.</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
            Fill in the property details, add a cover image and gallery, then publish the record to Supabase.
          </p>
        </div>
        <div className="rounded-[2rem] border border-black/6 bg-white/65 p-5 sm:p-8">
          <PropertyForm mode="create" />
        </div>
      </section>
    </div>
  );
}
