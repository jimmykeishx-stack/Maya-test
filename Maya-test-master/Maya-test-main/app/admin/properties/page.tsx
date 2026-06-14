import { Plus } from "lucide-react";

import { PropertiesTable } from "@/components/admin/properties/properties-table";
import { LuxuryButton } from "@/components/site/luxury-button";
import { requireAdmin } from "@/lib/auth/admin";
import { createMetadata } from "@/lib/metadata";
import { getAdminProperties } from "@/services/admin-properties";

export const metadata = createMetadata({
  title: "Manage Properties",
  description: "Secure Maya Haven property listing management."
});

export const dynamic = "force-dynamic";

export default async function AdminPropertiesPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  await requireAdmin("/admin/properties");
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const search = params.search ?? "";
  const result = await getAdminProperties({
    page: Number.isFinite(page) && page > 0 ? page : 1,
    search
  });

  return (
    <div className="pb-24 pt-32">
      <section className="site-shell space-y-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="quiet-label text-[var(--gold-strong)]">Property Management</p>
            <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">Manage Maya Haven listings.</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
              Create, edit, search, and remove database-backed properties with admin-only Supabase access.
            </p>
          </div>
          <LuxuryButton href="/admin/properties/new" size="lg" icon={false} className="justify-center">
            <Plus className="size-4" />
            New Property
          </LuxuryButton>
        </div>

        <PropertiesTable result={result} search={search} />
      </section>
    </div>
  );
}
