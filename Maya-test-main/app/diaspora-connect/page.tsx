import { CheckCircle2, Globe2, Landmark, ShieldCheck, Video } from "lucide-react";

import { CTASection } from "@/components/site/cta-section";
import { SectionHeading } from "@/components/site/section-heading";
import { createMetadata } from "@/lib/metadata";
import { diasporaFaqs, diasporaProcess, serviceCards, virtualViewingFeatures } from "@/data/site";

export const metadata = createMetadata({
  title: "Diaspora Connect",
  description: "Trusted property consultation, sourcing, due diligence, virtual viewings, and management support for investors abroad."
});

const serviceIconMap = {
  search: Globe2,
  users: CheckCircle2,
  key: Landmark,
  message: ShieldCheck,
  shield: ShieldCheck,
  building: Video
};

export default function DiasporaConnectPage() {
  return (
    <div className="pb-24 pt-32">
      <section className="site-shell space-y-8">
        <SectionHeading
          eyebrow="Diaspora Connect"
          description="From first consultation to final handover, Maya Haven helps international property investors move with more clarity, cleaner verification, and stronger on-ground representation."
        />
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-black/6 bg-white/65 p-8">
            <p className="quiet-label text-[var(--gold-strong)]">What We Support</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {serviceCards.map((service) => {
                const Icon = serviceIconMap[service.icon as keyof typeof serviceIconMap] ?? ShieldCheck;
                return (
                  <article key={service.title} className="rounded-[1.4rem] border border-black/6 bg-white/70 p-5">
                    <Icon className="size-5 text-[var(--gold-strong)]" />
                    <h3 className="mt-4 font-display text-2xl">{service.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{service.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
          <div className="rounded-[2rem] border border-[rgba(212,173,94,0.2)] bg-[#12100f] p-8 text-white">
            <p className="quiet-label text-[var(--gold)]">Virtual Viewing Support</p>
            <h2 className="mt-4 font-display text-4xl leading-tight">See clearly before you travel or commit.</h2>
            <div className="mt-6 grid gap-4">
              {virtualViewingFeatures.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-[1.3rem] border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/75">
                  <Video className="mt-0.5 size-4 shrink-0 text-[var(--gold)]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="site-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="quiet-label text-[var(--gold-strong)]">Process</p>
          </div>
          <div className="grid gap-5">
            {diasporaProcess.map((item) => (
              <article key={item.step} className="rounded-[1.8rem] border border-black/6 bg-white/60 p-6">
                <p className="quiet-label text-[var(--gold-strong)]">{item.step}</p>
                <h3 className="mt-3 font-display text-2xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-[#12100f] text-white">
        <div className="site-shell space-y-8">
          <SectionHeading
            eyebrow="Trust & Due Diligence"
            className="max-w-4xl"
          />
          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-[1.8rem] border border-white/10 bg-white/5 p-7">
              <p className="quiet-label text-[var(--gold)]">Due Diligence</p>
              <p className="mt-4 font-display text-3xl leading-tight">Developer and owner vetting before serious commitment.</p>
            </article>
            <article className="rounded-[1.8rem] border border-white/10 bg-white/5 p-7">
              <p className="quiet-label text-[var(--gold)]">Completion Support</p>
              <p className="mt-4 font-display text-3xl leading-tight">Purchase guidance through the final mile, not only the shortlist stage.</p>
            </article>
            <article className="rounded-[1.8rem] border border-white/10 bg-white/5 p-7">
              <p className="quiet-label text-[var(--gold)]">Management Continuity</p>
              <p className="mt-4 font-display text-3xl leading-tight">Property management and professional referral support after acquisition.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="site-shell grid gap-6 sm:gap-7">
          <p className="quiet-label text-[var(--gold-strong)]">FAQ</p>
          {diasporaFaqs.map((item) => (
            <article key={item.question} className="rounded-[1.8rem] border border-black/6 bg-white/60 p-6 sm:p-7">
              <h3 className="font-display text-2xl leading-tight sm:text-[1.9rem]">{item.question}</h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-[0.98rem]">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <CTASection primaryHref="/contact" primaryLabel="SPEAK WITH US" secondaryHref="/properties" secondaryLabel="View Properties" />
    </div>
  );
}
