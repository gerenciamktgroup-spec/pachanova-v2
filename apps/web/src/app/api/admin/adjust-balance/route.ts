import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const isDemo = process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_IS_DEMO === 'true';
    if (!isDemo) return NextResponse.json({ error: 'DEMO_MODE required' }, { status: 403 });

    const { investorId, deltaUsd, deltaTokens, reason } = await req.json();
    if (!investorId) return NextResponse.json({ error: 'investorId required' }, { status: 400 });

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ success: true, message: 'mock adjust', newUsd: '0', newTokens: '0' });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: current } = await supabase
      .from('balances')
      .select('*')
      .eq('investor_id', investorId)
      .maybeSingle();

    const currentUsd = Number(current?.available_usd || 0);
    const currentTokens = Number(current?.available_tokens || 0);
    const newUsd = Math.max(0, currentUsd + (deltaUsd || 0));
    const newTokens = Math.max(0, currentTokens + (deltaTokens || 0));

    await supabase.from('balances').upsert({
      investor_id: investorId,
      available_usd: newUsd.toString(),
      available_tokens: newTokens.toString(),
      locked_usd: current?.locked_usd || '0',
      locked_tokens: current?.locked_tokens || '0',
      reserved_tokens: current?.reserved_tokens || '0',
    }, { onConflict: 'investor_id' });

    await supabase.from('audit_logs').insert({
      action: 'ADMIN_BALANCE_ADJUSTED',
      details: `Admin adjusted balance for investor ${investorId}. Delta USD: ${deltaUsd}, Delta PACHA: ${deltaTokens}. Reason: ${reason || 'N/A'}. New: $${newUsd} USD / ${newTokens} PACHA`,
    });

    return NextResponse.json({ success: true, newUsd: newUsd.toString(), newTokens: newTokens.toString() });
  } catch (error) {
    console.error('adjust-balance error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
