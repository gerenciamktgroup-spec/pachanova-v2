import { NextRequest, NextResponse } from "next/server";
import { db, core } from "@/lib/db";
import { eq } from "drizzle-orm";
import { homeFor, setSession, type Role } from "@/lib/session";

const PERSONAS: Record<string, { email: string; role: Role; name: string }> = {
  admin: { email: "admin@pachanova.local", role: "admin", name: "Administrador" },
  investor: { email: "inversor@pachanova.local", role: "investor", name: "Inversor" },
  client: { email: "cliente@pachanova.local", role: "client", name: "Cliente" },
};

export async function POST(req: NextRequest) {
  const { persona } = await req.json();
  const spec = PERSONAS[persona];
  if (!spec) return NextResponse.json({ error: "Rol inválido" }, { status: 400 });

  let id = crypto.randomUUID();
  let role = spec.role;
  let name = spec.name;
  try {
    const [p] = await db.select().from(core.profiles).where(eq(core.profiles.email, spec.email)).limit(1);
    if (p) {
      id = p.id;
      role = p.role as Role;
      name = p.fullName || spec.name;
    }
  } catch {
    /* demo still works if db is down */
  }
  await setSession({ id, email: spec.email, role, name });
  return NextResponse.json({ redirectTo: homeFor(role) });
}
