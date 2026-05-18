"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import { LuxuryButton } from "@/components/site/luxury-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  propertyLocations,
  propertyTypes,
  type Property
} from "@/data/properties";

type AdminPropertyManagerProps = {
  initialProperties: Property[];
};

type PropertyFormState = {
  id: string;
  slug: string;
  title: string;
  location: string;
  type: string;
  listingType: "sale" | "rent";
  segment: "residential" | "commercial" | "affordable-housing";
  marketStatus: "available" | "sold" | "rented" | "archived";
  mandateType: "exclusive" | "open";
  price: string;
  priceSuffix: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  highlight: string;
  blurb: string;
  description: string;
  coverImage: string;
  galleryText: string;
  amenitiesText: string;
  featuresText: string;
  agentNote: string;
  youtubeVideoId: string;
};

const emptyState: PropertyFormState = {
  id: "",
  slug: "",
  title: "",
  location: propertyLocations[1],
  type: propertyTypes[1],
  listingType: "sale",
  segment: "residential",
  marketStatus: "available",
  mandateType: "open",
  price: "",
  priceSuffix: "",
  bedrooms: "",
  bathrooms: "",
  sqft: "",
  highlight: "",
  blurb: "",
  description: "",
  coverImage: "",
  galleryText: "",
  amenitiesText: "",
  featuresText: "",
  agentNote: "",
  youtubeVideoId: ""
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function propertyToFormState(property: Property): PropertyFormState {
  return {
    id: property.id,
    slug: property.slug,
    title: property.title,
    location: property.location,
    type: property.type,
    listingType: property.listingType,
    segment: property.segment,
    marketStatus: property.marketStatus,
    mandateType: property.mandateType,
    price: String(property.price),
    priceSuffix: property.priceSuffix ?? "",
    bedrooms: property.bedrooms === null ? "" : String(property.bedrooms),
    bathrooms: property.bathrooms === null ? "" : String(property.bathrooms),
    sqft: String(property.sqft),
    highlight: property.highlight,
    blurb: property.blurb,
    description: property.description,
    coverImage: property.coverImage,
    galleryText: property.gallery.join(", "),
    amenitiesText: property.amenities.join(", "),
    featuresText: property.features.join(", "),
    agentNote: property.agentNote,
    youtubeVideoId: property.youtubeVideoId ?? ""
  };
}

function buildMetrics(form: PropertyFormState) {
  const metrics = [];

  if (form.bedrooms.trim()) {
    metrics.push({ label: "Bedrooms", value: form.bedrooms.trim() });
  }

  if (form.bathrooms.trim()) {
    metrics.push({ label: "Bathrooms", value: form.bathrooms.trim() });
  }

  metrics.push({ label: "Footprint", value: `${Number(form.sqft || 0).toLocaleString()} sqft` });

  return metrics;
}

function formStateToProperty(form: PropertyFormState): Property {
  const cleanedSlug = slugify(form.slug || form.title);
  const id = form.id || `managed-${cleanedSlug || Date.now()}`;
  const gallery = form.galleryText
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    id,
    slug: cleanedSlug,
    title: form.title,
    location: form.location as Property["location"],
    type: form.type as Property["type"],
    listingType: form.listingType,
    segment: form.segment,
    marketStatus: form.marketStatus,
    mandateType: form.mandateType,
    price: Number(form.price),
    priceSuffix: form.priceSuffix || undefined,
    bedrooms: form.bedrooms.trim() ? Number(form.bedrooms) : null,
    bathrooms: form.bathrooms.trim() ? Number(form.bathrooms) : null,
    sqft: Number(form.sqft),
    highlight: form.highlight,
    blurb: form.blurb,
    description: form.description,
    metrics: buildMetrics(form),
    coverImage: form.coverImage,
    gallery: gallery.length ? gallery : [form.coverImage],
    amenities: form.amenitiesText.split(",").map((item) => item.trim()).filter(Boolean),
    features: form.featuresText.split(",").map((item) => item.trim()).filter(Boolean),
    agentNote: form.agentNote,
    youtubeVideoId: form.youtubeVideoId || undefined
  };
}

export function AdminPropertyManager({ initialProperties }: AdminPropertyManagerProps) {
  const [properties, setProperties] = useState(initialProperties);
  const [formState, setFormState] = useState<PropertyFormState>(emptyState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const sortedProperties = useMemo(
    () => [...properties].sort((a, b) => a.title.localeCompare(b.title)),
    [properties]
  );

  function resetForm() {
    setFormState(emptyState);
    setEditingId(null);
  }

  async function submitProperty() {
    const payload = formStateToProperty(formState);
    const endpoint = editingId ? `/api/properties/${editingId}` : "/api/properties";
    const method = editingId ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Unable to save property.");
    }

    const data = (await response.json()) as { property: Property };

    setProperties((current) => {
      const withoutCurrent = current.filter((item) => item.id !== data.property.id);
      return [data.property, ...withoutCurrent];
    });

    setSuccess(editingId ? "Property updated successfully." : "Property uploaded successfully.");
    resetForm();
  }

  async function removeProperty(id: string) {
    const confirmed = window.confirm("Delete this property from the managed property list?");
    if (!confirmed) return;

    setError("");
    setSuccess("");

    const response = await fetch(`/api/properties/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      setError("Unable to delete property.");
      return;
    }

    setProperties((current) => current.filter((item) => item.id !== id));
    if (editingId === id) {
      resetForm();
    }
    setSuccess("Property deleted successfully.");
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-black/6 bg-white/60 p-6 sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="quiet-label text-[var(--gold-strong)]">Property Controls</p>
            <h2 className="mt-4 font-display text-4xl leading-tight">Upload, edit, and delete managed properties.</h2>
          </div>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-black/10 bg-white/70 px-5 py-3 text-sm uppercase tracking-[0.18em] text-foreground"
            >
              Cancel Edit
            </button>
          ) : null}
        </div>

        <form
          className="mt-8 grid gap-5"
          onSubmit={async (event) => {
            event.preventDefault();
            setIsSubmitting(true);
            setError("");
            setSuccess("");

            try {
              await submitProperty();
            } catch {
              setError("We could not save the property right now.");
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <AdminField label="Title">
              <Input
                required
                value={formState.title}
                onChange={(event) => setFormState((current) => ({ ...current, title: event.target.value }))}
                placeholder="Listing title"
              />
            </AdminField>
            <AdminField label="Slug">
              <Input
                required
                value={formState.slug}
                onChange={(event) => setFormState((current) => ({ ...current, slug: event.target.value }))}
                placeholder="listing-slug"
              />
            </AdminField>
            <AdminField label="Location">
              <select
                value={formState.location}
                onChange={(event) => setFormState((current) => ({ ...current, location: event.target.value }))}
                className="h-12 rounded-[1.2rem] border border-[rgba(42,39,34,0.12)] bg-white/70 px-4 text-sm outline-none"
              >
                {propertyLocations.slice(1).map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </AdminField>
            <AdminField label="Property Type">
              <select
                value={formState.type}
                onChange={(event) => setFormState((current) => ({ ...current, type: event.target.value }))}
                className="h-12 rounded-[1.2rem] border border-[rgba(42,39,34,0.12)] bg-white/70 px-4 text-sm outline-none"
              >
                {propertyTypes.slice(1).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </AdminField>
            <AdminField label="Listing Type">
              <select
                value={formState.listingType}
                onChange={(event) => setFormState((current) => ({ ...current, listingType: event.target.value as "sale" | "rent" }))}
                className="h-12 rounded-[1.2rem] border border-[rgba(42,39,34,0.12)] bg-white/70 px-4 text-sm outline-none"
              >
                <option value="sale">Sale</option>
                <option value="rent">Rent</option>
              </select>
            </AdminField>
            <AdminField label="Category">
              <select
                value={formState.segment}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    segment: event.target.value as "residential" | "commercial" | "affordable-housing"
                  }))
                }
                className="h-12 rounded-[1.2rem] border border-[rgba(42,39,34,0.12)] bg-white/70 px-4 text-sm outline-none"
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="affordable-housing">Affordable Housing</option>
              </select>
            </AdminField>
            <AdminField label="Market Status">
              <select
                value={formState.marketStatus}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    marketStatus: event.target.value as "available" | "sold" | "rented" | "archived"
                  }))
                }
                className="h-12 rounded-[1.2rem] border border-[rgba(42,39,34,0.12)] bg-white/70 px-4 text-sm outline-none"
              >
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
                <option value="archived">Archived</option>
              </select>
            </AdminField>
            <AdminField label="Mandate">
              <select
                value={formState.mandateType}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, mandateType: event.target.value as "exclusive" | "open" }))
                }
                className="h-12 rounded-[1.2rem] border border-[rgba(42,39,34,0.12)] bg-white/70 px-4 text-sm outline-none"
              >
                <option value="open">Open</option>
                <option value="exclusive">Exclusive</option>
              </select>
            </AdminField>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            <AdminField label="Price">
              <Input
                required
                type="number"
                value={formState.price}
                onChange={(event) => setFormState((current) => ({ ...current, price: event.target.value }))}
                placeholder="145000000"
              />
            </AdminField>
            <AdminField label="Price Suffix">
              <Input
                value={formState.priceSuffix}
                onChange={(event) => setFormState((current) => ({ ...current, priceSuffix: event.target.value }))}
                placeholder="asking / per month"
              />
            </AdminField>
            <AdminField label="Bedrooms">
              <Input
                type="number"
                value={formState.bedrooms}
                onChange={(event) => setFormState((current) => ({ ...current, bedrooms: event.target.value }))}
                placeholder="3"
              />
            </AdminField>
            <AdminField label="Bathrooms">
              <Input
                type="number"
                value={formState.bathrooms}
                onChange={(event) => setFormState((current) => ({ ...current, bathrooms: event.target.value }))}
                placeholder="2"
              />
            </AdminField>
            <AdminField label="Square Footage">
              <Input
                required
                type="number"
                value={formState.sqft}
                onChange={(event) => setFormState((current) => ({ ...current, sqft: event.target.value }))}
                placeholder="2400"
              />
            </AdminField>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <AdminField label="Highlight">
              <Input
                required
                value={formState.highlight}
                onChange={(event) => setFormState((current) => ({ ...current, highlight: event.target.value }))}
                placeholder="Main selling point"
              />
            </AdminField>
            <AdminField label="Cover Image URL">
              <Input
                required
                value={formState.coverImage}
                onChange={(event) => setFormState((current) => ({ ...current, coverImage: event.target.value }))}
                placeholder="https://..."
              />
            </AdminField>
          </div>

          <AdminField label="Short Blurb">
            <Textarea
              required
              value={formState.blurb}
              onChange={(event) => setFormState((current) => ({ ...current, blurb: event.target.value }))}
              placeholder="Short card description"
            />
          </AdminField>

          <AdminField label="Description">
            <Textarea
              required
              value={formState.description}
              onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))}
              placeholder="Full property description"
            />
          </AdminField>

          <div className="grid gap-5 md:grid-cols-2">
            <AdminField label="Gallery URLs">
              <Textarea
                value={formState.galleryText}
                onChange={(event) => setFormState((current) => ({ ...current, galleryText: event.target.value }))}
                placeholder="Comma-separated image URLs"
              />
            </AdminField>
            <AdminField label="Amenities">
              <Textarea
                value={formState.amenitiesText}
                onChange={(event) => setFormState((current) => ({ ...current, amenitiesText: event.target.value }))}
                placeholder="Comma-separated amenities"
              />
            </AdminField>
            <AdminField label="Features">
              <Textarea
                value={formState.featuresText}
                onChange={(event) => setFormState((current) => ({ ...current, featuresText: event.target.value }))}
                placeholder="Comma-separated features"
              />
            </AdminField>
            <AdminField label="YouTube Video ID">
              <Input
                value={formState.youtubeVideoId}
                onChange={(event) => setFormState((current) => ({ ...current, youtubeVideoId: event.target.value }))}
                placeholder="YouTube video id"
              />
            </AdminField>
          </div>

          <AdminField label="Agent Note">
            <Textarea
              required
              value={formState.agentNote}
              onChange={(event) => setFormState((current) => ({ ...current, agentNote: event.target.value }))}
              placeholder="Internal/public advisory note"
            />
          </AdminField>

          <div className="flex flex-col gap-3 sm:flex-row">
            <LuxuryButton type="submit" size="lg" className="w-full justify-center sm:w-auto" icon={!isSubmitting}>
              {isSubmitting ? "Saving..." : editingId ? "Update Property" : "Upload Property"}
            </LuxuryButton>
          </div>

          {success ? <p className="text-sm text-[var(--gold-strong)]">{success}</p> : null}
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </form>
      </div>

      <div className="grid gap-4">
        {sortedProperties.map((property) => (
          <article key={property.id} className="rounded-[1.8rem] border border-black/6 bg-white/60 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <p className="font-display text-3xl">{property.title}</p>
                <p className="text-sm text-muted-foreground">
                  {property.location} • {property.listingType === "sale" ? "Sale" : "Rent"} • {property.segment} • {property.marketStatus}
                </p>
                <p className="text-sm text-muted-foreground">{property.slug}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(property.id);
                    setFormState(propertyToFormState(property));
                    setSuccess("");
                    setError("");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="rounded-full border border-black/10 bg-white/70 px-5 py-3 text-sm uppercase tracking-[0.18em] text-foreground"
                >
                  Edit Property
                </button>
                <button
                  type="button"
                  onClick={() => void removeProperty(property.id)}
                  className="rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm uppercase tracking-[0.18em] text-red-700"
                >
                  Delete Property
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function AdminField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-3">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}
