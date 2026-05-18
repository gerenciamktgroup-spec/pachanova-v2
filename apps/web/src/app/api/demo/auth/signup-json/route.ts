import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const bodySchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Datos inválidos', details: result.error }, { status: 400 });
    }

    const { fullName, email, password } = result.data;

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Crear usuario con email auto-confirmado
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || 'Demo';

    const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, first_name: firstName, last_name: lastName },
      app_metadata: { role: 'investor' },
    });

    if (adminError) {
      if (adminError.message.toLowerCase().includes('already registered') || adminError.message.toLowerCase().includes('already exists')) {
        return NextResponse.json({ error: 'Este email ya está registrado. Intentá ingresar.' }, { status: 409 });
      }
      return NextResponse.json({ error: adminError.message }, { status: 500 });
    }

    const userId = adminData.user.id;

    // Verificar si ya existe el investor
    const { data: existing } = await supabaseAdmin
      .from('investors')
      .select('id')
      .eq('supabase_auth_id', userId)
      .maybeSingle();

    let investorId: string;

    if (existing?.id) {
      investorId = existing.id;
    } else {
      const { data: newInvestor, error: invError } = await supabaseAdmin
        .from('investors')
        .insert({
          supabase_auth_id: userId,
          email,
          first_name: firstName,
          last_name: lastName,
          role: 'investor',
          is_demo: true,
        })
        .select('id')
        .single();

      if (invError || !newInvestor) {
        return NextResponse.json({ error: 'Error al crear perfil de inversor: ' + invError?.message }, { status: 500 });
      }

      investorId = newInvestor.id;

      // Crear balance inicial en 0
      await supabaseAdmin.from('balances').insert({
        investor_id: investorId,
        available_usd: '0',
        locked_usd: '0',
        available_tokens: '0',
        locked_tokens: '0',
        reserved_tokens: '0',
      });

      // Crear registro KYC inicial pendiente
      await supabaseAdmin.from('kyc_documents').insert({
        investor_id: investorId,
        document_type: 'PENDING',
        file_url: '',
        status: 'pending',
        is_demo: true,
      });

      // Log de audit
      await supabaseAdmin.from('audit_logs').insert({
        action: 'INVESTOR_REGISTERED',
        details: `New investor ${email} (${fullName}) registered via demo signup`,
        user_id: userId,
      });
    }

    // Iniciar sesión automáticamente
    const { data: sessionData } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
    });

    return NextResponse.json({
      success: true,
      investorId,
      userId,
      email,
      fullName,
    });
  } catch (error) {
    console.error('Signup JSON error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
