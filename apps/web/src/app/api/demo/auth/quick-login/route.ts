import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/utils/supabase/server";

const DEMO_PERSONAS: Record<string, { email: string; password: string; label: string; redirectTo: string | null }> = {
  ana: {
    email: "ana.torres@demo.pachanova.io",
    password: "Demo2026!",
    label: "Ana Torres (Inversora · KYC Approved)",
    redirectTo: "/dashboard/investor",
  },
  diego: {
    email: "diego.ramirez@demo.pachanova.io",
    password: "Demo2026!",
    label: "Diego Ramírez (Inversor · KYC Pending)",
    redirectTo: "/dashboard/investor",
  },
  roberto: {
    email: "roberto.silva@demo.pachanova.io",
    password: "Demo2026!",
    label: "Roberto Silva (Inversor · KYC Approved)",
    redirectTo: "/dashboard/investor",
  },
  carlos: {
    email: "carlos.mendoza@demo.pachanova.io",
    password: "Demo2026!",
    label: "Carlos Mendoza (Admin / Maestro)",
    redirectTo: "/dashboard/admin",
  },
};

export async function POST(req: NextRequest) {
  if (process.env.NEXT_PUBLIC_IS_DEMO !== "true") {
    return NextResponse.json(
      { success: false, error: "Not available in production" },
      { status: 403 }
    );
  }

  const { persona } = await req.json();
  const target = DEMO_PERSONAS[persona];

  if (!target) {
    return NextResponse.json(
      { success: false, error: `Persona '${persona}' not found. Valid: ${Object.keys(DEMO_PERSONAS).join(', ')}` },
      { status: 400 }
    );
  }

  const supabase = await createServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: target.email,
    password: target.password,
  });

  if (error || !data.session) {
    console.error("Quick login failed:", error?.message, "for", target.email);
    return NextResponse.json(
      { success: false, error: error?.message ?? "Auth failed", hint: `Verificá que ${target.email} existe en Supabase con password Demo2026!` },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    persona: target.label,
    redirectTo: target.redirectTo,
  });
}
