import { cookies } from "next/headers";
import { db, core } from "./db";
import { eq } from "drizzle-orm";

export type Role = "admin" | "investor" | "client" | "operator";

export type Session = {
  id: string;
  email: string;
  role: Role;
  name: string;
};

const COOKIE = "pn-session";

export function homeFor(role: Role) {
  if (role === "admin" || role === "operator") return "/admin/proyectos";
  if (role === "client") return "/cliente";
  return "/inversor";
}

export function isStaff(role?: Role | null) {
  return role === "admin" || role === "operator";
}

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Session;
    const [profile] = await db.select().from(core.profiles).where(eq(core.profiles.email, parsed.email)).limit(1);
    if (!profile) return parsed;
    return {
      id: profile.id,
      email: profile.email,
      role: profile.role as Role,
      name: profile.fullName || parsed.name,
    };
  } catch {
    return null;
  }
}

export async function setSession(session: Session) {
  const jar = await cookies();
  jar.set(COOKIE, JSON.stringify(session), { path: "/", httpOnly: false, sameSite: "lax" });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
