import { LuxuryButton } from "@/components/site/luxury-button";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Access Denied",
  description: "This Maya Haven area is restricted to authorized administrators."
});

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[86svh] pb-24 pt-32">
      <section className="site-shell">
        <div className="mx-auto max-w-3xl rounded-[2.4rem] border border-black/6 bg-white/70 p-8 text-center shadow-[0_28px_90px_rgba(15,12,8,0.08)] sm:p-12">
          <p className="quiet-label text-[var(--gold-strong)]">Access Denied</p>
          <h1 className="mt-5 font-display text-4xl leading-tight text-balance sm:text-5xl">
            This area is reserved for authorized Maya Haven administrators.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
            Your account is authenticated, but it has not been granted administrator access. Please contact the Maya Haven owner if you believe this is incorrect.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <LuxuryButton href="/admin/login" className="justify-center">
              Try Another Account
            </LuxuryButton>
            <LuxuryButton href="/" variant="outline" className="justify-center">
              Return Home
            </LuxuryButton>
          </div>
        </div>
      </section>
    </div>
  );
}
