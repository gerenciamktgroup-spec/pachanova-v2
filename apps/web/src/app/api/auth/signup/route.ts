import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const { fullName, email, password } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'La contraseña debe tener mínimo 8 caracteres' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Crear usuario con confirmación automática (requiere SERVICE_ROLE)
    const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

    let userId: string;

    if (!adminError && adminData?.user) {
      userId = adminData.user.id;
    } else {
      // Fallback para usuarios que ya existen o si SERVICE_ROLE falla
      console.warn('admin.createUser failed:', adminError?.message);
      const supabaseClient = await createServerClient();
      const { data: signUpData, error: signUpError } = await supabaseClient.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (signUpError || !signUpData?.user) {
        const msg = signUpError?.message || 'Error desconocido';
        if (msg.toLowerCase().includes('already registered')) {
          return NextResponse.json({ error: 'Este email ya está registrado' }, { status: 409 });
        }
        return NextResponse.json({ error: msg }, { status: 400 });
      }
      userId = signUpData.user.id;
    }

    // 2. Sign in inmediato para establecer sesión
    const supabaseClient = await createServerClient();
    await supabaseClient.auth.signInWithPassword({ email, password });

    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || 'Usuario';

    // 3. Verificar si ya existe el registro de inversor
    const { data: existingInvestor } = await supabaseAdmin
      .from('investors')
      .select('id')
      .eq('supabase_auth_id', userId)
      .maybeSingle();

    let investorId: string;

    if (existingInvestor?.id) {
      investorId = existingInvestor.id;
    } else {
      const { data: newInvestor, error: invError } = await supabaseAdmin
        .from('investors')
        .insert({
          supabase_auth_id: userId,
          email,
          first_name: firstName,
          last_name: lastName,
          role: 'investor',
          kyc_status: 'pending',
          is_demo: true,
        })
        .select('id')
        .single();

      if (invError || !newInvestor) {
        console.error('Insert investor error:', invError);
        return NextResponse.json({ error: 'Error al crear perfil de inversor: ' + invError?.message }, { status: 500 });
      }
      investorId = newInvestor.id;

      // 4. Crear balance inicial
      await supabaseAdmin.from('balances').insert({
        investor_id: investorId,
        available_usd: '0',
        locked_usd: '0',
        available_tokens: '0',
        locked_tokens: '0',
        reserved_tokens: '0',
      });

      // 5. Crear registro KYC inicial
      await supabaseAdmin.from('kyc_documents').insert({
        investor_id: investorId,
        document_type: 'IDENTITY_PENDING',
        file_url: '',
        status: 'pending',
        is_demo: true,
      });

      // 6. Audit log
      await supabaseAdmin.from('audit_logs').insert({
        action: 'INVESTOR_REGISTERED',
        details: `New investor registered: ${email} (ID: ${investorId})`,
        user_id: userId,
      });
    }

    return NextResponse.json({ success: true, investorId, userId });
  } catch (error) {
    console.error('signup API error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
