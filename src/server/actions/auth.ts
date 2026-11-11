"use server";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { db } from "@/lib/db";
import { registerSchema, loginSchema } from "@/lib/validators";

const enc = encodeURIComponent;

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect(`/register?error=${enc(parsed.error.issues[0].message)}`);

  const { name, email, password } = parsed.data;
  if (await db.user.findUnique({ where: { email } })) {
    redirect(`/register?error=${enc("Email already used")}`);
  }

  // Always USER: roles are never chosen from the form.
  await db.user.create({
    data: { name, email, passwordHash: await bcrypt.hash(password, 10), role: "USER" },
  });
  await signIn("credentials", { email, password, redirectTo: "/reports" });
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect(`/login?error=${enc("Invalid credentials")}`);
  try {
    await signIn("credentials", { ...parsed.data, redirectTo: "/reports" });
  } catch (e) {
    if (e instanceof AuthError) redirect(`/login?error=${enc("Invalid credentials")}`);
    throw e; // a successful sign-in redirect must be re-thrown
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}