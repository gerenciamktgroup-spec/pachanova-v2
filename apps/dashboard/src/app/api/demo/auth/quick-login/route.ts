import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, core } from "@/server/db";
import { eq } from "drizzle-orm";
import { homeForRole, type AppRole } from "@/lib/auth/session";

const PERSONAS: Record<string, { email: string; fallbackRole: AppRole; name: string }> = {
  admin: { email: "admin@pachanova.local", fallbackRole: "admin", name: "Administrador" },
  carlos: { email: "admin@pachanova.local", fallbackRole: "admin", name: "Administrador" },
  investor: { email: "inversor@pachanova.local", fallbackRole: "investor", name: "Inversor Demo" },
  holder: { email: "inversor@pachanova.local", fallbackRole: "investor", name: "Inversor Demo" },
  client: { email: "cliente@pachanova.local", fallbackRole: "client", name: "Cliente Demo" },
};

export async function POST(req: Request) {
  try {
    const { persona } = await req.json();
    const spec = PERSONAS[persona];
    if (!spec) {
      return NextResponse.json({ success: false, error: "Persona no válida" }, { status: 400 });
    }

    let id = crypto.randomUUID();
    let role: AppRole = spec.fallbackRole;
    let fullName = spec.name;

    try {
      const [profile] = await db
        .select()
        .from(core.profiles)
        .where(eq(core.profiles.email, spec.email))
        .limit(1);
      if (profile) {
        id = profile.id;
        role = profile.role;
        fullName = profile.fullName || spec.name;
      }
    } catch {
      // local db down: still allow demo cookie
    }

    const mockUser = {
      id,
      email: spec.email,
      app_metadata: { role },
      user_metadata: { full_name: fullName },
      aud: "authenticated",
      role: "authenticated",
    };

    const jar = await cookies();
    jar.set("pachanova-mock-session", JSON.stringify(mockUser), { path: "/" });

    return NextResponse.json({ success: true, redirectTo: homeForRole(role) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error de servidor en quick-login";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
