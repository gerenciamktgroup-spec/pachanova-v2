import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const bodySchema = z.object({
  orderId: z.string(),
  investorId: z.string(),
});

export async function POST(req: Request) {
  try {
    const isDemo = process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_IS_DEMO === 'true';
    if (!isDemo) return NextResponse.json({ error: 'DEMO_MODE=true required' }, { status: 403 });

    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Invalid parameters', details: result.error }, { status: 400 });

    const { orderId, investorId } = result.data;

    // Mock bypass: if Supabase env vars are missing, return simulated success
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({
        success: true,
        message: 'Orden P2P cancelada en sandbox (mock)',
      });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Fetch order
    const { data: order } = await supabase
      .from('p2p_orders')
      .select('*')
      .eq('id', orderId)
      .eq('seller_investor_id', investorId)
      .single();

    if (!order || order.status !== 'open') {
      return NextResponse.json({ error: 'Orden no disponible o no te pertenece' }, { status: 400 });
    }

    // 2. Fetch seller balance
    const { data: sellerBalance } = await supabase
      .from('balances')
      .select('*')
      .eq('investor_id', investorId)
      .single();

    if (!sellerBalance) {
      return NextResponse.json({ error: 'Balance no encontrado' }, { status: 400 });
    }

    // 3. UPDATE order status
    await supabase.from('p2p_orders').update({
      status: 'cancelled'
    }).eq('id', orderId);

    // 4. Refund tokens: available += quantity, locked -= quantity
    const quantity = Number(order.quantity);
    await supabase.from('balances').update({
      available_tokens: (Number(sellerBalance.available_tokens || 0) + quantity).toString(),
      locked_tokens: (Number(sellerBalance.locked_tokens || 0) - quantity).toString(),
    }).eq('investor_id', investorId);

    // 5. INSERT audit_logs
    await supabase.from('audit_logs').insert({
      action: 'P2P_ORDER_CANCELLED',
      details: `Investor ${investorId} cancelled order ${orderId}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("P2P cancel error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
