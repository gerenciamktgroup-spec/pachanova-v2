import { NextResponse } from "next/server";
import { createServerClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { persona } = await req.json();
    const supabase = await createServerClient();

    let email = "";
    // Se asume que los usuarios demo tienen esta contraseña estándar configurada en Supabase Auth
    const password = process.env.DEMO_USERS_PASSWORD || "password123";

    if (persona === "carlos") {
      email = "carlos.mendoza@demo.pachanova.io";
    } else if (persona === "holder") {
      email = "demo.investor.holder@pachanova.local";
    } else {
      return NextResponse.json({ success: false, error: "Persona no válida" }, { status: 400 });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("[Quick Login] Auth error:", error.message);
      return NextResponse.json({ success: false, error: `Fallo al autenticar (${email}): ${error.message}` }, { status: 401 });
    }

    const role = data.user?.app_metadata?.role;
    let redirectTo = "/dashboard";

    if (role === "admin" || role === "operator" || persona === "carlos") {
      redirectTo = "/dashboard/admin";
    } else {
      redirectTo = "/dashboard/investor";
    }

    return NextResponse.json({ success: true, redirectTo });
  } catch (error: any) {
    console.error("[Quick Login] Error:", error);
    return NextResponse.json({ success: false, error: "Error de servidor en quick-login" }, { status: 500 });
  }
}
