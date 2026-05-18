import { Building2, FileCheck2, FolderKanban, Home, Landmark, MessageSquareText, ShieldCheck, Tags } from "lucide-react";

import { createMetadata } from "@/lib/metadata";
import {
  getListingLabel,
  getMandateLabel,
  getMarketStatusLabel,
  getSegmentLabel,
  properties
} from "@/data/properties";
import { getBuyerInquiries, getOwnerSubmissions } from "@/lib/submissions-store";

export const metadata = createMetadata({
  title: "Admin",
  description: "Internal property management overview for listings, mandates, and submissions."
});

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export default async function AdminPage() {
  const buyerInquiries = await getBuyerInquiries();
  const ownerSubmissions = await getOwnerSubmissions();

  const saleCount = properties.filter((property) => property.listingType === "sale").length;
  const rentCount = properties.filter((property) => property.listingType === "rent").length;
  const commercialCount = properties.filter((property) => property.segment === "commercial").length;
  const affordableCount = properties.filter((property) => property.segment === "affordable-housing").length;
  const exclusiveCount = properties.filter((property) => property.mandateType === "exclusive").length;
  const liveCount = properties.filter((property) => property.marketStatus === "available").length;

  return (
    <div className="pb-24 pt-32">
      <section className="site-shell space-y-8">
        <div className="space-y-4">
          <p className="quiet-label text-[var(--gold-strong)]">Admin Overview</p>
          <h1 className="font-display text-4xl leading-tight md:text-5xl">Internal property management structure for listings, mandates, and submissions.</h1>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
            This is an internal-facing overview for the upgraded Maya Haven marketplace. It summarizes sale and rent stock, market status visibility, exclusive mandates, buyer inquiries, and separate owner listing submissions.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[
            { label: "For Sale", value: saleCount, icon: Tags },
            { label: "For Rent", value: rentCount, icon: Home },
            { label: "Commercial", value: commercialCount, icon: Landmark },
            { label: "Affordable Housing", value: affordableCount, icon: Building2 },
            { label: "Exclusive Mandates", value: exclusiveCount, icon: ShieldCheck },
            { label: "Live Listings", value: liveCount, icon: FolderKanban }
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
      </section>

      <section className="section-space">
        <div className="site-shell space-y-6">
          <div>
            <p className="quiet-label text-[var(--gold-strong)]">Listing Structure</p>
            <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">Backend-ready listing architecture with sale, rent, segment, status, and mandate fields.</h2>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-black/6 bg-white/60">
            <div className="grid gap-px bg-black/6 md:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr_1fr]">
              {["Listing", "Intent", "Category", "Status", "Mandate"].map((heading) => (
                <div key={heading} className="bg-white/75 px-5 py-4 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {heading}
                </div>
              ))}
              {properties.map((property) => (
                <FragmentRow
                  key={property.id}
                  title={property.title}
                  subtitle={property.location}
                  intent={getListingLabel(property.listingType)}
                  category={getSegmentLabel(property.segment)}
                  status={getMarketStatusLabel(property.marketStatus)}
                  mandate={getMandateLabel(property.mandateType)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-space bg-[#12100f] text-white">
        <div className="site-shell grid gap-8 xl:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <MessageSquareText className="size-5 text-[var(--gold)]" />
              <div>
                <p className="quiet-label text-[var(--gold)]">Buyer Inquiries</p>
                <h2 className="mt-2 font-display text-3xl">Stored separately from owner submissions.</h2>
              </div>
            </div>
            <div className="grid gap-4">
              {buyerInquiries.length ? (
                buyerInquiries.slice(0, 6).map((inquiry) => (
                  <article key={inquiry.id} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-display text-2xl">{inquiry.fullName}</p>
                      <span className="text-xs uppercase tracking-[0.18em] text-white/45">{formatDate(inquiry.createdAt)}</span>
                    </div>
                    <p className="mt-3 text-sm text-white/65">{inquiry.email} • {inquiry.phoneNumber}</p>
                    <p className="mt-4 text-sm leading-7 text-white/72">{inquiry.message}</p>
                  </article>
                ))
              ) : (
                <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5 text-sm text-white/65">
                  No buyer inquiries stored yet.
                </article>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <FileCheck2 className="size-5 text-[var(--gold)]" />
              <div>
                <p className="quiet-label text-[var(--gold)]">List With Us</p>
                <h2 className="mt-2 font-display text-3xl">Dedicated owner submission workflow and storage path.</h2>
              </div>
            </div>
            <div className="grid gap-4">
              {ownerSubmissions.length ? (
                ownerSubmissions.slice(0, 6).map((submission) => (
                  <article key={submission.id} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-display text-2xl">{submission.fullName}</p>
                      <span className="text-xs uppercase tracking-[0.18em] text-white/45">{formatDate(submission.createdAt)}</span>
                    </div>
                    <p className="mt-3 text-sm text-white/65">
                      {submission.propertyType} • {submission.location} • {submission.listingType === "sale" ? "Sale" : "Rent"}
                    </p>
                    <p className="mt-3 text-sm text-white/65">{submission.email} • {submission.phoneNumber}</p>
                    <p className="mt-4 text-sm leading-7 text-white/72">{submission.propertyDescription}</p>
                    <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[var(--gold)]">
                      Ownership confirmed: {submission.ownershipConfirmed ? "Yes" : "No"}{submission.image ? ` • Image uploaded: ${submission.image.fileName}` : ""}
                    </p>
                  </article>
                ))
              ) : (
                <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5 text-sm text-white/65">
                  No owner listing submissions stored yet.
                </article>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FragmentRow({
  title,
  subtitle,
  intent,
  category,
  status,
  mandate
}: {
  title: string;
  subtitle: string;
  intent: string;
  category: string;
  status: string;
  mandate: string;
}) {
  return (
    <>
      <div className="bg-white/60 px-5 py-5">
        <p className="font-display text-2xl">{title}</p>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="bg-white/60 px-5 py-5 text-sm text-muted-foreground">{intent}</div>
      <div className="bg-white/60 px-5 py-5 text-sm text-muted-foreground">{category}</div>
      <div className="bg-white/60 px-5 py-5 text-sm text-muted-foreground">{status}</div>
      <div className="bg-white/60 px-5 py-5 text-sm text-muted-foreground">{mandate}</div>
    </>
  );
}
