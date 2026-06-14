import { PropertiesBrowser } from "@/components/site/properties-browser";
import { SectionHeading } from "@/components/site/section-heading";
import { createMetadata } from "@/lib/metadata";
import { getProperties } from "@/lib/property-store";

export const metadata = createMetadata({
  title: "For Rent",
  description: "Explore Maya Haven rental properties across residential, commercial, and affordable housing categories."
});

export const dynamic = "force-dynamic";

export default async function ForRentPage() {
  const properties = await getProperties();

  return (
    <div className="pb-24 pt-28 sm:pt-32">
      <section className="site-shell space-y-6">
        <SectionHeading
          eyebrow="For Rent"
        />
        <PropertiesBrowser properties={properties} initialFilters={{ listingType: "Rent" }} />
      </section>
    </div>
  );
}
