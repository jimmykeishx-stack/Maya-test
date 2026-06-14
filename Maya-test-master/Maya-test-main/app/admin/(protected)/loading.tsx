export default function AdminLoading() {
  return (
    <div className="min-h-[70svh] pb-24 pt-32">
      <section className="site-shell">
        <div className="rounded-[2rem] border border-black/6 bg-white/65 p-8 shadow-[0_28px_90px_rgba(15,12,8,0.08)]">
          <p className="quiet-label text-[var(--gold-strong)]">Verifying Access</p>
          <div className="mt-6 h-10 w-2/3 animate-pulse rounded-full bg-black/8" />
          <div className="mt-5 h-4 w-1/2 animate-pulse rounded-full bg-black/6" />
          <div className="mt-3 h-4 w-1/3 animate-pulse rounded-full bg-black/6" />
        </div>
      </section>
    </div>
  );
}
