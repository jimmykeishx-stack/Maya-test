"use client";

import { useEffect, useState } from "react";

import { companyContact } from "@/data/site";
import { cn } from "@/lib/utils";

export function FloatingWhatsappButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-5 right-4 z-40 sm:bottom-6 sm:right-6">
      <a
        href={companyContact.whatsappHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Maya Haven on WhatsApp"
        className={cn(
          "pointer-events-auto group flex items-center gap-3 rounded-full border border-white/15 bg-[#1b9c5a] px-4 py-3 text-white shadow-[0_18px_45px_rgba(10,30,18,0.24)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(10,30,18,0.32)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
          "animate-[pulse_3.4s_ease-in-out_infinite]"
        )}
      >
        <span className="flex size-11 items-center justify-center rounded-full bg-white/12">
          <WhatsappMark className="size-5" />
        </span>
        <span className="hidden min-[440px]:grid">
          <span className="text-[0.68rem] uppercase tracking-[0.22em] text-white/78">WhatsApp</span>
          <span className="text-sm font-medium leading-5">Speak to a Property Advisor</span>
        </span>
      </a>
    </div>
  );
}

function WhatsappMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.05 2C6.57 2 2.1 6.47 2.1 11.95c0 1.75.46 3.46 1.34 4.97L2 22l5.22-1.37a9.9 9.9 0 0 0 4.73 1.2h.01c5.48 0 9.95-4.47 9.95-9.95a9.83 9.83 0 0 0-2.86-6.97Zm-7 15.24h-.01a8.28 8.28 0 0 1-4.22-1.15l-.3-.18-3.1.81.83-3.02-.2-.31a8.24 8.24 0 0 1-1.27-4.35c0-4.56 3.71-8.27 8.28-8.27 2.2 0 4.27.85 5.83 2.42a8.2 8.2 0 0 1 2.42 5.85c0 4.56-3.71 8.27-8.26 8.27Zm4.54-6.19c-.25-.13-1.47-.72-1.69-.8-.22-.08-.38-.13-.54.12-.16.25-.62.8-.76.96-.14.17-.28.19-.53.07-.25-.13-1.04-.38-1.98-1.22-.73-.64-1.22-1.43-1.36-1.68-.14-.25-.02-.38.1-.5.11-.11.25-.28.37-.42.12-.14.16-.25.25-.42.08-.17.04-.31-.02-.43-.07-.13-.54-1.3-.74-1.78-.2-.48-.4-.41-.54-.42h-.46c-.17 0-.43.06-.65.31-.22.25-.85.83-.85 2.01 0 1.18.87 2.32.99 2.48.12.17 1.71 2.61 4.15 3.66.58.25 1.04.4 1.39.51.58.18 1.11.15 1.53.09.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.22-.15-.47-.28Z" />
    </svg>
  );
}
