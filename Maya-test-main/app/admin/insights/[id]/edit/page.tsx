import { notFound } from "next/navigation";

import { InsightForm } from "@/components/admin/insights/insight-form";
import { requireAdmin } from "@/lib/auth/admin";
import { createMetadata } from "@/lib/metadata";
import { getAdminBlogPostById } from "@/services/blog-posts";

export const metadata = createMetadata({
  title: "Edit Insight Post",
  description: "Edit an existing Maya Haven Insight post."
});

export default async function EditInsightPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireAdmin(`/admin/insights/${id}/edit`);
  const post = await getAdminBlogPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="pb-24 pt-32">
      <section className="site-shell space-y-8">
        <div>
          <p className="quiet-label text-[var(--gold-strong)]">Edit Post</p>
          <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
            Update &ldquo;{post.title}&rdquo;.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
            Update the post content, swap the featured image, change the status, or adjust SEO fields before saving.
          </p>
        </div>
        <div className="rounded-[2rem] border border-black/6 bg-white/65 p-5 sm:p-8">
          <InsightForm mode="edit" post={post} />
        </div>
      </section>
    </div>
  );
}
