import { describe, expect, it } from "vitest";
import { buildReportWhere, parseReportFilters } from "./filters";

describe("report filters", () => {
  it("trims and limits search input and accepts a valid status", () => {
    const filters = parseReportFilters({
      search: `  ${"a".repeat(120)}  `,
      category: ["category-1"],
      location: " location-1 ",
      status: "IN_PROGRESS",
    });

    expect(filters).toEqual({
      search: "a".repeat(100),
      categoryId: "category-1",
      locationId: "location-1",
      status: "IN_PROGRESS",
    });
  });

  it("ignores an unknown status", () => {
    expect(parseReportFilters({ status: "UNKNOWN" }).status).toBeUndefined();
  });

  it("builds a where clause for every active filter", () => {
    expect(
      buildReportWhere({
        search: "lamp",
        categoryId: "category-1",
        locationId: "location-1",
        status: "NEW",
      }),
    ).toEqual({
      OR: [
        { title: { contains: "lamp", mode: "insensitive" } },
        { description: { contains: "lamp", mode: "insensitive" } },
      ],
      categoryId: "category-1",
      locationId: "location-1",
      status: "NEW",
    });
  });
});
