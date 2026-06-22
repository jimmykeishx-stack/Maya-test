"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit3, Search, Trash2 } from "lucide-react";

import { LuxuryButton } from "@/components/site/luxury-button";
import { Input } from "@/components/ui/input";
import type { EventGalleryItem, EventGalleryListResult } from "@/types/admin-event-gallery";

type EventsGalleryTableProps = {
  result: EventGalleryListResult;
  search: string;
};

function statusBadge(status: EventGalleryItem["status"]) {
  const styles: Record<EventGalleryItem["status"], string> = {
    published: "border-green-200 bg-green-50 text-green-800",
    draft: "border-yellow-200 bg-yellow-50 text-yellow-800",
    archived: "border-black/8 bg-black/5 text-muted-foreground"
  };
  return `rounded-full border px-3 py-2 text-xs uppercase tracking-[0.16em] ${styles[status]}`;
}

function formatDate(iso: string | null) {
  if (!iso) return "-";

  return new Intl.DateTimeFormat("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(iso));
}

export function EventsGalleryTable({ result, search }: EventsGalleryTableProps) {
  const router = useRouter();
  const [query, setQuery] = useState(search);
  const [pendingDelete, setPendingDelete] = useState<EventGalleryItem | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function submitSearch() {
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    router.push(`/admin/events-gallery${params.toString() ? `?${params}` : ""}`);
  }

  async function deleteItem() {
    if (!pendingDelete) return;
    setError("");

    const response = await fetch(`/api/admin/events-gallery/${pendingDelete.id}`, {
      method: "DELETE"
    });
    const body = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setError(body?.error ?? "Unable to delete event/gallery item.");
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
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title or category"
              className="pl-11"
            />
          </div>
          <LuxuryButton type="submit" icon={false} className="justify-center">
            Search
          </LuxuryButton>
        </form>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-black/6 bg-white/65">
        <div className="grid gap-px bg-black/6 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.7fr_0.8fr]">
          {["Item", "Category", "Status", "Date", "Actions"].map((heading) => (
            <div
              key={heading}
              className="hidden bg-white/80 px-5 py-4 text-xs uppercase tracking-[0.22em] text-muted-foreground lg:block"
            >
              {heading}
            </div>
          ))}

          {result.items.map((item) => (
            <article key={item.id} className="contents">
              <div className="bg-white/65 px-5 py-5">
                <div className="flex gap-4">
                  <div className="h-16 w-20 shrink-0 overflow-hidden rounded-[0.9rem] bg-black/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="font-display text-xl leading-tight">{item.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Sort order: {item.sortOrder}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/65 px-5 py-5 text-sm text-muted-foreground">
                <span className="lg:hidden">Category: </span>
                {item.category}
              </div>
              <div className="bg-white/65 px-5 py-5">
                <span className={statusBadge(item.status)}>{item.status}</span>
              </div>
              <div className="bg-white/65 px-5 py-5 text-sm text-muted-foreground">
                <span className="lg:hidden">Date: </span>
                {formatDate(item.eventDate)}
              </div>
              <div className="bg-white/65 px-5 py-5">
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/events-gallery/${item.id}/edit`}
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.16em]"
                  >
                    <Edit3 className="size-3.5" />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(item)}
                    className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs uppercase tracking-[0.16em] text-red-700"
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {!result.items.length ? (
          <div className="bg-white/65 px-6 py-12 text-center text-sm text-muted-foreground">
            No event/gallery items found.
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing page {result.page} of {result.pageCount} / {result.count} total items
        </p>
        <div className="flex gap-2">
          <LuxuryButton
            href={`/admin/events-gallery?page=${Math.max(1, result.page - 1)}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
            variant="outline"
            icon={false}
            className={result.page <= 1 ? "pointer-events-none opacity-40" : ""}
          >
            Previous
          </LuxuryButton>
          <LuxuryButton
            href={`/admin/events-gallery?page=${Math.min(result.pageCount, result.page + 1)}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
            variant="outline"
            icon={false}
            className={result.page >= result.pageCount ? "pointer-events-none opacity-40" : ""}
          >
            Next
          </LuxuryButton>
        </div>
      </div>

      {error ? (
        <p className="rounded-[1.2rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {pendingDelete ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[2rem] border border-white/15 bg-[#12100f] p-6 text-white shadow-2xl">
            <p className="quiet-label text-[var(--gold)]">Confirm Delete</p>
            <h2 className="mt-4 font-display text-3xl">Delete &ldquo;{pendingDelete.title}&rdquo;?</h2>
            <p className="mt-4 text-sm leading-7 text-white/68">
              This permanently removes the event/gallery item from the database.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => void deleteItem()}
                disabled={isPending}
                className="rounded-full bg-red-600 px-5 py-3 text-sm uppercase tracking-[0.18em] text-white disabled:opacity-50"
              >
                {isPending ? "Deleting..." : "Delete Item"}
              </button>
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="rounded-full border border-white/15 px-5 py-3 text-sm uppercase tracking-[0.18em] text-white/80"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
