import { AdminForgotPasswordForm } from "@/components/auth/admin-forgot-password-form";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Admin Password Reset",
  description: "Request a secure Maya Haven administrator password reset link."
});

export default function AdminForgotPasswordPage() {
  return (
    <div className="min-h-[86svh] pb-24 pt-32">
      <section className="site-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="space-y-5">
          <p className="quiet-label text-[var(--gold-strong)]">Password Recovery</p>
          <h1 className="font-display text-4xl leading-tight text-balance sm:text-5xl md:text-6xl">
            Restore secure administrator access.
          </h1>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base md:leading-8">
            Enter your administrator email address. If it belongs to an approved account, Supabase will send a private recovery link.
          </p>
        </div>

        <div className="rounded-[2rem] border border-black/6 bg-white/70 p-6 shadow-[0_28px_90px_rgba(15,12,8,0.08)] sm:p-8">
          <div className="mb-8">
            <p className="quiet-label text-[var(--gold-strong)]">Secure Reset</p>
            <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">Request a reset link.</h2>
          </div>
          <AdminForgotPasswordForm />
        </div>
      </section>
    </div>
  );
}
