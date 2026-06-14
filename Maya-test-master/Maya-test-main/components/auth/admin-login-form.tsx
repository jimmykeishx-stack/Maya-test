"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

import { LuxuryButton } from "@/components/site/luxury-button";
import { Input } from "@/components/ui/input";

export function AdminLoginForm({ nextPath = "/admin" }: { nextPath?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const safeNextPath = nextPath.startsWith("/admin") && nextPath !== "/admin/login" ? nextPath : "/admin";

  return (
    <form
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
          const response = await fetch("/api/admin/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email,
              password
            })
          });

          const body = (await response.json().catch(() => null)) as { error?: string } | null;

          if (response.status === 403) {
            router.replace("/unauthorized");
            router.refresh();
            return;
          }

          if (!response.ok) {
            throw new Error(body?.error ?? "Unable to sign in.");
          }

          router.replace(safeNextPath);
          router.refresh();
        } catch (loginError) {
          setError(loginError instanceof Error ? loginError.message : "Unable to sign in.");
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

      <label className="grid gap-3">
        <span className="text-sm font-medium text-foreground">Password</span>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoComplete="current-password"
            className="px-11"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
            type={showPassword ? "text" : "password"}
            value={password}
          />
          <button
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
            onClick={() => setShowPassword((current) => !current)}
            type="button"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </label>

      <LuxuryButton className="w-full justify-center" disabled={isSubmitting} icon={!isSubmitting} size="lg" type="submit">
        {isSubmitting ? "Verifying..." : "Enter Admin"}
      </LuxuryButton>

      <Link className="block text-center text-sm text-muted-foreground transition hover:text-foreground" href="/admin/forgot-password">
        Forgot password?
      </Link>

      {error ? <p className="rounded-[1.2rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
    </form>
  );
}
