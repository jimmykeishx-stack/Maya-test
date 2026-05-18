import { SavedListingsView } from "@/components/site/saved-listings-view";
import { SectionHeading } from "@/components/site/section-heading";
import { createMetadata } from "@/lib/metadata";
import { getProperties } from "@/lib/property-store";

export const metadata = createMetadata({
  title: "Saved Listings",
  description: "Review your saved Maya Haven luxury property shortlist."
});

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const properties = await getProperties();

  return (
    <div className="pb-24 pt-32">
      <section className="site-shell space-y-8">
        <SectionHeading
          eyebrow="Saved Listings"
          title="A personal shortlist for the homes that deserve a second look."
          description="This preview uses local frontend state only, allowing buyers to build and revisit a luxury property shortlist without backend persistence."
        />
        <SavedListingsView properties={properties} />
      </section>
    </div>
  );
}
