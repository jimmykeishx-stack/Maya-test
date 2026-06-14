import { PropertiesBrowser } from "@/components/site/properties-browser";
import { SectionHeading } from "@/components/site/section-heading";
import { createMetadata } from "@/lib/metadata";
import { getProperties } from "@/lib/property-store";

export const metadata = createMetadata({
  title: "Affordable Housing",
  description: "Affordable housing options for buyers, tenants, and families looking for structured value."
});

export const dynamic = "force-dynamic";

export default async function AffordableHousingPage() {
  const properties = await getProperties();

  return (
    <div className="pb-24 pt-28 sm:pt-32">
      <section className="site-shell space-y-6">
        <SectionHeading
          eyebrow="Affordable Housing Options"
          title="Structured opportunities for practical ownership and dependable rental living."
          description="Search affordable housing options designed for first-time buyers, family support purchases, and better managed rental pathways."
        />
        <PropertiesBrowser properties={properties} initialFilters={{ segment: "Affordable Housing" }} />
      </section>
    </div>
  );
}
