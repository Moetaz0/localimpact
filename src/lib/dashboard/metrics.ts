import type { Status } from "@prisma/client";

export type ResolutionRecord = {
  createdAt: Date;
  resolvedAt: Date | null;
};

export function averageResolutionHours(records: ResolutionRecord[]): number | null {
  const resolved = records.filter((record): record is ResolutionRecord & { resolvedAt: Date } =>
    record.resolvedAt instanceof Date,
  );

  if (resolved.length === 0) return null;

  const totalHours = resolved.reduce(
    (total, record) =>
      total + (record.resolvedAt.getTime() - record.createdAt.getTime()) / 3_600_000,
    0,
  );

  return totalHours / resolved.length;
}

export function countByStatus(
  groups: Array<{ status: Status; count: number }>,
): Record<Status, number> {
  return groups.reduce(
    (counts, group) => ({ ...counts, [group.status]: group.count }),
    { NEW: 0, TAKEN: 0, IN_PROGRESS: 0, RESOLVED: 0 },
  );
}
