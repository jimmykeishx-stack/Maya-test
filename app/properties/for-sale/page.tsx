import { PropertiesBrowser } from "@/components/site/properties-browser";
import { SectionHeading } from "@/components/site/section-heading";
import { createMetadata } from "@/lib/metadata";
import { getProperties } from "@/lib/property-store";

export const metadata = createMetadata({
  title: "For Sale",
  description: "Explore Maya Haven properties for sale across residential, commercial, and affordable housing categories."
});

export const dynamic = "force-dynamic";

export default async function ForSalePage() {
  const properties = await getProperties();

  return (
    <div className="pb-24 pt-28 sm:pt-32">
      <section className="site-shell space-y-6">
        <SectionHeading
          eyebrow="For Sale"
          title="Properties currently positioned for sale."
          description="A direct view of active sale-side opportunities, from premium residences to selected commercial and affordable housing stock."
        />
        <PropertiesBrowser properties={properties} initialFilters={{ listingType: "Sale" }} />
      </section>
    </div>
  );
}
