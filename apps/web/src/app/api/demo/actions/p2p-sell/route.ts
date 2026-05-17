import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const bodySchema = z.object({
  sellerInvestorId: z.string(),
  propertyId: z.string(),
  quantity: z.number().positive(),
  pricePerToken: z.number().positive(),
});

export async function POST(req: Request) {
  try {
    const isDemo = process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_IS_DEMO === 'true';
    if (!isDemo) return NextResponse.json({ error: 'DEMO_MODE=true required' }, { status: 403 });

    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Invalid parameters', details: result.error }, { status: 400 });

    const { sellerInvestorId, propertyId, quantity, pricePerToken } = result.data;

    // Mock bypass: if Supabase env vars are missing, return simulated success
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({
        success: true,
        orderId: `demo-p2p-sell-${Date.now()}`,
        message: 'Orden P2P publicada en sandbox (mock)',
      });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Validar seller tiene available_tokens >= quantity
    const { data: sellerBalance } = await supabase
      .from('balances')
      .select('*')
      .eq('investor_id', sellerInvestorId)
      .single();

    if (!sellerBalance || Number(sellerBalance.available_tokens || 0) < quantity) {
      return NextResponse.json({ error: 'Tokens PACHA insuficientes para vender' }, { status: 400 });
    }

    const totalAmount = quantity * pricePerToken;

    // 2. INSERT p2p_orders
    const { data: newOrder } = await supabase.from('p2p_orders').insert({
      seller_investor_id: sellerInvestorId,
      property_id: propertyId,
      quantity: quantity.toString(),
      price_per_token: pricePerToken.toString(),
      total_amount: totalAmount.toString(),
      status: 'open',
      is_demo: true
    }).select().single();

    // 3. UPDATE balances: available_tokens -= quantity, locked_tokens += quantity
    await supabase.from('balances').update({
      available_tokens: (Number(sellerBalance.available_tokens || 0) - quantity).toString(),
      locked_tokens: (Number(sellerBalance.locked_tokens || 0) + quantity).toString(),
    }).eq('investor_id', sellerInvestorId);

    // 4. INSERT audit_logs
    await supabase.from('audit_logs').insert({
      action: 'P2P_ORDER_CREATED',
      details: `Investor ${sellerInvestorId} listed ${quantity} tokens for sale`,
    });

    return NextResponse.json({ success: true, orderId: newOrder?.id });
  } catch (error) {
    console.error("P2P sell error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
