import { Building2, FileText, FolderKanban, ImagePlus, PenLine, Plus, ShieldCheck } from "lucide-react";

import { AdminLogoutButton } from "@/components/admin/admin-logout-button";
import { LuxuryButton } from "@/components/site/luxury-button";
import { requireAdmin } from "@/lib/auth/admin";
import { createMetadata } from "@/lib/metadata";
import { getAdminProperties } from "@/services/admin-properties";
import { getAdminBlogPosts } from "@/services/blog-posts";

export const metadata = createMetadata({
  title: "Admin",
  description: "Secure Maya Haven admin area for listings and property operations."
});

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin("/admin");
  const [result, postsResult] = await Promise.all([
    getAdminProperties({ page: 1, pageSize: 6 }),
    getAdminBlogPosts({ page: 1, pageSize: 1 })
  ]);
  const availableCount = result.properties.filter((property) => property.status === "available").length;
  const saleCount = result.properties.filter((property) => property.listingType === "sale").length;
  const rentCount = result.properties.filter((property) => property.listingType === "rent").length;
  const featuredCount = result.properties.filter((property) => property.featured).length;

  return (
    <div className="pb-24 pt-32">
      <section className="site-shell space-y-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="quiet-label text-[var(--gold-strong)]">Admin Console</p>
            <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">Maya Haven property operations.</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
              Securely manage property listings, media, and publishing workflows through Supabase-backed admin controls.
            </p>
          </div>
          <AdminLogoutButton />
        </div>

        <div className="rounded-[1.8rem] border border-[var(--gold-strong)]/25 bg-[linear-gradient(135deg,rgba(212,173,94,0.15),rgba(255,255,255,0.58))] p-6 text-sm leading-7 text-muted-foreground">
          <strong className="font-medium text-foreground">Protected area:</strong> only authenticated administrators listed in Supabase can access this page or call protected property and image upload endpoints.
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Listings", value: result.count, icon: FolderKanban },
            { label: "Available", value: availableCount, icon: ShieldCheck },
            { label: "For Sale", value: saleCount, icon: Building2 },
            { label: "For Rent", value: rentCount, icon: ImagePlus },
            { label: "Insight Posts", value: postsResult.count, icon: FileText }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.label} className="rounded-[1.8rem] border border-black/6 bg-white/60 p-6">
                <Icon className="size-5 text-[var(--gold-strong)]" />
                <p className="mt-4 font-display text-4xl">{item.value}</p>
                <p className="mt-2 text-sm uppercase tracking-[0.22em] text-muted-foreground">{item.label}</p>
              </article>
            );
          })}
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <article className="rounded-[2rem] border border-black/6 bg-white/60 p-6 sm:p-8">
            <p className="quiet-label text-[var(--gold-strong)]">Property CRUD</p>
            <h2 className="mt-4 font-display text-3xl">Manage live listings.</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              View, search, create, edit, and delete property records stored in Supabase PostgreSQL.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <LuxuryButton href="/admin/properties" className="justify-center">
                Manage Properties
              </LuxuryButton>
              <LuxuryButton href="/admin/properties/new" variant="outline" icon={false} className="justify-center">
                <Plus className="size-4" />
                New Property
              </LuxuryButton>
            </div>
          </article>

          <article className="rounded-[2rem] border border-black/6 bg-white/60 p-6 sm:p-8">
            <p className="quiet-label text-[var(--gold-strong)]">Insights CMS</p>
            <h2 className="mt-4 font-display text-3xl">Manage editorial posts.</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Create, edit, publish, and archive Maya Haven Insight articles stored in Supabase PostgreSQL.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <LuxuryButton href="/admin/insights" className="justify-center">
                Manage Insights
              </LuxuryButton>
              <LuxuryButton href="/admin/insights/new" variant="outline" icon={false} className="justify-center">
                <PenLine className="size-4" />
                New Post
              </LuxuryButton>
            </div>
          </article>
          <article className="rounded-[2rem] border border-black/6 bg-[#12100f] p-6 text-white sm:p-8">
            <p className="quiet-label text-[var(--gold)]">Featured Listings</p>
            <h2 className="mt-4 font-display text-3xl">{featuredCount} featured on this page.</h2>
            <p className="mt-4 text-sm leading-7 text-white/68">
              Mark listings as featured from the property form to surface them in premium homepage and browsing sections.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
