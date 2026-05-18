import { PropertiesBrowser } from "@/components/site/properties-browser";
import { SectionHeading } from "@/components/site/section-heading";
import { createMetadata } from "@/lib/metadata";
import { properties } from "@/data/properties";

export const metadata = createMetadata({
  title: "For Rent",
  description: "Explore Maya Haven rental properties across residential, commercial, and affordable housing categories."
});

export default function ForRentPage() {
  return (
    <div className="pb-24 pt-28 sm:pt-32">
      <section className="site-shell space-y-6">
        <SectionHeading
          eyebrow="For Rent"
          title="Rental opportunities for relocation, family living, and commercial occupancy."
          description="Clearer rental separation for clients looking for homes, managed tenancies, and workspace opportunities."
        />
        <PropertiesBrowser properties={properties} initialFilters={{ listingType: "Rent" }} />
      </section>
    </div>
  );
}
