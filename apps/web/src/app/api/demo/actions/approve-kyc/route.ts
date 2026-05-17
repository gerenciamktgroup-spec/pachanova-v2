import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const isDemo = process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_IS_DEMO === 'true';
    if (!isDemo) return NextResponse.json({ error: 'DEMO_MODE=true required' }, { status: 403 });

    const body = await req.json();
    const { investorId } = body;

    if (!investorId) {
      return NextResponse.json({ error: 'investorId required' }, { status: 400 });
    }

    // Mock bypass: if Supabase env vars are missing, return simulated success
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ success: true, message: 'KYC approved (mock)' });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get the most recent pending KYC document
    const { data: kycDoc } = await supabase
      .from('kyc_documents')
      .select('id')
      .eq('investor_id', investorId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!kycDoc) {
      // If no pending, we can just update the investor directly or return error
      return NextResponse.json({ error: 'No pending KYC found for this investor' }, { status: 404 });
    }

    // UPDATE kyc_documents
    await supabase.from('kyc_documents').update({
      status: 'approved',
      updated_at: new Date().toISOString()
    }).eq('id', kycDoc.id);

    // Also update the investor's kyc_status as per the logic
    await supabase.from('investors').update({
      kyc_status: 'approved',
      is_verified: true
    }).eq('id', investorId);

    // INSERT audit_logs
    await supabase.from('audit_logs').insert({
      action: 'KYC_APPROVED_DEMO',
      details: `KYC for investor ${investorId} automatically approved in demo`
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Approve KYC error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
