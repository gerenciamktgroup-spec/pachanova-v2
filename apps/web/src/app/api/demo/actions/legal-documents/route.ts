import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ documents: [] });
    }

    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    const { data } = await supabaseAdmin
      .from('audit_logs')
      .select('*')
      .eq('action', 'LEGAL_DOCUMENT')
      .order('created_at', { ascending: false });

    const documents = (data || []).map(log => {
      try {
        const details = JSON.parse(log.details || '{}');
        return {
          id: log.id,
          title: details.title || 'Documento Legal',
          url: details.url || '#',
          createdAt: log.created_at
        };
      } catch {
        return null;
      }
    }).filter(Boolean);

    return NextResponse.json({ documents });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const isDemo = process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_IS_DEMO === 'true';
    if (!isDemo) return NextResponse.json({ error: 'DEMO_MODE=true required' }, { status: 403 });

    const { title } = await req.json();
    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ success: true, message: 'Documento subido (mock)' });
    }

    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    // Simulated URL for Demo
    const simulatedUrl = `/demo-docs/${title.replace(/\s+/g, '-').toLowerCase()}.pdf`;

    await supabaseAdmin.from('audit_logs').insert({
      action: 'LEGAL_DOCUMENT',
      details: JSON.stringify({ title, url: simulatedUrl }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
