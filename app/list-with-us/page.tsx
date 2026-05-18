import Link from "next/link";

import { ListWithUsForm } from "@/components/site/list-with-us-form";
import { SectionHeading } from "@/components/site/section-heading";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "List With Us",
  description: "Submit your property to Maya Haven for review, subject to our terms and conditions."
});

export default function ListWithUsPage() {
  return (
    <div className="pb-24 pt-32">
      <section className="site-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <SectionHeading
            eyebrow="LIST WITH US"
            title="A dedicated owner workflow for sale and rental property submissions."
            description="Fill out our form and a member of our team will contact you for further details subject to our Terms & Conditions."
          />
          <p className="text-sm text-muted-foreground">
            By submitting, you confirm the information shared is accurate and acknowledge our{" "}
            <Link href="/terms" className="text-[var(--gold-strong)] underline underline-offset-4">
              Terms & Conditions
            </Link>
            .
          </p>
          <div className="rounded-[1.8rem] border border-black/6 bg-white/60 p-6">
            <p className="quiet-label text-[var(--gold-strong)]">Owner Guidance</p>
            <div className="mt-4 grid gap-4 text-sm leading-7 text-muted-foreground">
              <p>Use this workflow for sale and rental listings only. Buyer and tenant inquiries are managed separately through the contact flow.</p>
              <p>We recommend preparing clear pricing expectations, recent property imagery, ownership confirmation, and a realistic availability timeline before submission.</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/6 bg-white/60 p-6 sm:p-8">
          <ListWithUsForm />
        </div>
      </section>
    </div>
  );
}
