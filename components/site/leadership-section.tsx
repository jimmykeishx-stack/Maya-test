import Image from "next/image";

import { LuxuryButton } from "@/components/site/luxury-button";
import { founder } from "@/data/site";

export function LeadershipSection() {
  return (
    <section className="section-space">
      <div className="site-shell grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#151311]">
          <Image src={founder.portrait} alt={founder.name} width={900} height={1200} className="h-full w-full object-cover" />
        </div>
        <div className="space-y-6">
          <p className="quiet-label text-[var(--gold-strong)]">Leadership Preview</p>
          <h2 className="font-display text-4xl leading-tight text-balance md:text-5xl">
            Winnie Cherotich shapes Maya Haven with editorial restraint and uncompromising standards.
          </h2>
          <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">{founder.shortBio}</p>
          <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">{founder.story}</p>
          <LuxuryButton href="/leadership" size="lg">
            Meet The Founder
          </LuxuryButton>
        </div>
      </div>
    </section>
  );
}
