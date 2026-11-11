import { describe, expect, it } from "vitest";
import { reportSchema } from "./index";

const validReport = {
  title: "Broken lamp",
  description: "The lamp is not working in the reading room.",
  categoryId: "category-1",
  locationId: "location-1",
};

describe("reportSchema", () => {
  it("accepts a valid report and normalizes text", () => {
    const result = reportSchema.parse({
      ...validReport,
      title: "  Broken lamp  ",
      photoUrl: " ",
    });

    expect(result).toEqual(validReport);
  });

  it("rejects invalid photo protocols", () => {
    const result = reportSchema.safeParse({
      ...validReport,
      photoUrl: "javascript:alert(1)",
    });

    expect(result.success).toBe(false);
  });

  it("rejects missing required fields", () => {
    const result = reportSchema.safeParse({ title: "No" });

    expect(result.success).toBe(false);
  });
});
