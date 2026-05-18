import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const schema = z.object({
  investorId: z.string(),
  field: z.enum(['available_usd', 'available_tokens']),
  delta: z.number(),
  reason: z.string().min(3),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 });

    const { investorId, field, delta, reason } = result.data;

    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: current } = await sb
      .from('balances')
      .select(field)
      .eq('investor_id', investorId)
      .maybeSingle();

    const currentValue = Number(current?.[field] || 0);
    const newValue = Math.max(0, currentValue + delta);

    await sb.from('balances')
      .update({ [field]: newValue.toString() })
      .eq('investor_id', investorId);

    await sb.from('audit_logs').insert({
      action: 'ADMIN_BALANCE_ADJUSTMENT',
      details: `Admin adjusted ${field} for investor ${investorId}: ${currentValue} → ${newValue} (delta: ${delta > 0 ? '+' : ''}${delta}). Reason: ${reason}`,
    });

    return NextResponse.json({ success: true, newValue, field });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
