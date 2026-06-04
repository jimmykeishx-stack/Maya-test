"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";

import { LuxuryButton } from "@/components/site/luxury-button";
import { Input } from "@/components/ui/input";

export function AdminForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  return (
    <form
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setIsSubmitting(true);

        try {
          const response = await fetch("/api/admin/auth/forgot-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
          });

          const body = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;

          if (!response.ok) {
            throw new Error(body?.error ?? "Unable to send a reset link.");
          }

          setSuccess(body?.message ?? "If this email belongs to an administrator, a secure reset link has been sent.");
        } catch (resetError) {
          setError(resetError instanceof Error ? resetError.message : "Unable to send a reset link.");
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      <label className="grid gap-3">
        <span className="text-sm font-medium text-foreground">Admin Email</span>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoComplete="email"
            className="pl-11"
            inputMode="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@mayahaven.com"
            required
            type="email"
            value={email}
          />
        </div>
      </label>

      <LuxuryButton className="w-full justify-center" disabled={isSubmitting} icon={!isSubmitting} size="lg" type="submit">
        {isSubmitting ? "Sending..." : "Send Reset Link"}
      </LuxuryButton>

      <Link className="block text-center text-sm text-muted-foreground transition hover:text-foreground" href="/admin/login">
        Return to admin login
      </Link>

      {success ? <p className="rounded-[1.2rem] border border-[var(--gold-strong)]/20 bg-[var(--gold)]/10 px-4 py-3 text-sm text-foreground">{success}</p> : null}
      {error ? <p className="rounded-[1.2rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
    </form>
  );
}
