import { PropertiesBrowser } from "@/components/site/properties-browser";
import { SectionHeading } from "@/components/site/section-heading";
import { createMetadata } from "@/lib/metadata";
import { properties } from "@/data/properties";

export const metadata = createMetadata({
  title: "Commercial Properties",
  description: "Selected commercial opportunities including offices, retail, and mixed-use assets."
});

export default function CommercialPage() {
  return (
    <div className="pb-24 pt-28 sm:pt-32">
      <section className="site-shell space-y-6">
        <SectionHeading
          eyebrow="Commercial"
          title="Commercial property opportunities for lease, acquisition, and investor review."
          description="A dedicated section for office suites, retail frontage, mixed-use assets, and mandate-led commercial sourcing."
        />
        <PropertiesBrowser properties={properties} initialFilters={{ segment: "Commercial" }} />
      </section>
    </div>
  );
}
