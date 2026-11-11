"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/server/permissions";
import { reportSchema } from "@/lib/validators";

const enc = encodeURIComponent;

function reportError(message: string): never {
  redirect(`/reports?error=${enc(message)}`);
}

export async function createReportAction(formData: FormData) {
  const user = await requireUser();
  const parsed = reportSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    reportError(parsed.error.issues[0]?.message ?? "Invalid report");
  }

  const [category, location] = await Promise.all([
    db.category.findUnique({ where: { id: parsed.data.categoryId }, select: { id: true } }),
    db.location.findUnique({ where: { id: parsed.data.locationId }, select: { id: true } }),
  ]);

  if (!category) reportError("Category not found");
  if (!location) reportError("Location not found");

  await db.report.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      photoUrl: parsed.data.photoUrl,
      categoryId: category.id,
      locationId: location.id,
      authorId: user.id,
    },
  });

  revalidatePath("/reports");
  redirect("/reports");
}
