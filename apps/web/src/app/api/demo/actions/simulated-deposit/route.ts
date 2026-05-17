import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq, sql } from 'drizzle-orm';
import { validateDemoDatabaseUrl } from '@pachanova/database/utils/demoValidation';
import { z } from 'zod';

const bodySchema = z.object({
  investorId: z.string().uuid(),
  amountUsd: z.number().positive(),
});

export async function POST(req: Request) {
  try {
    if (process.env.DEMO_MODE !== 'true') return NextResponse.json({ error: 'DEMO_MODE=true required' }, { status: 403 });
    validateDemoDatabaseUrl(process.env.DATABASE_URL || '');

    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Invalid parameters', details: result.error }, { status: 400 });

    const { investorId, amountUsd } = result.data;

    // Use Supabase Service Role
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Fetch existing balance
    const { data: existing } = await supabase
      .from('balances')
      .select('*')
      .eq('investor_id', investorId)
      .single();

    if (!existing) {
      await supabase.from('balances').insert({
        investor_id: investorId,
        available_usd: amountUsd.toString()
      });
    } else {
      await supabase.from('balances').update({
        available_usd: (Number(existing.available_usd || 0) + amountUsd).toString()
      }).eq('investor_id', investorId);
    }

    await supabase.from('audit_logs').insert({
      action: 'DEMO_SIMULATED_DEPOSIT',
      details: `Simulated deposit of ${amountUsd} USD for investor ${investorId}`,
    });

    await supabase.from('integration_events').insert({
      provider: 'DEMO_SYSTEM',
      event_type: 'SIMULATED_DEPOSIT',
      payload: { investorId, amountUsd },
      simulated: true,
    });

    return NextResponse.json({ success: true, message: `Deposited ${amountUsd} USD` });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
