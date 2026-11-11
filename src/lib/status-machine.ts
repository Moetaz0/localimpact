export const STATUS_ORDER = ["NEW", "TAKEN", "IN_PROGRESS", "RESOLVED"] as const;

export type Status = (typeof STATUS_ORDER)[number];

export const STATUS_LABELS: Record<Status, string> = {
  NEW: "New",
  TAKEN: "Taken",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
};