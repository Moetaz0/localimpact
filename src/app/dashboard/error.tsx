"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl items-center px-6 py-12">
      <section role="alert" className="w-full rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <h1 className="text-2xl font-black text-slate-950">Dashboard unavailable</h1>
        <p className="mt-3 text-slate-700">
          You may not have access, or the dashboard data could not be loaded.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-full bg-red-700 px-5 py-2.5 text-sm font-bold text-white"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
