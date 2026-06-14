import { AdminResetPasswordForm } from "@/components/auth/admin-reset-password-form";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Set Admin Password",
  description: "Set a new secure Maya Haven administrator password."
});

export default async function AdminResetPasswordPage({
  searchParams
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  return (
    <div className="min-h-[86svh] pb-24 pt-32">
      <section className="site-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="space-y-5">
          <p className="quiet-label text-[var(--gold-strong)]">Set Password</p>
          <h1 className="font-display text-4xl leading-tight text-balance sm:text-5xl md:text-6xl">
            Create a new administrator password.
          </h1>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base md:leading-8">
            Use the secure recovery link from your email to set a new password. After the update, you will be returned to the protected admin area.
          </p>
        </div>

        <div className="rounded-[2rem] border border-black/6 bg-white/70 p-6 shadow-[0_28px_90px_rgba(15,12,8,0.08)] sm:p-8">
          <div className="mb-8">
            <p className="quiet-label text-[var(--gold-strong)]">New Credentials</p>
            <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">Update your password.</h2>
          </div>
          <AdminResetPasswordForm code={code} />
        </div>
      </section>
    </div>
  );
}
