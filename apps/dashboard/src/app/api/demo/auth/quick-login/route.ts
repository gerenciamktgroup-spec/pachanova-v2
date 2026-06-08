import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/utils/supabase/server";

const DEMO_PERSONAS: Record<string, { email: string; password: string; label: string; redirectTo: string }> = {
  carlos: {
    email: "carlos.mendoza@demo.pachanova.io",
    password: "Demo2026!",
    label: "Carlos Mendoza (Admin / Operador)",
    redirectTo: "/dashboard/admin",
  },
  holder: {
    email: "demo.investor.holder@pachanova.local",
    password: "Demo2026!",
    label: "Demo Holder (Inversor / KYC Aprobado)",
    redirectTo: "/dashboard/investor",
  },
};

export async function POST(req: NextRequest) {
  // Eliminado temporalmente para permitir acceso a Admin en Vercel
  // if (process.env.NEXT_PUBLIC_IS_DEMO !== "true") {
  //   return NextResponse.json(
  //     { success: false, error: "Not available in production" },
  //     { status: 403 }
  //   );
  // }

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
    console.warn("Quick login Supabase auth failed, falling back to mock session:", error?.message);
    
    // Fallback: set a mock session cookie for the demo environment
    const mockUser = {
      id: target.label.includes('Admin') ? 'demo-admin-id' : 'demo-investor-id',
      email: target.email,
      app_metadata: { role: target.label.includes('Admin') ? 'admin' : 'investor' },
      user_metadata: { full_name: target.label.split(' (')[0] }
    };
    
    const response = NextResponse.json({
      success: true,
      persona: target.label,
      redirectTo: target.redirectTo,
      fallback: true
    });
    
    response.cookies.set('pachanova-mock-session', JSON.stringify(mockUser), {
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: 'lax'
    });
    
    return response;
  }

  return NextResponse.json({
    success: true,
    persona: target.label,
    redirectTo: target.redirectTo,
  });
}
