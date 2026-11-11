import "next-auth";

declare module "next-auth" {
  interface Session {
    user: { id: string; role: "USER" | "MANAGER" | "ADMIN" } & import("next-auth").DefaultSession["user"];
  }
}