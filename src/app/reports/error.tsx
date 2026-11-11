"use client";

import { useEffect } from "react";

type ReportsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ReportsError({ error, reset }: ReportsErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-6 py-12">
      <section
        role="alert"
        className="w-full rounded-2xl border border-red-200 bg-red-50 p-8 text-center"
      >
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-700">
          Reports unavailable
        </p>
        <h1 className="mt-2 text-2xl font-black text-slate-950">
          We could not load the reports
        </h1>
        <p className="mt-3 text-slate-700">
          Please try again. If the problem continues, check the database connection.
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
