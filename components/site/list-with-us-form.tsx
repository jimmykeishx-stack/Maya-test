"use client";

import { useState } from "react";

import { LuxuryButton } from "@/components/site/luxury-button";
import { LuxuryInput } from "@/components/site/luxury-input";
import { Textarea } from "@/components/ui/textarea";

export function ListWithUsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    propertyType: "",
    location: "",
    listingType: "sale",
    expectedPrice: "",
    propertyDescription: "",
    ownershipConfirmed: false,
    image: null as File | null
  });

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setSubmitted(false);
        setError("");
        setIsSubmitting(true);

        try {
          const payload = new FormData();
          payload.append("fullName", formData.fullName);
          payload.append("phoneNumber", formData.phoneNumber);
          payload.append("email", formData.email);
          payload.append("propertyType", formData.propertyType);
          payload.append("location", formData.location);
          payload.append("listingType", formData.listingType);
          payload.append("expectedPrice", formData.expectedPrice);
          payload.append("propertyDescription", formData.propertyDescription);
          payload.append("ownershipConfirmed", String(formData.ownershipConfirmed));

          if (formData.image) {
            payload.append("image", formData.image);
          }

          const response = await fetch("/api/owner-listings", {
            method: "POST",
            body: payload
          });

          if (!response.ok) {
            throw new Error("Unable to submit owner listing.");
          }

          setSubmitted(true);
          setFormData({
            fullName: "",
            phoneNumber: "",
            email: "",
            propertyType: "",
            location: "",
            listingType: "sale",
            expectedPrice: "",
            propertyDescription: "",
            ownershipConfirmed: false,
            image: null
          });
        } catch {
          setError("We could not save your property submission just now. Please try again.");
        } finally {
          setIsSubmitting(false);
        }
      }}
      className="space-y-5"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <LuxuryInput
          label="Full Name"
          placeholder="Your full name"
          required
          value={formData.fullName}
          onChange={(event) => setFormData((current) => ({ ...current, fullName: event.target.value }))}
        />
        <LuxuryInput
          label="Phone Number"
          placeholder="+254 720 584 744"
          required
          value={formData.phoneNumber}
          onChange={(event) => setFormData((current) => ({ ...current, phoneNumber: event.target.value }))}
        />
        <LuxuryInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          required
          value={formData.email}
          onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
        />
        <LuxuryInput
          label="Property Type"
          placeholder="Apartment, office suite, townhouse..."
          required
          value={formData.propertyType}
          onChange={(event) => setFormData((current) => ({ ...current, propertyType: event.target.value }))}
        />
        <LuxuryInput
          label="Location"
          placeholder="Westlands, Karen, Upper Hill..."
          required
          value={formData.location}
          onChange={(event) => setFormData((current) => ({ ...current, location: event.target.value }))}
        />
        <label className="grid gap-3">
          <span className="text-sm font-medium text-foreground">Rent / Sale</span>
          <select
            value={formData.listingType}
            onChange={(event) => setFormData((current) => ({ ...current, listingType: event.target.value }))}
            required
            className="h-12 rounded-[1.2rem] border border-[rgba(42,39,34,0.12)] bg-white/70 px-4 text-sm outline-none transition focus:border-[rgba(212,173,94,0.55)]"
          >
            <option value="sale">Sale</option>
            <option value="rent">Rent</option>
          </select>
        </label>
      </div>

      <LuxuryInput
        label="Expected Price"
        placeholder="KES 18,500,000 or KES 180,000 per month"
        required
        value={formData.expectedPrice}
        onChange={(event) => setFormData((current) => ({ ...current, expectedPrice: event.target.value }))}
      />

      <label className="grid gap-3">
        <span className="text-sm font-medium text-foreground">Property Description</span>
        <Textarea
          placeholder="Share the property overview, current status, tenure details, amenities, and anything we should know before follow-up."
          required
          value={formData.propertyDescription}
          onChange={(event) => setFormData((current) => ({ ...current, propertyDescription: event.target.value }))}
        />
      </label>

      <label className="grid gap-3">
        <span className="text-sm font-medium text-foreground">Image Upload</span>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const image = event.target.files?.[0] ?? null;
            setFormData((current) => ({ ...current, image }));
          }}
          className="block w-full rounded-[1.2rem] border border-[rgba(42,39,34,0.12)] bg-white/70 px-4 py-3 text-sm"
        />
      </label>

      <label className="flex items-start gap-3 rounded-[1.2rem] border border-[rgba(42,39,34,0.08)] bg-white/55 px-4 py-4 text-sm text-muted-foreground">
        <input
          type="checkbox"
          required
          checked={formData.ownershipConfirmed}
          onChange={(event) => setFormData((current) => ({ ...current, ownershipConfirmed: event.target.checked }))}
          className="mt-1"
        />
        <span>I confirm that I am authorized to list this property and to share the supporting details above.</span>
      </label>

      <LuxuryButton type="submit" className="w-full" size="lg" icon={!isSubmitting} disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Property"}
      </LuxuryButton>

      {submitted ? <p className="text-sm text-[var(--gold-strong)]">Your property submission has been received for review.</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </form>
  );
}
