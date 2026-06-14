import Link from "next/link";

import { PropertiesBrowser } from "@/components/site/properties-browser";
import { SectionHeading } from "@/components/site/section-heading";
import { createMetadata } from "@/lib/metadata";
import { getProperties } from "@/lib/property-store";

export const metadata = createMetadata({
  title: "Properties",
  description: "Browse Maya Haven's curated property marketplace across sale, rent, commercial, and affordable housing opportunities."
});

export const dynamic = "force-dynamic";

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <div className="pb-24 pt-28 sm:pt-32">
      <section className="site-shell space-y-6">
        <SectionHeading
          eyebrow="Properties"
          title="A clearer marketplace for sale, rent, commercial, and affordable housing."
          description="Search, sort, and explore residential, investor-ready rental, commercial, and affordable housing opportunities with market status visibility built in."
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { href: "/properties/for-sale", label: "For Sale" },
            { href: "/properties/for-rent", label: "For Rent" },
            { href: "/properties/commercial", label: "Commercial" },
            { href: "/properties/affordable-housing", label: "Affordable Housing" }
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[1.6rem] border border-black/6 bg-white/60 px-5 py-5 text-center font-display text-2xl transition hover:-translate-y-0.5"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <PropertiesBrowser properties={properties} />
      </section>
    </div>
  );
}
