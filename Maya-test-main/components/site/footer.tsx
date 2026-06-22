import Image from "next/image";
import Link from "next/link";
import { AtSign, Facebook, Instagram } from "lucide-react";

import { companyContact } from "@/data/site";

const socialLinks = [
  {
    label: "Threads",
    href: "https://www.threads.com/@mayahaven_homes",
    icon: AtSign
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/mayahaven_homes",
    icon: Instagram
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/people/Maya-Haven-Real-Estate/61575810097788/",
    icon: Facebook
  }
] as const;

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
            <a href={`tel:${companyContact.whatsappDisplay.replace(/\s+/g, "")}`}>{companyContact.whatsappDisplay}</a>
            <a href={`mailto:${companyContact.primaryEmail}`}>{companyContact.primaryEmail}</a>
            <a href={`mailto:${companyContact.secondaryEmail}`}>{companyContact.secondaryEmail}</a>
            <a href={companyContact.whatsappHref} target="_blank" rel="noreferrer">
              WhatsApp Concierge
            </a>
            <Link href="/terms">Terms & Conditions</Link>
          </div>
          <div className="flex gap-3 pt-2">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  title={item.label}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:border-[var(--gold)]/45 hover:text-[var(--gold)]"
                >
                  <Icon className="size-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="site-shell py-5 text-center text-xs text-white/50">
          <a
            href="https://kibunjabuilds.co.ke/"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-[var(--gold)]"
          >
            Built and maintained by Kibunja Builds
          </a>
        </div>
      </div>
    </footer>
  );
}
