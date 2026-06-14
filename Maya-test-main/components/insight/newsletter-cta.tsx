"use client";

import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In production, this would call your newsletter API
    setStatus("success");
    setEmail("");

    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <section className="overflow-hidden rounded-[1.8rem] border border-[var(--gold)]/20 bg-[#12100f] py-12 sm:py-16">
      <div className="site-shell">
        <div className="mx-auto max-w-2xl text-center">
          {/* Decorative Element */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gold)]/10">
              <svg
                className="h-6 w-6 text-[var(--gold)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <p className="quiet-label mb-3 text-[var(--gold)]">Newsletter</p>
          <h3 className="font-display text-2xl text-white sm:text-3xl">
            Stay Ahead of the Market
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            Receive monthly insights on Nairobi property trends, investment opportunities, and market intelligence delivered to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="mt-8">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={status === "loading" || status === "success"}
                className="flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-white placeholder:text-white/40 focus:border-[var(--gold)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#d4ad5e_0%,#b89041_100%)] px-6 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-[#12100f] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(212,173,94,0.3)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:px-8"
              >
                {status === "loading" ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#12100f]/30 border-t-[#12100f]" />
                ) : status === "success" ? (
                  <>
                    <Check className="h-4 w-4" />
                    Subscribed
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowUpRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            {status === "success" && (
              <p className="mt-3 text-xs text-[var(--gold)]">
                Thank you for subscribing. Check your inbox to confirm.
              </p>
            )}
          </form>

          <p className="mt-4 text-[10px] text-white/40">
            No spam. Unsubscribe anytime. Read our privacy policy.
          </p>
        </div>
      </div>
    </section>
  );
}
