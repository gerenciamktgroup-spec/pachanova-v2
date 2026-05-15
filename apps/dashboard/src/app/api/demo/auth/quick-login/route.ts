import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/utils/supabase/server";

const DEMO_PERSONAS: Record<string, { email: string; password: string; label: string }> = {
  carlos: {
    email: "carlos.mendoza@demo.pachanova.io",
    password: "Demo2026!",
    label: "Carlos Mendoza (Admin / Operador)",
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
      { success: false, error: "Persona not found" },
      { status: 400 }
    );
  }

  const supabase = await createServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: target.email,
    password: target.password,
  });

  if (error || !data.session) {
    console.error("Quick login failed:", error?.message);
    return NextResponse.json(
      { success: false, error: error?.message ?? "Auth failed" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    persona: target.label,
    redirectTo: "/dashboard/admin",
  });
}
