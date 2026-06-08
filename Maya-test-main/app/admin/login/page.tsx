import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/auth/admin-login-form";
import { getAdminSession } from "@/lib/auth/admin";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Admin Login",
  description: "Secure administrator access for Maya Haven property management."
});

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const safeNextPath = next?.startsWith("/admin") && next !== "/admin/login" ? next : "/admin";
  const session = await getAdminSession();

  if (session.isAdmin) {
    redirect(safeNextPath);
  }

  return (
    <div className="min-h-[86svh] pb-24 pt-32">
      <section className="site-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="space-y-5">
          <p className="quiet-label text-[var(--gold-strong)]">Secure Admin</p>
          <h1 className="font-display text-4xl leading-tight text-balance sm:text-5xl md:text-6xl">
            Private access for Maya Haven administrators.
          </h1>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base md:leading-8">
            Sign in with your approved administrator account to manage listings, media, and operational property workflows.
          </p>
          <div className="rounded-[1.8rem] border border-black/6 bg-white/60 p-6 text-sm leading-7 text-muted-foreground">
            Access is restricted to authenticated users whose email exists in the Maya Haven administrators table.
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/6 bg-white/70 p-6 shadow-[0_28px_90px_rgba(15,12,8,0.08)] sm:p-8">
          <div className="mb-8">
            <p className="quiet-label text-[var(--gold-strong)]">Administrator Login</p>
            <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">Verify your access.</h2>
          </div>
          <AdminLoginForm nextPath={safeNextPath} />
        </div>
      </section>
    </div>
  );
}
