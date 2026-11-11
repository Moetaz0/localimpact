import { redirect } from "next/navigation";
import { auth } from "@/auth";

export type Role = "USER" | "MANAGER" | "ADMIN";
export type SessionUser = { id: string; role: Role; name?: string | null };

export async function requireUser(): Promise<SessionUser> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user as SessionUser;
}

export async function requireRole(...roles: Role[]): Promise<SessionUser> {
  const user = await requireUser();
  if (!roles.includes(user.role)) throw new Error("Forbidden");
  return user;
}