import Image from "next/image";

import { CTASection } from "@/components/site/cta-section";
import { InquiryForm } from "@/components/site/inquiry-form";
import { companyContact } from "@/data/site";
import { createMetadata } from "@/lib/metadata";
import { getProperties } from "@/lib/property-store";

export const metadata = createMetadata({
  title: "Contact",
  description: "Contact Maya Haven for consultations, global investor support, owner listing guidance, and trusted advisory services."
});

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const properties = await getProperties();

  return (
    <div className="pb-24 pt-32">
      <section className="site-shell grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5">
          <p className="quiet-label text-[var(--gold-strong)]">Speak With Us</p>
          <div className="rounded-[2rem] border border-black/6 bg-white/60 p-8">
            <InquiryForm />
          </div>
        </div>
        <div className="space-y-6">
          <div className="overflow-hidden rounded-[2rem]">
            <Image
              src={properties[3].coverImage}
              alt="Maya Haven contact imagery"
              width={1600}
              height={1200}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-[1.8rem] border border-black/6 bg-white/60 p-6">
              <p className="quiet-label text-[var(--gold-strong)]">Office</p>
              <p className="mt-4 font-display text-2xl">{companyContact.officeLabel}</p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">Private consultations by appointment, weekday and weekend concierge scheduling available.</p>
            </article>
            <article className="rounded-[1.8rem] border border-black/6 bg-white/60 p-6">
              <p className="quiet-label text-[var(--gold-strong)]">Email</p>
              <div className="mt-4 grid gap-2 text-base leading-7 sm:text-lg">
                <a href={`mailto:${companyContact.primaryEmail}`} className="font-medium text-foreground transition hover:text-[var(--gold-strong)]">
                  {companyContact.primaryEmail}
                </a>
                <a href={`mailto:${companyContact.secondaryEmail}`} className="font-medium text-foreground transition hover:text-[var(--gold-strong)]">
                  {companyContact.secondaryEmail}
                </a>
              </div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">Use email for consultation briefs, shortlist requests, and owner listing coordination.</p>
            </article>
            <article className="rounded-[1.8rem] border border-black/6 bg-white/60 p-6">
              <p className="quiet-label text-[var(--gold-strong)]">WhatsApp</p>
              <a
                href={companyContact.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="mt-4 block font-display text-2xl"
              >
                {companyContact.whatsappDisplay}
              </a>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">Use WhatsApp for fast viewing coordination, relocation help, and shortlist requests.</p>
            </article>
          </div>
          <div className="rounded-[2rem] border border-black/6 bg-[#12100f] p-8 text-white">
            <p className="quiet-label text-[var(--gold)]">Map Placeholder</p>
            <div className="mt-6 flex min-h-64 items-end rounded-[1.6rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(212,173,94,0.2))] p-6">
              <p className="max-w-md text-sm leading-7 text-white/65">
                Reserved for a branded interactive map showing office access, preferred consultation parking, and nearby luxury hospitality landmarks.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTASection primaryHref="/properties" primaryLabel="View Current Listings" secondaryHref="/list-with-us" secondaryLabel="List With Us" />
    </div>
  );
}
