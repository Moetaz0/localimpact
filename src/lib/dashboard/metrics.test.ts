import { describe, expect, it } from "vitest";
import { averageResolutionHours, countByStatus } from "./metrics";

describe("dashboard metrics", () => {
  it("calculates the average resolution time in hours", () => {
    const start = new Date("2026-01-01T00:00:00Z");

    expect(
      averageResolutionHours([
        { createdAt: start, resolvedAt: new Date("2026-01-01T10:00:00Z") },
        { createdAt: start, resolvedAt: new Date("2026-01-02T10:00:00Z") },
      ]),
    ).toBe(22);
  });

  it("returns null when no report has been resolved", () => {
    expect(averageResolutionHours([{ createdAt: new Date(), resolvedAt: null }])).toBeNull();
  });

  it("fills missing status groups with zero", () => {
    expect(countByStatus([{ status: "NEW", count: 3 }])).toEqual({
      NEW: 3,
      TAKEN: 0,
      IN_PROGRESS: 0,
      RESOLVED: 0,
    });
  });
});
