import { cookies } from "next/headers";
import { db, core } from "@/server/db";
import { eq } from "drizzle-orm";

export type AppRole = "admin" | "investor" | "client" | "operator" | "fiduciario" | "comite";

export type SessionUser = {
  id: string;
  email: string;
  role: AppRole;
  fullName: string;
};

function parseMock(raw?: string): SessionUser | null {
  if (!raw) return null;
  try {
    const user = JSON.parse(raw);
    const role = (user.app_metadata?.role || user.role || "investor") as AppRole;
    return {
      id: user.id,
      email: user.email,
      role,
      fullName: user.user_metadata?.full_name || user.email,
    };
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const mock = parseMock(jar.get("pachanova-mock-session")?.value);
  if (!mock?.email) return mock;

  try {
    const rows = await db
      .select()
      .from(core.profiles)
      .where(eq(core.profiles.email, mock.email))
      .limit(1);
    const profile = rows[0];
    if (profile) {
      return {
        id: profile.id,
        email: profile.email,
        role: profile.role,
        fullName: profile.fullName || mock.fullName,
      };
    }
  } catch {
    // DB optional at build time
  }
  return mock;
}

export function homeForRole(role: AppRole): string {
  if (role === "admin" || role === "operator") return "/dashboard/admin";
  if (role === "client") return "/dashboard/client";
  if (role === "fiduciario" || role === "comite") return "/dashboard/fideicomiso";
  return "/dashboard/investor";
}
