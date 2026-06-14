import { InsightForm } from "@/components/admin/insights/insight-form";
import { requireAdmin } from "@/lib/auth/admin";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "New Insight Post",
  description: "Create a new Maya Haven Insight editorial post."
});

export default async function NewInsightPage() {
  await requireAdmin("/admin/insights/new");

  return (
    <div className="pb-24 pt-32">
      <section className="site-shell space-y-8">
        <div>
          <p className="quiet-label text-[var(--gold-strong)]">Create Post</p>
          <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
            Write a new insight post.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
            Fill in the editorial details, set the status to &ldquo;Published&rdquo; when ready, and the post will appear on the public Insight page.
          </p>
        </div>
        <div className="rounded-[2rem] border border-black/6 bg-white/65 p-5 sm:p-8">
          <InsightForm mode="create" />
        </div>
      </section>
    </div>
  );
}
