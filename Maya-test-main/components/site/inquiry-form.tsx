"use client";

import { useState } from "react";

import { companyContact } from "@/data/site";
import { LuxuryButton } from "@/components/site/luxury-button";
import { LuxuryInput } from "@/components/site/luxury-input";
import { Textarea } from "@/components/ui/textarea";

export function InquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    message: ""
  });

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setError("");
        setSubmitted(false);
        setIsSubmitting(true);

        try {
          const response = await fetch("/api/inquiries", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
          });

          if (!response.ok) {
            throw new Error("Unable to submit inquiry.");
          }

          setSubmitted(true);
          setFormData({
            fullName: "",
            email: "",
            phoneNumber: "",
            message: ""
          });
        } catch {
          setError("We could not save your inquiry just now. Please try again.");
        } finally {
          setIsSubmitting(false);
        }
      }}
      className="space-y-5"
    >
      <LuxuryInput
        label="Full Name"
        placeholder="Your full name"
        required
        value={formData.fullName}
        onChange={(event) => setFormData((current) => ({ ...current, fullName: event.target.value }))}
      />
      <LuxuryInput
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        required
        value={formData.email}
        onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
      />
      <LuxuryInput
        label="Phone Number"
        placeholder="+254 720 584 744"
        required
        value={formData.phoneNumber}
        onChange={(event) => setFormData((current) => ({ ...current, phoneNumber: event.target.value }))}
      />
      <label className="grid gap-3">
        <span className="text-sm font-medium text-foreground">How can we prepare for your viewing?</span>
        <Textarea
          placeholder="Share your ideal move timeline, family needs, or investment brief."
          required
          value={formData.message}
          onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))}
        />
      </label>
      <LuxuryButton type="submit" className="w-full" size="lg" icon={!isSubmitting} disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Speak With Us"}
      </LuxuryButton>
      {submitted ? <p className="text-sm text-[var(--gold-strong)]">Your inquiry has been received. A member of our team will reach out shortly.</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </form>
  );
}
