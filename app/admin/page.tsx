import { Building2, FileCheck2, FolderKanban, Home, Landmark, MessageSquareText, ShieldCheck, Tags } from "lucide-react";

import { AdminPropertyManager } from "@/components/site/admin-property-manager";
import { createMetadata } from "@/lib/metadata";
import {
  getListingLabel,
  getMandateLabel,
  getMarketStatusLabel,
  getSegmentLabel,
  properties
} from "@/data/properties";

export const metadata = createMetadata({
  title: "Admin Preview",
  description: "Frontend-only Maya Haven admin preview for listings, submissions, and operational dashboards."
});

export const dynamic = "force-static";

const demoBuyerInquiries = [
  {
    id: "buyer-1",
    fullName: "Njeri M.",
    email: "njeri@example.com",
    phoneNumber: "+254 722 410 220",
    message: "Looking for a 3-bedroom apartment in Riverside with strong security and easy access to international schools.",
    createdAt: "2026-05-18T09:15:00.000Z"
  },
  {
    id: "buyer-2",
    fullName: "David O.",
    email: "david@example.com",
    phoneNumber: "+44 7700 900123",
    message: "International property investor seeking a commercial acquisition with reliable tenant demand and clean due diligence support.",
    createdAt: "2026-05-17T14:40:00.000Z"
  }
];

const demoOwnerSubmissions = [
  {
    id: "owner-1",
    fullName: "Grace K.",
    email: "grace@example.com",
    phoneNumber: "+254 720 584 744",
    propertyType: "Apartment",
    location: "Kilimani",
    listingType: "rent",
    propertyDescription: "A furnished two-bedroom apartment suited for executive rentals and short relocation stays.",
    ownershipConfirmed: true,
    imageName: "kilimani-residence.jpg",
    createdAt: "2026-05-16T11:05:00.000Z"
  },
  {
    id: "owner-2",
    fullName: "Samuel R.",
    email: "samuel@example.com",
    phoneNumber: "+1 917 555 0142",
    propertyType: "Townhouse",
    location: "Runda",
    listingType: "sale",
    propertyDescription: "A family townhouse with landscaped frontage, ready for mandate discussion and pricing guidance.",
    ownershipConfirmed: true,
    imageName: "runda-townhouse.png",
    createdAt: "2026-05-15T08:30:00.000Z"
  }
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export default function AdminPage() {
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
          <p className="quiet-label text-[var(--gold-strong)]">Admin Preview</p>
          <h1 className="font-display text-4xl leading-tight md:text-5xl">A dummy Maya Haven admin built for presentations, product reviews, and frontend demos.</h1>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
            This page is intentionally frontend-only. It demonstrates how listing controls, submission queues, and operational summaries can look without depending on a live database or a persistent deployment backend.
          </p>
        </div>

        <div className="rounded-[1.8rem] border border-[var(--gold-strong)]/25 bg-[linear-gradient(135deg,rgba(212,173,94,0.15),rgba(255,255,255,0.58))] p-6 text-sm leading-7 text-muted-foreground">
          <strong className="font-medium text-foreground">Preview mode:</strong> upload, edit, and delete actions on this page only update the browser session. They do not publish to the public site and they reset when the page reloads.
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
            <p className="quiet-label text-[var(--gold-strong)]">Listing Controls</p>
            <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">Frontend-only controls for a premium admin concept.</h2>
          </div>
          <AdminPropertyManager initialProperties={properties} />
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
                <h2 className="mt-2 font-display text-3xl">Sample inquiry pipeline for presentation use.</h2>
              </div>
            </div>
            <div className="grid gap-4">
              {demoBuyerInquiries.map((inquiry) => (
                <article key={inquiry.id} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-display text-2xl">{inquiry.fullName}</p>
                    <span className="text-xs uppercase tracking-[0.18em] text-white/45">{formatDate(inquiry.createdAt)}</span>
                  </div>
                  <p className="mt-3 text-sm text-white/65">{inquiry.email} • {inquiry.phoneNumber}</p>
                  <p className="mt-4 text-sm leading-7 text-white/72">{inquiry.message}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <FileCheck2 className="size-5 text-[var(--gold)]" />
              <div>
                <p className="quiet-label text-[var(--gold)]">List With Us</p>
                <h2 className="mt-2 font-display text-3xl">Sample owner submission queue for demo workflows.</h2>
              </div>
            </div>
            <div className="grid gap-4">
              {demoOwnerSubmissions.map((submission) => (
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
                    Ownership confirmed: {submission.ownershipConfirmed ? "Yes" : "No"} • Image uploaded: {submission.imageName}
                  </p>
                </article>
              ))}
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
