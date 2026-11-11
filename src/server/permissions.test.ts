import { beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.fn();
const redirect = vi.fn((path: string): never => {
  throw new Error(`REDIRECT:${path}`);
});

vi.mock("@/auth", () => ({ auth }));
vi.mock("next/navigation", () => ({ redirect }));

describe("requireUser", () => {
  beforeEach(() => {
    auth.mockReset();
    redirect.mockClear();
  });

  it("returns the authenticated user", async () => {
    const user = { id: "user-1", role: "USER", name: "Student" };
    auth.mockResolvedValue({ user });
    const { requireUser } = await import("./permissions");

    await expect(requireUser()).resolves.toEqual(user);
    expect(redirect).not.toHaveBeenCalled();
  });

  it("redirects unauthenticated users to login", async () => {
    auth.mockResolvedValue(null);
    const { requireUser } = await import("./permissions");

    await expect(requireUser()).rejects.toThrow("REDIRECT:/login");
    expect(redirect).toHaveBeenCalledWith("/login");
  });
});
