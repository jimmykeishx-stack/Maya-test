"use client";

import { useState } from "react";
import { Check, Link2, Mail, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SocialShareProps {
  title: string;
  url: string;
}

export function SocialShare({ title, url }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title}\n\n${url}`)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`${title}\n\nRead more: ${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        Share
      </span>

      <div className="flex gap-2">
        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className={cn(
            "group flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300",
            copied
              ? "border-[var(--gold)]/50 bg-[var(--gold)]/10 text-[var(--gold)]"
              : "border-black/10 bg-white/70 text-muted-foreground hover:border-[var(--gold)]/30 hover:bg-[var(--gold)]/5 hover:text-[#12100f]"
          )}
          title="Copy link"
        >
          {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
        </button>

        {/* WhatsApp */}
        <button
          onClick={handleWhatsAppShare}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/70 text-muted-foreground transition-all duration-300 hover:border-green-500/30 hover:bg-green-50 hover:text-green-600"
          title="Share on WhatsApp"
        >
          <MessageCircle className="h-4 w-4" />
        </button>

        {/* Email */}
        <button
          onClick={handleEmailShare}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/70 text-muted-foreground transition-all duration-300 hover:border-[var(--gold)]/30 hover:bg-[var(--gold)]/5 hover:text-[#12100f]"
          title="Share via email"
        >
          <Mail className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
