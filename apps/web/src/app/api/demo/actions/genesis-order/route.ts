import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq, sql } from 'drizzle-orm';
import { validateDemoDatabaseUrl } from '@pachanova/database/src/utils/demoValidation';
import { z } from 'zod';
import crypto from 'crypto';

const bodySchema = z.object({
  investorId: z.string(),
  propertyId: z.string(),
  quantity: z.number().positive(),
  unitPrice: z.number().positive(),
});

export async function POST(req: Request) {
  try {
    if (process.env.DEMO_MODE !== 'true') return NextResponse.json({ error: 'DEMO_MODE=true required' }, { status: 403 });
    validateDemoDatabaseUrl(process.env.DATABASE_URL || '');

    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Invalid parameters', details: result.error }, { status: 400 });

    const { investorId, propertyId, quantity, unitPrice } = result.data;
    const totalAmount = quantity * unitPrice;

    // Use Supabase Service Role
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: currentBalance } = await supabase
      .from('balances')
      .select('*')
      .eq('investor_id', investorId)
      .single();

    if (!currentBalance || Number(currentBalance.available_usd || 0) < totalAmount) {
      return NextResponse.json({ error: 'Fondos insuficientes' }, { status: 400 });
    }

    // a) INSERT en token_orders
    const { data: newOrderData } = await supabase.from('token_orders').insert({
      investor_id: investorId,
      property_id: propertyId,
      quantity: quantity.toString(),
      unit_price: unitPrice.toString(),
      total_amount: totalAmount.toString(),
      currency: 'USD',
      status: 'completed',
      is_demo: true,
      metadata: { source: 'genesis_wizard' },
    }).select().single();

    // b) UPDATE balances
    await supabase.from('balances').update({
      available_tokens: (Number(currentBalance.available_tokens || 0) + quantity).toString(),
      available_usd: (Number(currentBalance.available_usd || 0) - totalAmount).toString(),
    }).eq('investor_id', investorId);

    const { data: updatedBalance } = await supabase
      .from('balances')
      .select('available_tokens')
      .eq('investor_id', investorId)
      .single();

    // c) INSERT en token_ledger
    const randomHash = crypto.randomUUID().replace(/-/g, '');
    await supabase.from('token_ledger').insert({
      investor_id: investorId,
      operation: 'GENESIS_PURCHASE',
      amount: quantity.toString(),
      tx_hash: 'DEMO_' + crypto.randomUUID().slice(0, 8).toUpperCase(),
      previous_hash: 'DEMO_PREV_' + randomHash,
      current_hash: 'DEMO_CURR_' + crypto.randomUUID().replace(/-/g, ''),
    });

    // d) INSERT en audit_logs
    await supabase.from('audit_logs').insert({
      action: 'GENESIS_ORDER_COMPLETED',
      details: `Investor ${investorId} purchased ${quantity} PACHA tokens at $${unitPrice}`,
    });

    return NextResponse.json({ success: true, orderId: newOrderData?.id, newBalance: updatedBalance?.available_tokens || '0' });
  } catch (error) {
    console.error("Genesis order error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
