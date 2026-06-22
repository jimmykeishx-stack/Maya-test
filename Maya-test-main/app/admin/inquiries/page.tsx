import { requireAdmin } from "@/lib/auth/admin";
import { createMetadata } from "@/lib/metadata";
import { getBuyerInquiries, getOwnerSubmissions } from "@/lib/submissions-store";

export const metadata = createMetadata({
  title: "Inquiries & Owner Submissions",
  description: "Review Maya Haven buyer inquiries and List With Us owner submissions."
});

export const dynamic = "force-dynamic";

function ownerImageUrl(submissionId: string, hash: string) {
  return `/api/admin/owner-listings/${submissionId}/images/${hash}`;
}
function ownerImageDownloadUrl(submissionId: string, hash: string) {
  return `/api/admin/owner-listings/${submissionId}/images/${hash}/download`;
}
function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatListingType(value: string) {
  return value === "rent" ? "Rent" : "Sale";
}

export default async function AdminInquiriesPage() {
  await requireAdmin("/admin/inquiries");
  const [ownerSubmissions, buyerInquiries] = await Promise.all([
    getOwnerSubmissions(),
    getBuyerInquiries()
  ]);

  return (
    <div className="pb-24 pt-32">
      <section className="site-shell space-y-8">
        <div>
          <p className="quiet-label text-[var(--gold-strong)]">Inquiries</p>
          <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">Review client and owner submissions.</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
            List With Us submissions appear here after owners submit the public form. Buyer inquiries are shown below for quick follow-up.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <article className="rounded-[1.8rem] border border-black/6 bg-white/60 p-6">
            <p className="font-display text-4xl">{ownerSubmissions.length}</p>
            <p className="mt-2 text-sm uppercase tracking-[0.22em] text-muted-foreground">Owner submissions</p>
          </article>
          <article className="rounded-[1.8rem] border border-black/6 bg-white/60 p-6">
            <p className="font-display text-4xl">{buyerInquiries.length}</p>
            <p className="mt-2 text-sm uppercase tracking-[0.22em] text-muted-foreground">Buyer inquiries</p>
          </article>
        </div>

        <div className="space-y-5">
          <div>
            <p className="quiet-label text-[var(--gold-strong)]">List With Us</p>
            <h2 className="mt-3 font-display text-3xl">Owner property submissions.</h2>
          </div>
          {ownerSubmissions.length ? (
            <div className="grid gap-5">
              {ownerSubmissions.map((submission) => (
                <article key={submission.id} className="rounded-[2rem] border border-black/6 bg-white/65 p-5 sm:p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="font-display text-2xl">{submission.propertyType} in {submission.location}</p>
                      <p className="mt-2 text-sm text-muted-foreground">Submitted by {submission.fullName} on {formatDate(submission.createdAt)}</p>
                    </div>
                    <span className="w-fit rounded-full border border-black/8 bg-white/70 px-3 py-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      {formatListingType(submission.listingType)} / {submission.expectedPrice}
                    </span>
                  </div>
                  <div className="mt-5 grid gap-4 text-sm text-muted-foreground md:grid-cols-3">
                    <a href={`tel:${submission.phoneNumber}`} className="rounded-[1.2rem] border border-black/6 bg-white/55 px-4 py-3 text-foreground">{submission.phoneNumber}</a>
                    <a href={`mailto:${submission.email}`} className="rounded-[1.2rem] border border-black/6 bg-white/55 px-4 py-3 text-foreground">{submission.email}</a>
                    <span className="rounded-[1.2rem] border border-black/6 bg-white/55 px-4 py-3">{submission.images?.length ?? 0} image{(submission.images?.length ?? 0) === 1 ? "" : "s"}</span>
                  </div>
                  <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{submission.propertyDescription}</p>
                  {submission.images?.length ? (
                    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {submission.images.map((image, index) => {
                        const imageUrl = ownerImageUrl(submission.id, image.hash);
                        return (
                          <div
                            key={image.hash}
                            className="overflow-hidden rounded-[1.2rem] border border-black/6 bg-white/75"
                          >
                            <a href={imageUrl} target="_blank" rel="noreferrer" className="group block">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={imageUrl} alt={`${submission.propertyType} upload ${index + 1}`} className="aspect-[4/3] w-full object-cover transition group-hover:scale-[1.03]" />
                            </a>
                            <div className="grid gap-2 px-3 py-3 text-xs text-muted-foreground">
                              <span className="truncate">{image.fileName}</span>
                              <div className="flex flex-wrap gap-2">
                                <a href={imageUrl} target="_blank" rel="noreferrer" className="rounded-full border border-black/10 bg-white px-3 py-2 uppercase tracking-[0.16em] text-[var(--gold-strong)]">
                                  Open
                                </a>
                                <a href={ownerImageDownloadUrl(submission.id, image.hash)} className="rounded-full border border-black/10 bg-white px-3 py-2 uppercase tracking-[0.16em] text-foreground">
                                  Download
                                </a>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-black/6 bg-white/65 p-8 text-sm text-muted-foreground">No owner submissions yet.</div>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <p className="quiet-label text-[var(--gold-strong)]">Buyer Follow-Up</p>
            <h2 className="mt-3 font-display text-3xl">Buyer inquiries.</h2>
          </div>
          {buyerInquiries.length ? (
            <div className="grid gap-5 md:grid-cols-2">
              {buyerInquiries.map((inquiry) => (
                <article key={inquiry.id} className="rounded-[2rem] border border-black/6 bg-white/65 p-5 sm:p-6">
                  <p className="font-display text-2xl">{inquiry.fullName}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">{formatDate(inquiry.createdAt)}</p>
                  <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                    <a href={`tel:${inquiry.phoneNumber}`} className="text-foreground">{inquiry.phoneNumber}</a>
                    <a href={`mailto:${inquiry.email}`} className="text-foreground">{inquiry.email}</a>
                  </div>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{inquiry.message}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-black/6 bg-white/65 p-8 text-sm text-muted-foreground">No buyer inquiries yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}