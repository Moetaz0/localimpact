import type { Prisma, Status } from "@prisma/client";

export type ReportSearchParams = {
  search?: string | string[];
  category?: string | string[];
  location?: string | string[];
  status?: string | string[];
};

export type ReportFilters = {
  search: string;
  categoryId: string;
  locationId: string;
  status?: Status;
};

export const STATUSES: Status[] = ["NEW", "TAKEN", "IN_PROGRESS", "RESOLVED"];

export function firstValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export function parseReportFilters(params: ReportSearchParams): ReportFilters {
  const statusValue = firstValue(params.status).trim();

  return {
    search: firstValue(params.search).trim().slice(0, 100),
    categoryId: firstValue(params.category).trim(),
    locationId: firstValue(params.location).trim(),
    status: STATUSES.includes(statusValue as Status)
      ? (statusValue as Status)
      : undefined,
  };
}

export function buildReportWhere(filters: ReportFilters): Prisma.ReportWhereInput {
  return {
    ...(filters.search
      ? {
          OR: [
            { title: { contains: filters.search, mode: "insensitive" } },
            { description: { contains: filters.search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
    ...(filters.locationId ? { locationId: filters.locationId } : {}),
    ...(filters.status ? { status: filters.status } : {}),
  };
}
