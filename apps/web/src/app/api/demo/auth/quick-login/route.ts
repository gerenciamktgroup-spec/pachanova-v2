import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Quick-Login para presentaciones en vivo.
 * Permite ingresar con un persona demo con un solo click.
 * Los usuarios DEBEN existir en Supabase con estos emails y contraseña Demo2026!
 */
const DEMO_PERSONAS: Record<string, { email: string; password: string; label: string }> = {
  ana: {
    email: 'ana.torres@demo.pachanova.io',
    password: 'Demo2026!',
    label: 'Ana Torres — Inversora · KYC Aprobado',
  },
  carlos: {
    email: 'carlos.ruiz@demo.pachanova.io',
    password: 'Demo2026!',
    label: 'Carlos Ruiz — Inversor · KYC Aprobado',
  },
  maria: {
    email: 'maria.gomez@demo.pachanova.io',
    password: 'Demo2026!',
    label: 'María Gómez — Inversora · KYC Pendiente',
  },
  admin: {
    email: 'admin@pachanova.io',
    password: 'Admin2026!',
    label: 'Admin Maestra — Control Total',
  },
};

export async function POST(req: Request) {
  try {
    const { persona } = await req.json();

    if (!persona || !DEMO_PERSONAS[persona]) {
      return NextResponse.json({
        error: 'Persona inválida. Opciones: ana, carlos, maria, admin',
        available: Object.keys(DEMO_PERSONAS),
      }, { status: 400 });
    }

    const { email, password, label } = DEMO_PERSONAS[persona];

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({
        success: true,
        message: `Quick-login mock: ${label}`,
        persona,
      });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Verificar que el usuario existe, si no crearlo
    const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = userList?.users?.find((u: { email?: string }) => u.email === email);

    if (!existingUser) {
      // Crear usuario demo si no existe
      const nameParts = label.split(' —')[0].split(' ');
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: nameParts.slice(0, 2).join(' '),
          first_name: nameParts[0],
          last_name: nameParts[1] || 'Demo',
        },
      });
    }

    // Generar magic link de acceso instantáneo
    const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
    });

    return NextResponse.json({
      success: true,
      label,
      email,
      persona,
      magicLink: linkData?.properties?.action_link,
    });
  } catch (error) {
    console.error('Quick-login error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    personas: Object.entries(DEMO_PERSONAS).map(([key, v]) => ({
      key,
      label: v.label,
      email: v.email,
    })),
  });
}
