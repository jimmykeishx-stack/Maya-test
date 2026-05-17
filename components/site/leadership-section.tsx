import { LuxuryButton } from "@/components/site/luxury-button";

export function LeadershipSection() {
  return (
    <section className="section-space">
      <div className="site-shell">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <p className="quiet-label text-[var(--gold-strong)]">Team Preview</p>
          <h2 className="font-display text-4xl leading-tight text-balance md:text-5xl">
            Meet the team behind the editorial eye, client care, and premium presentation.
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
            The team combines market awareness, presentation discipline, and a calm service rhythm designed for buyers who expect clarity and polish at every step.
          </p>
          <p className="mx-auto max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
            From shortlist curation to viewing coordination, the focus stays on thoughtful guidance, premium communication, and a more intentional property experience.
          </p>
          <LuxuryButton href="/leadership" size="lg">
            Meet The Team
          </LuxuryButton>
        </div>
      </div>
    </section>
  );
}
