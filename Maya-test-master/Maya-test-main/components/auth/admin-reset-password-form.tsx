"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

import { LuxuryButton } from "@/components/site/luxury-button";
import { Input } from "@/components/ui/input";

export function AdminResetPasswordForm({ code }: { code?: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const hasCode = Boolean(code);

  return (
    <form
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!code) {
          setError("This reset link is missing a secure recovery code. Please request a new reset link.");
          return;
        }

        setIsSubmitting(true);

        try {
          const response = await fetch("/api/admin/auth/reset-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              code,
              password
            })
          });

          const body = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;

          if (!response.ok) {
            throw new Error(body?.error ?? "Unable to reset your password.");
          }

          setSuccess(body?.message ?? "Password updated successfully.");
          setTimeout(() => {
            router.replace("/admin");
            router.refresh();
          }, 900);
        } catch (resetError) {
          setError(resetError instanceof Error ? resetError.message : "Unable to reset your password.");
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      {!hasCode ? (
        <p className="rounded-[1.2rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          This reset link is invalid or incomplete. Request a new secure reset link before setting a password.
        </p>
      ) : null}

      <label className="grid gap-3">
        <span className="text-sm font-medium text-foreground">New Password</span>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoComplete="new-password"
            className="px-11"
            disabled={!hasCode}
            minLength={8}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a secure password"
            required
            type={showPassword ? "text" : "password"}
            value={password}
          />
          <button
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!hasCode}
            onClick={() => setShowPassword((current) => !current)}
            type="button"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </label>

      <LuxuryButton className="w-full justify-center" disabled={!hasCode || isSubmitting} icon={!isSubmitting} size="lg" type="submit">
        {isSubmitting ? "Updating..." : "Update Password"}
      </LuxuryButton>

      <Link className="block text-center text-sm text-muted-foreground transition hover:text-foreground" href="/admin/login">
        Return to admin login
      </Link>

      {success ? <p className="rounded-[1.2rem] border border-[var(--gold-strong)]/20 bg-[var(--gold)]/10 px-4 py-3 text-sm text-foreground">{success}</p> : null}
      {error ? <p className="rounded-[1.2rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
    </form>
  );
}
