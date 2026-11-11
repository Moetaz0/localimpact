import { STATUS_LABELS, STATUS_ORDER, type Status } from "@/lib/status-machine";

/**
 * The signature element: a four-segment line, like a transit map.
 * Filled segments = steps reached. Turns green once resolved.
 */
export function StatusRail({ status, size = "sm" }: { status: Status; size?: "sm" | "lg" }) {
  const step = STATUS_ORDER.indexOf(status) + 1;
  const resolved = status === "RESOLVED";
  const fill = resolved ? "bg-[#0B7A4B]" : "bg-[#1F4FD8]";

  return (
    <div role="img" aria-label={`Status: ${STATUS_LABELS[status]}, step ${step} of ${STATUS_ORDER.length}`}>
      <div className="flex gap-1" aria-hidden="true">
        {STATUS_ORDER.map((s, i) => (
          <span key={s} className={`${size === "lg" ? "h-4" : "h-2"} flex-1 ${i < step ? fill : "bg-slate-300"}`} />
        ))}
      </div>
      {size === "lg" ? (
        <div className="mt-2 flex gap-1 text-sm" aria-hidden="true">
          {STATUS_ORDER.map((s, i) => (
            <span key={s} className={`flex-1 ${i + 1 === step ? "font-black" : "text-slate-600"}`}>
              {STATUS_LABELS[s]}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-1 text-sm font-bold" aria-hidden="true">{STATUS_LABELS[status]}</p>
      )}
    </div>
  );
}
