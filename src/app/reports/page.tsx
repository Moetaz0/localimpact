import Link from "next/link";
import { db } from "@/lib/db";
import {
  buildReportWhere,
  parseReportFilters,
  STATUSES,
} from "@/lib/reports/filters";
import { requireUser } from "@/server/permissions";

type ReportsPageProps = {
  searchParams: Promise<{
    search?: string | string[];
    category?: string | string[];
    location?: string | string[];
    status?: string | string[];
  }>;
};

const statusLabels: Record<(typeof STATUSES)[number], string> = {
  NEW: "New",
  TAKEN: "Taken",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
};

export const instant = false;

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  await requireUser();

  const params = await searchParams;
  const filters = parseReportFilters(params);

  const [reports, categories, locations] = await Promise.all([
    db.report.findMany({
      where: buildReportWhere(filters),
      include: {
        category: { select: { name: true } },
        location: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    db.location.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-12">
      <header className="flex items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
            Local Impact
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Reports
          </h1>
        </div>
        <Link
          href="/reports"
          className="rounded-full bg-blue-700 px-4 py-2 text-sm font-bold text-white"
        >
          Clear filters
        </Link>
      </header>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Find a report</h2>
        <form method="get" className="mt-4 grid gap-4 md:grid-cols-4">
          <label className="grid gap-2 text-sm font-semibold text-slate-700 md:col-span-2">
            Search
            <input
              name="search"
              type="search"
              defaultValue={filters.search}
              placeholder="Search title or description"
              maxLength={100}
              className="rounded-lg border border-slate-300 px-3 py-2 font-normal"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Category
            <select
              name="category"
              defaultValue={filters.categoryId}
              className="rounded-lg border border-slate-300 px-3 py-2 font-normal"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Location
            <select
              name="location"
              defaultValue={filters.locationId}
              className="rounded-lg border border-slate-300 px-3 py-2 font-normal"
            >
              <option value="">All locations</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Status
            <select
              name="status"
              defaultValue={filters.status ?? ""}
              className="rounded-lg border border-slate-300 px-3 py-2 font-normal"
            >
              <option value="">All statuses</option>
              {STATUSES.map((reportStatus) => (
                <option key={reportStatus} value={reportStatus}>
                  {statusLabels[reportStatus]}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end md:col-span-3">
            <button
              type="submit"
              className="rounded-full bg-blue-700 px-5 py-2.5 text-sm font-bold text-white"
            >
              Apply filters
            </button>
          </div>
        </form>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-950">
          {reports.length} {reports.length === 1 ? "report" : "reports"}
        </h2>

        {reports.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <h3 className="text-lg font-bold text-slate-950">No reports found</h3>
            <p className="mx-auto mt-2 max-w-md text-slate-600">
              Try changing your search or clearing one of the filters.
            </p>
          </div>
        ) : (
          <ul className="mt-4 grid gap-4">
            {reports.map((report) => (
              <li
                key={report.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">{report.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {report.category.name} · {report.location.name}
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    {statusLabels[report.status]}
                  </span>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-slate-700">
                  {report.description}
                </p>
                <p className="mt-4 text-xs text-slate-500">
                  Submitted {report.createdAt.toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
