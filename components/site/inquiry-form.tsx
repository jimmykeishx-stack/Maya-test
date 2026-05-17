"use client";

import { useState } from "react";

import { LuxuryButton } from "@/components/site/luxury-button";
import { LuxuryInput } from "@/components/site/luxury-input";
import { Textarea } from "@/components/ui/textarea";

export function InquiryForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
      className="space-y-5"
    >
      <LuxuryInput label="Full Name" placeholder="Your full name" />
      <LuxuryInput label="Email Address" type="email" placeholder="you@example.com" />
      <LuxuryInput label="Phone Number" placeholder="+254 720 584 744" />
      <label className="grid gap-3">
        <span className="text-sm font-medium text-foreground">How can we prepare for your viewing?</span>
        <Textarea placeholder="Share your ideal move timeline, family needs, or investment brief." />
      </label>
      <LuxuryButton type="submit" className="w-full" size="lg">
        Request Private Viewing
      </LuxuryButton>
      <p className="text-xs text-muted-foreground">
        Frontend preview only. Form submission is not connected to a backend yet.
      </p>
      {submitted ? <p className="text-sm text-[var(--gold-strong)]">Your inquiry has been staged in the UI preview.</p> : null}
    </form>
  );
}
