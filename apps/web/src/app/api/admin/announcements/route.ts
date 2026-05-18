import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  target: z.enum(['all', 'kyc_approved', 'kyc_pending']).default('all'),
});

export async function POST(req: Request) {
  try {
    const result = schema.safeParse(await req.json());
    if (!result.success) return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 });

    const { title, body, target } = result.data;

    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Insertar en tabla announcements (Supabase Realtime lo propagará automáticamente)
    const { error } = await sb.from('announcements').insert({
      title,
      body,
      target,
      created_by: 'admin',
    });

    if (error) {
      // Si la tabla no existe aún, igual registrar en audit_logs
      await sb.from('audit_logs').insert({
        action: 'ADMIN_ANNOUNCEMENT',
        details: `[${target}] ${title}: ${body}`,
      });
      return NextResponse.json({ success: true, note: 'Registrado en audit (tabla announcements pendiente)' });
    }

    await sb.from('audit_logs').insert({
      action: 'ADMIN_ANNOUNCEMENT',
      details: `[${target}] ${title}: ${body}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data } = await sb.from('announcements').select('*').order('created_at', { ascending: false }).limit(20);
    return NextResponse.json({ announcements: data || [] });
  } catch {
    return NextResponse.json({ announcements: [] });
  }
}
