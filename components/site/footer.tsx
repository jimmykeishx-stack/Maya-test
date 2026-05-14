import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-[#12100f] text-white">
      <div className="site-shell grid gap-10 py-14 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div className="space-y-5">
          <Image src="/media/brand/maya-haven-logo.jpeg" alt="Maya Haven logo" width={140} height={110} className="h-auto w-32" />
          <p className="max-w-md text-sm leading-7 text-white/60">
            Maya Haven curates high-end Nairobi residences with a calm, editorial lens designed for discerning buyers, expats, and investment-led households.
          </p>
        </div>
        <div className="space-y-3">
          <p className="quiet-label text-[var(--gold)]">Explore</p>
          <div className="grid gap-2 text-sm text-white/70">
            <Link href="/">Home</Link>
            <Link href="/properties">Properties</Link>
            <Link href="/about">About</Link>
            <Link href="/leadership">Leadership</Link>
          </div>
        </div>
        <div className="space-y-3">
          <p className="quiet-label text-[var(--gold)]">Connect</p>
          <div className="grid gap-2 text-sm text-white/70">
            <a href="tel:+254700123456">+254 700 123 456</a>
            <a href="mailto:private@mayahaven.co">private@mayahaven.co</a>
            <a href="https://wa.me/254700123456" target="_blank" rel="noreferrer">
              WhatsApp Concierge
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
