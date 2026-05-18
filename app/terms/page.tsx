import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Terms & Conditions",
  description: "Basic terms and conditions for inquiries, property submissions, and client communication on Maya Haven."
});

export default function TermsPage() {
  return (
    <div className="pb-24 pt-32">
      <section className="site-shell max-w-4xl space-y-8">
        <div>
          <p className="quiet-label text-[var(--gold-strong)]">Terms & Conditions</p>
          <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">A simple framework for submissions, consultations, and communication.</h1>
        </div>
        <div className="grid gap-5">
          {[
            "Property submissions are reviewed before any engagement or publication decision is made.",
            "Maya Haven may request additional documentation to verify ownership, mandate authority, pricing, and listing readiness.",
            "Submitting a buyer or owner form does not automatically create a representation agreement or guarantee listing publication.",
            "Clients are responsible for ensuring the information they submit is accurate, lawful, and properly authorized.",
            "Professional referrals, legal review, and transaction completion are handled subject to separate engagement terms where applicable."
          ].map((item) => (
            <article key={item} className="rounded-[1.6rem] border border-black/6 bg-white/60 px-5 py-5 text-sm leading-7 text-muted-foreground">
              {item}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
