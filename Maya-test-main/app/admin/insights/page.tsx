import { Plus } from "lucide-react";

import { InsightsTable } from "@/components/admin/insights/insights-table";
import { LuxuryButton } from "@/components/site/luxury-button";
import { requireAdmin } from "@/lib/auth/admin";
import { createMetadata } from "@/lib/metadata";
import { getAdminBlogPosts } from "@/services/blog-posts";

export const metadata = createMetadata({
  title: "Manage Insights",
  description: "Manage Maya Haven Insight editorial posts."
});

export const dynamic = "force-dynamic";

export default async function AdminInsightsPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  await requireAdmin("/admin/insights");
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const search = params.search ?? "";
  const result = await getAdminBlogPosts({
    page: Number.isFinite(page) && page > 0 ? page : 1,
    search
  });

  return (
    <div className="pb-24 pt-32">
      <section className="site-shell space-y-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="quiet-label text-[var(--gold-strong)]">Insight Management</p>
            <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
              Manage Maya Haven Insights.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
              Create, edit, and publish editorial posts from the CMS. Only published posts appear on the public insight page.
            </p>
          </div>
          <LuxuryButton href="/admin/insights/new" size="lg" icon={false} className="justify-center">
            <Plus className="size-4" />
            New Post
          </LuxuryButton>
        </div>

        <InsightsTable result={result} search={search} />
      </section>
    </div>
  );
}
