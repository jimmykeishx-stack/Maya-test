import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-[#12100f] text-white">
      <div className="site-shell grid gap-10 py-14 md:grid-cols-[1.1fr_0.9fr_0.8fr]">
        <div className="space-y-5">
          <Image src="/media/brand/maya-haven-logo.jpeg" alt="Maya Haven logo" width={140} height={110} className="h-auto w-32" />
          <p className="max-w-md text-sm leading-7 text-white/60">
            Maya Haven helps clients find a property they can call home within Nairobi and beyond, while offering trusted investor consultation and management support.
          </p>
        </div>
        <div className="space-y-3">
          <p className="quiet-label text-[var(--gold)]">Explore</p>
          <div className="grid gap-2 text-sm text-white/70">
            <Link href="/">Home</Link>
            <Link href="/properties">Properties</Link>
            <Link href="/diaspora-connect">Diaspora Connect</Link>
            <Link href="/list-with-us">List With Us</Link>
            <Link href="/about">About</Link>
            <Link href="/insight">MAYA HAVEN INSIGHT</Link>
            <Link href="/events-gallery">Events & Gallery</Link>
          </div>
        </div>
        <div className="space-y-3">
          <p className="quiet-label text-[var(--gold)]">Connect</p>
          <div className="grid gap-2 text-sm text-white/70">
            <a href="tel:+254720584744">+254 720 584 744</a>
            <a href="mailto:private@mayahaven.co">private@mayahaven.co</a>
            <a href="https://wa.me/254720584744" target="_blank" rel="noreferrer">
              WhatsApp Concierge
            </a>
            <Link href="/terms">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
