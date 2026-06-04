"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit3, Search, Trash2 } from "lucide-react";

import { LuxuryButton } from "@/components/site/luxury-button";
import { Input } from "@/components/ui/input";
import type { AdminProperty, AdminPropertyListResult } from "@/types/admin-property";

type PropertiesTableProps = {
  result: AdminPropertyListResult;
  search: string;
};

function formatPrice(value: number, listingType: AdminProperty["listingType"]) {
  const formatted = new Intl.NumberFormat("en-KE", {
    maximumFractionDigits: 0
  }).format(value);

  return `KES ${formatted}${listingType === "rent" ? " / month" : ""}`;
}

function statusLabel(status: AdminProperty["status"]) {
  if (status === "sold") return "Sold";
  if (status === "rented") return "Rented";
  return "Available";
}

export function PropertiesTable({ result, search }: PropertiesTableProps) {
  const router = useRouter();
  const [query, setQuery] = useState(search);
  const [pendingDelete, setPendingDelete] = useState<AdminProperty | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function submitSearch() {
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    router.push(`/admin/properties${params.toString() ? `?${params}` : ""}`);
  }

  async function deleteProperty() {
    if (!pendingDelete) return;

    setError("");

    const response = await fetch(`/api/admin/properties/${pendingDelete.id}`, {
      method: "DELETE"
    });
    const body = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setError(body?.error ?? "Unable to delete property.");
      return;
    }

    setPendingDelete(null);
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-black/6 bg-white/65 p-5 sm:p-6">
        <form
          className="grid gap-3 md:grid-cols-[1fr_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            submitSearch();
          }}
        >
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, location, slug, or property type" className="pl-11" />
          </div>
          <LuxuryButton type="submit" icon={false} className="justify-center">
            Search
          </LuxuryButton>
        </form>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-black/6 bg-white/65">
        <div className="grid gap-px bg-black/6 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_0.7fr]">
          {["Property", "Price", "Location", "Status", "Actions"].map((heading) => (
            <div key={heading} className="hidden bg-white/80 px-5 py-4 text-xs uppercase tracking-[0.22em] text-muted-foreground lg:block">
              {heading}
            </div>
          ))}
          {result.properties.map((property) => (
            <article key={property.id} className="contents">
              <div className="bg-white/65 px-5 py-5">
                <div className="flex gap-4">
                  <div className="h-20 w-24 shrink-0 overflow-hidden rounded-[1rem] bg-black/5">
                    {property.coverImage ? <img src={property.coverImage} alt={property.title} className="h-full w-full object-cover" /> : null}
                  </div>
                  <div>
                    <p className="font-display text-2xl">{property.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{property.slug}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">{property.propertyType} / {property.listingType === "sale" ? "Sale" : "Rent"}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/65 px-5 py-5 text-sm text-muted-foreground lg:block">
                <span className="lg:hidden">Price: </span>
                {formatPrice(property.price, property.listingType)}
              </div>
              <div className="bg-white/65 px-5 py-5 text-sm text-muted-foreground">
                <span className="lg:hidden">Location: </span>
                {property.location}
              </div>
              <div className="bg-white/65 px-5 py-5 text-sm text-muted-foreground">
                <span className="rounded-full border border-black/8 bg-white/70 px-3 py-2 text-xs uppercase tracking-[0.16em]">{statusLabel(property.status)}</span>
              </div>
              <div className="bg-white/65 px-5 py-5">
                <div className="flex flex-wrap gap-2">
                  <Link href={`/admin/properties/${property.id}/edit`} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.16em]">
                    <Edit3 className="size-3.5" />
                    Edit
                  </Link>
                  <button type="button" onClick={() => setPendingDelete(property)} className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs uppercase tracking-[0.16em] text-red-700">
                    <Trash2 className="size-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {!result.properties.length ? (
          <div className="bg-white/65 px-6 py-12 text-center text-sm text-muted-foreground">No properties found.</div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing page {result.page} of {result.pageCount} / {result.count} total properties
        </p>
        <div className="flex gap-2">
          <LuxuryButton href={`/admin/properties?page=${Math.max(1, result.page - 1)}${search ? `&search=${encodeURIComponent(search)}` : ""}`} variant="outline" icon={false} className={result.page <= 1 ? "pointer-events-none opacity-40" : ""}>
            Previous
          </LuxuryButton>
          <LuxuryButton href={`/admin/properties?page=${Math.min(result.pageCount, result.page + 1)}${search ? `&search=${encodeURIComponent(search)}` : ""}`} variant="outline" icon={false} className={result.page >= result.pageCount ? "pointer-events-none opacity-40" : ""}>
            Next
          </LuxuryButton>
        </div>
      </div>

      {error ? <p className="rounded-[1.2rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      {pendingDelete ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[2rem] border border-white/15 bg-[#12100f] p-6 text-white shadow-2xl">
            <p className="quiet-label text-[var(--gold)]">Confirm Delete</p>
            <h2 className="mt-4 font-display text-3xl">Delete {pendingDelete.title}?</h2>
            <p className="mt-4 text-sm leading-7 text-white/68">
              This removes the property record and attempts to delete associated Supabase Storage images from the property-images bucket.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => void deleteProperty()} disabled={isPending} className="rounded-full bg-red-600 px-5 py-3 text-sm uppercase tracking-[0.18em] text-white disabled:opacity-50">
                {isPending ? "Deleting..." : "Delete Property"}
              </button>
              <button type="button" onClick={() => setPendingDelete(null)} className="rounded-full border border-white/15 px-5 py-3 text-sm uppercase tracking-[0.18em] text-white/80">
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
