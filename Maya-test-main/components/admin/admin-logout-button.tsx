"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";

export function AdminLogoutButton() {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <button
      type="button"
      onClick={async () => {
        await logout();
        router.replace("/admin/login");
        router.refresh();
      }}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white/70 px-5 py-3 text-sm uppercase tracking-[0.18em] text-foreground transition hover:-translate-y-0.5"
    >
      <LogOut className="size-4" />
      Logout
    </button>
  );
}
