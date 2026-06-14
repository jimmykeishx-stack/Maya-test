import { PropertiesBrowser } from "@/components/site/properties-browser";
import { SectionHeading } from "@/components/site/section-heading";
import { createMetadata } from "@/lib/metadata";
import { getProperties } from "@/lib/property-store";

export const metadata = createMetadata({
  title: "Commercial Properties",
  description: "Selected commercial opportunities including offices, retail, and mixed-use assets."
});

export const dynamic = "force-dynamic";

export default async function CommercialPage() {
  const properties = await getProperties();

  return (
    <div className="pb-24 pt-28 sm:pt-32">
      <section className="site-shell space-y-6">
        <SectionHeading
          eyebrow="Commercial"
        />
        <PropertiesBrowser properties={properties} initialFilters={{ segment: "Commercial" }} />
      </section>
    </div>
  );
}
