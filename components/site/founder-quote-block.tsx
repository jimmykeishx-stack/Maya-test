import { founder } from "@/data/site";

export function FounderQuoteBlock() {
  return (
    <div className="rounded-[2rem] border border-[rgba(212,173,94,0.2)] bg-[#12100f] p-8 text-white shadow-[0_28px_90px_rgba(0,0,0,0.22)] md:p-12">
      <p className="quiet-label text-[var(--gold)]">Signature Perspective</p>
      <blockquote className="mt-4 font-display text-3xl leading-tight text-balance md:text-5xl">
        “{founder.philosophy}”
      </blockquote>
      <p className="mt-6 text-sm uppercase tracking-[0.28em] text-white/55">{founder.name} • {founder.role}</p>
    </div>
  );
}
