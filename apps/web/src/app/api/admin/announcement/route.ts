import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const isDemo = process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_IS_DEMO === 'true';
    if (!isDemo) return NextResponse.json({ error: 'DEMO_MODE required' }, { status: 403 });

    const { title, body, target = 'all' } = await req.json();
    if (!title || !body) return NextResponse.json({ error: 'title and body required' }, { status: 400 });

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ success: true, message: 'mock announcement sent' });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase.from('announcements').insert({
      title,
      body,
      target,
      created_by: 'admin',
    }).select().single();

    if (error) {
      // Si la tabla no existe todavía, loguear en audit como fallback
      console.warn('announcements table error:', error.message);
      await supabase.from('audit_logs').insert({
        action: 'ADMIN_ANNOUNCEMENT_SENT',
        details: `ANNOUNCEMENT: ${title} — ${body}`,
      });
      return NextResponse.json({ success: true, fallback: true });
    }

    await supabase.from('audit_logs').insert({
      action: 'ADMIN_ANNOUNCEMENT_SENT',
      details: `Announcement sent to ${target}: "${title}"`,
    });

    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error('announcement error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
