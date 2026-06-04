"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Heart, Menu } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { CurrencySwitcher } from "@/components/site/currency-switcher";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { companyContact } from "@/data/site";
import { useSavedListings } from "@/hooks/use-saved-listings";
import { cn } from "@/lib/utils";

const propertyLinks = [
  { href: "/properties/for-sale", label: "For Sale" },
  { href: "/properties/for-rent", label: "For Rent" },
  { href: "/properties/commercial", label: "Commercial" },
  { href: "/properties/affordable-housing", label: "Affordable Housing" }
];

const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/diaspora-connect", label: "Diaspora Connect" },
  { href: "/insight", label: "MAYA HAVEN INSIGHT" },
  { href: "/list-with-us", label: "List With Us" },
  { href: "/contact", label: "Contact" }
];

export function Navbar() {
  const pathname = usePathname();
  const { savedIds } = useSavedListings();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopPropertiesOpen, setDesktopPropertiesOpen] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDesktopPropertiesOpen(false);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const transparentHome = pathname === "/" && !scrolled;
  const isPropertiesRoute = pathname.startsWith("/properties");

  const desktopTextClass = useMemo(
    () => (transparentHome ? "text-white/78 hover:text-white" : "text-muted-foreground hover:text-foreground"),
    [transparentHome]
  );

  const closeMobileMenu = () => setMobileOpen(false);
  const openPropertiesMenu = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setDesktopPropertiesOpen(true);
  };
  const scheduleClosePropertiesMenu = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setDesktopPropertiesOpen(false);
    }, 140);
  };
  const closePropertiesMenuNow = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setDesktopPropertiesOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div
        className={cn(
          "mx-auto flex max-w-[1380px] items-center justify-between rounded-[1.75rem] border px-3 py-2.5 transition-all duration-300 sm:px-4 md:rounded-full md:px-6 md:py-3",
          transparentHome
            ? "border-white/10 bg-black/10 text-white backdrop-blur-md"
            : "border-[rgba(42,39,34,0.08)] bg-[rgba(255,250,243,0.84)] text-foreground shadow-[0_16px_50px_rgba(15,11,8,0.08)] backdrop-blur-xl"
        )}
      >
        <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <Image src="/media/brand/maya-haven-logo.jpeg" alt="Maya Haven" width={56} height={56} className="h-10 w-10 rounded-full object-cover sm:h-12 sm:w-12" />
          <div className="hidden min-[430px]:block">
            <p className="font-display text-base sm:text-lg">Maya Haven</p>
            <p className={cn("text-[10px] uppercase tracking-[0.32em]", transparentHome ? "text-white/65" : "text-muted-foreground")}>REAL ESTATE</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm xl:flex">
          <div
            className="relative -mx-3 px-3 py-3"
            onMouseEnter={openPropertiesMenu}
            onMouseLeave={scheduleClosePropertiesMenu}
            onFocusCapture={openPropertiesMenu}
            onBlurCapture={(event) => {
              const nextTarget = event.relatedTarget;
              if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
                scheduleClosePropertiesMenu();
              }
            }}
          >
            <button
              type="button"
              onClick={() => setDesktopPropertiesOpen((current) => !current)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  closePropertiesMenuNow();
                }
              }}
              aria-haspopup="menu"
              aria-expanded={desktopPropertiesOpen}
              aria-controls="desktop-properties-menu"
              className={cn("inline-flex items-center gap-2 transition-colors", isPropertiesRoute ? "text-[var(--gold-strong)]" : desktopTextClass)}
            >
              Properties
              <ChevronDown className={cn("size-4 transition-transform", desktopPropertiesOpen && "rotate-180")} />
            </button>
            {desktopPropertiesOpen ? (
              <div className="absolute left-0 top-full w-64 pt-3">
                <div
                  id="desktop-properties-menu"
                  role="menu"
                  className="rounded-[1.4rem] border border-black/8 bg-[rgba(255,250,243,0.97)] p-3 text-foreground shadow-[0_20px_55px_rgba(15,12,8,0.12)]"
                >
                  <div className="grid gap-1">
                    {propertyLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        role="menuitem"
                        onClick={closePropertiesMenuNow}
                        className={cn(
                          "rounded-[1rem] px-3 py-2 text-sm transition hover:bg-black/[0.04]",
                          pathname === link.href ? "text-[var(--gold-strong)]" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors",
                pathname === link.href ? "text-[var(--gold-strong)]" : desktopTextClass
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <CurrencySwitcher className={transparentHome ? "text-white" : "text-foreground"} />
          <Link
            href="/saved"
            className={cn(
              "relative rounded-full border p-2.5",
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
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant={transparentHome ? "secondary" : "outline"} size="icon" className="size-10 xl:hidden">
              <Menu className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Maya Haven</SheetTitle>
              <SheetDescription>Premium property guidance across Nairobi and beyond.</SheetDescription>
            </SheetHeader>

            <div className="grid gap-8 pt-6">
              <div className="grid gap-2">
                <p className="quiet-label text-white/45">Properties</p>
                {propertyLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={closeMobileMenu} className="text-lg text-white/75 transition hover:text-white">
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="grid gap-2">
                <p className="quiet-label text-white/45">Explore</p>
                {primaryLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={closeMobileMenu} className="text-lg text-white/75 transition hover:text-white">
                    {link.label}
                  </Link>
                ))}
                <Link href="/saved" onClick={closeMobileMenu} className="text-lg text-white/75 transition hover:text-white">
                  Saved Listings ({savedIds.length})
                </Link>
                <Link href="/events-gallery" onClick={closeMobileMenu} className="text-lg text-white/75 transition hover:text-white">
                  Events & Gallery
                </Link>
              </div>

              <div className="grid gap-2">
                <p className="quiet-label text-white/45">Connect</p>
                <a href={`mailto:${companyContact.primaryEmail}`} className="text-base text-white/75 transition hover:text-white">
                  {companyContact.primaryEmail}
                </a>
                <a href={`mailto:${companyContact.secondaryEmail}`} className="text-base text-white/75 transition hover:text-white">
                  {companyContact.secondaryEmail}
                </a>
                <a href={companyContact.whatsappHref} target="_blank" rel="noreferrer" className="text-base text-white/75 transition hover:text-white">
                  WhatsApp: {companyContact.whatsappDisplay}
                </a>
              </div>

              <CurrencySwitcher className="text-white" />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
