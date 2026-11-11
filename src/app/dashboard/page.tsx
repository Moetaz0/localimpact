import Link from "next/link";
import { db } from "@/lib/db";
import { STATUS_LABELS, STATUS_ORDER } from "@/lib/status-machine";
import { averageResolutionHours, countByStatus } from "@/lib/dashboard/metrics";
import { requireRole } from "@/server/permissions";

export const instant = false;

export default async function DashboardPage() {
  await requireRole("MANAGER", "ADMIN");

  const [statusGroups, categoryGroups, resolvedReports] = await Promise.all([
    db.report.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    db.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, _count: { select: { reports: true } } },
    }),
    db.report.findMany({
      where: { resolvedAt: { not: null } },
      select: { createdAt: true, resolvedAt: true },
    }),
  ]);

  const statusCounts = countByStatus(
    statusGroups.map((group) => ({ status: group.status, count: group._count._all })),
  );
  const averageHours = averageResolutionHours(resolvedReports);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-12">
      <header className="flex items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
            Local Impact
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Dashboard
          </h1>
          <p className="mt-2 text-slate-600">Overview of report volume and resolution.</p>
        </div>
        <Link
          href="/reports"
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700"
        >
          View reports
        </Link>
      </header>

      <section aria-labelledby="status-heading" className="mt-8">
        <h2 id="status-heading" className="text-xl font-bold text-slate-950">
          Reports by status
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATUS_ORDER.map((status) => (
            <article key={status} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-600">{STATUS_LABELS[status]}</p>
              <p className="mt-2 text-3xl font-black text-slate-950">{statusCounts[status]}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="category-heading" className="mt-8">
        <h2 id="category-heading" className="text-xl font-bold text-slate-950">
          Reports by category
        </h2>
        {categoryGroups.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
            No categories have been created yet.
          </p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categoryGroups.map((category) => (
              <li
                key={category.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
              >
                <span className="font-semibold text-slate-700">{category.name}</span>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
                  {category._count.reports}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="resolution-heading" className="mt-8">
        <h2 id="resolution-heading" className="text-xl font-bold text-slate-950">
          Resolution time
        </h2>
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-600">Average time to resolve</p>
          <p className="mt-2 text-3xl font-black text-slate-950">
            {averageHours === null ? "No resolved reports" : `${averageHours.toFixed(1)} hours`}
          </p>
        </div>
      </section>
    </main>
  );
}
