import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { investorId } = await req.json();
    if (!investorId) return NextResponse.json({ error: 'investorId requerido' }, { status: 400 });

    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    await sb.from('kyc_documents')
      .update({ status: 'rejected' })
      .eq('investor_id', investorId);

    await sb.from('audit_logs').insert({
      action: 'KYC_REJECTED',
      details: `KYC rejected for investor ${investorId}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
