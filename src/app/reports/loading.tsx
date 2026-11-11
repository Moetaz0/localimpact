export default function ReportsLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading reports"
      className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-12"
    >
      <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="h-11 animate-pulse rounded-lg bg-slate-100 md:col-span-2" />
          <div className="h-11 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-11 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-11 animate-pulse rounded-lg bg-slate-100" />
        </div>
      </section>
      <section className="mt-8 grid gap-4">
        <div className="h-7 w-32 animate-pulse rounded bg-slate-200" />
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
          />
        ))}
      </section>
    </main>
  );
}
