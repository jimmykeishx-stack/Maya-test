"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useSavedListings } from "@/hooks/use-saved-listings";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/about", label: "About" },
  { href: "/leadership", label: "Leadership" },
  { href: "/contact", label: "Contact" }
];

export function Navbar() {
  const pathname = usePathname();
  const { savedIds } = useSavedListings();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparentHome = pathname === "/" && !scrolled;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <div
        className={cn(
          "mx-auto flex max-w-[1380px] items-center justify-between rounded-full border px-4 py-3 transition-all duration-300 md:px-6",
          transparentHome
            ? "border-white/10 bg-black/10 text-white backdrop-blur-md"
            : "border-[rgba(42,39,34,0.08)] bg-[rgba(255,250,243,0.78)] text-foreground shadow-[0_16px_50px_rgba(15,11,8,0.08)] backdrop-blur-xl"
        )}
      >
        <Link href="/" className="flex items-center gap-3">
          <Image src="/media/brand/maya-haven-logo.jpeg" alt="Maya Haven" width={56} height={56} className="h-12 w-12 rounded-full object-cover" />
          <div className="hidden min-[430px]:block">
            <p className="font-display text-lg">Maya Haven</p>
            <p className={cn("text-[10px] uppercase tracking-[0.32em]", transparentHome ? "text-white/65" : "text-muted-foreground")}>
              Real Estate
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors",
                pathname === link.href ? "text-[var(--gold-strong)]" : transparentHome ? "text-white/72 hover:text-white" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/saved"
            className={cn(
              "relative hidden rounded-full border p-3 md:flex",
              transparentHome ? "border-white/10 bg-white/5 text-white" : "border-[rgba(42,39,34,0.08)] bg-white/55 text-foreground"
            )}
          >
            <Heart className="size-4" />
            {savedIds.length ? (
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-[var(--gold-strong)] text-[10px] font-semibold text-black">
                {savedIds.length}
              </span>
            ) : null}
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant={transparentHome ? "secondary" : "outline"} size="icon" className="md:hidden">
                <Menu className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Maya Haven</SheetTitle>
                <SheetDescription>Luxury living, thoughtfully curated.</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 pt-6">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-lg text-white/75 transition hover:text-white">
                    {link.label}
                  </Link>
                ))}
                <Link href="/saved" className="text-lg text-white/75 transition hover:text-white">
                  Saved Listings ({savedIds.length})
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
