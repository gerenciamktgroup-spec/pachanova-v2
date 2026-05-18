import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const bodySchema = z.object({
  investorId: z.string().uuid(),
  amount: z.number().positive(),
});

export async function POST(req: Request) {
  try {
    const isDemo = process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_IS_DEMO === 'true';
    if (!isDemo) return NextResponse.json({ error: 'DEMO_MODE=true required' }, { status: 403 });

    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Invalid parameters', details: result.error }, { status: 400 });

    const { investorId, amount } = result.data;

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ success: true, message: 'Tokens inyectados (mock)' });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Get current balance
    const { data: balance } = await supabaseAdmin
      .from('balances')
      .select('available_tokens')
      .eq('investor_id', investorId)
      .single();

    const newTokens = (Number(balance?.available_tokens || 0) + amount).toString();

    // Update balance
    await supabaseAdmin
      .from('balances')
      .update({ available_tokens: newTokens })
      .eq('investor_id', investorId);

    await supabaseAdmin.from('audit_logs').insert({
      action: 'DEMO_TOKENS_INJECTED',
      details: `Injected ${amount} PACHA tokens to Investor ${investorId}`,
    });

    return NextResponse.json({ success: true, newTokens });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
