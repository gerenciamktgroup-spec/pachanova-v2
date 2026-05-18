import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Acepta cualquier string (UUID o ID interno de Pachanova)
const bodySchema = z.object({
  investorId: z.string().min(1),
  amountUsd: z.number().positive(),
});

export async function POST(req: Request) {
  try {
    const isDemo = process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_IS_DEMO === 'true';
    if (!isDemo) return NextResponse.json({ error: 'DEMO_MODE=true required' }, { status: 403 });

    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Invalid parameters', details: result.error }, { status: 400 });

    const { investorId, amountUsd } = result.data;

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({
        success: true,
        message: `Deposited ${amountUsd} USD (mock - no Supabase)`,
        newBalance: amountUsd,
      });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: existing } = await supabase
      .from('balances')
      .select('*')
      .eq('investor_id', investorId)
      .maybeSingle();

    if (!existing) {
      await supabase.from('balances').insert({
        investor_id: investorId,
        available_usd: amountUsd.toString(),
        locked_usd: '0',
        available_tokens: '0',
        locked_tokens: '0',
        reserved_tokens: '0',
      });
    } else {
      await supabase.from('balances').update({
        available_usd: (Number(existing.available_usd || 0) + amountUsd).toString()
      }).eq('investor_id', investorId);
    }

    const newUsd = existing
      ? Number(existing.available_usd || 0) + amountUsd
      : amountUsd;

    await supabase.from('audit_logs').insert({
      action: 'DEMO_SIMULATED_DEPOSIT',
      details: `Simulated deposit of $${amountUsd} USD for investor ${investorId}. New balance: $${newUsd}`,
    });

    await supabase.from('integration_events').insert({
      provider: 'DEMO_SYSTEM',
      event_type: 'SIMULATED_DEPOSIT',
      payload: { investorId, amountUsd, newBalance: newUsd },
      simulated: true,
    });

    return NextResponse.json({ success: true, message: `Depositado $${amountUsd} USD`, newBalance: newUsd });
  } catch (error) {
    console.error('simulated-deposit error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
