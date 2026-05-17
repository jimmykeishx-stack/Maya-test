import { PropertiesBrowser } from "@/components/site/properties-browser";
import { SectionHeading } from "@/components/site/section-heading";
import { createMetadata } from "@/lib/metadata";
import { properties } from "@/data/properties";

export const metadata = createMetadata({
  title: "Properties",
  description: "Browse Maya Haven's curated collection of luxury Nairobi apartments, penthouses, family residences, and investment-led homes."
});

export default function PropertiesPage() {
  return (
    <div className="pb-24 pt-32">
      <section className="site-shell space-y-6">
        <SectionHeading
          eyebrow="Properties"
          description="Search, sort, and explore curated luxury residences across Westlands, Karen, Kilimani, Riverside, Kileleshwa, and Runda."
        />
        <PropertiesBrowser properties={properties} />
      </section>
    </div>
  );
}
