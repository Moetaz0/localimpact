export default function DashboardLoading() {
  return (
    <main aria-busy="true" aria-label="Loading dashboard" className="mx-auto min-h-screen w-full max-w-5xl px-6 py-12">
      <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-28 animate-pulse rounded-2xl bg-slate-100" />
        ))}
      </div>
    </main>
  );
}
