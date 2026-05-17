import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const bodySchema = z.object({
  orderId: z.string(),
  buyerInvestorId: z.string(),
  quantity: z.number().positive(),
});

export async function POST(req: Request) {
  try {
    const isDemo = process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_IS_DEMO === 'true';
    if (!isDemo) return NextResponse.json({ error: 'DEMO_MODE=true required' }, { status: 403 });

    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Invalid parameters', details: result.error }, { status: 400 });

    const { orderId, buyerInvestorId, quantity } = result.data;

    // Mock bypass: if Supabase env vars are missing, return simulated success
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({
        success: true,
        tradeId: `demo-trade-${Date.now()}`,
        newBalance: (1500 + quantity).toString(),
        message: 'Compra P2P registrada en sandbox (mock)',
      });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Fetch order -> validate status='open', quantity disponible
    const { data: order } = await supabase
      .from('p2p_orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (!order || order.status !== 'open') {
      return NextResponse.json({ error: 'Orden no disponible' }, { status: 400 });
    }

    if (quantity > Number(order.quantity)) {
      return NextResponse.json({ error: 'Cantidad solicitada excede la orden' }, { status: 400 });
    }

    if (buyerInvestorId === order.seller_investor_id) {
      return NextResponse.json({ error: 'No puedes comprar tu propia orden' }, { status: 400 });
    }

    // 2. Calcular total
    const totalAmount = quantity * Number(order.price_per_token);

    // 3. Validar buyer tiene available_usd >= total
    const { data: buyerBalance } = await supabase
      .from('balances')
      .select('*')
      .eq('investor_id', buyerInvestorId)
      .single();

    if (!buyerBalance || Number(buyerBalance.available_usd || 0) < totalAmount) {
      return NextResponse.json({ error: 'Fondos insuficientes USD' }, { status: 400 });
    }

    // Fetch seller balance to update later
    const { data: sellerBalance } = await supabase
      .from('balances')
      .select('*')
      .eq('investor_id', order.seller_investor_id)
      .single();

    if (!sellerBalance) {
      return NextResponse.json({ error: 'Vendedor sin balance configurado' }, { status: 400 });
    }

    // 4. INSERT p2p_trades
    const { data: newTrade } = await supabase.from('p2p_trades').insert({
      order_id: orderId,
      property_id: order.property_id,
      buyer_investor_id: buyerInvestorId,
      seller_investor_id: order.seller_investor_id,
      quantity: quantity.toString(),
      price_per_token: order.price_per_token,
      total_amount: totalAmount.toString(),
      fee_amount: '0',
      is_demo: true
    }).select().single();

    // 5. UPDATE balances del buyer
    await supabase.from('balances').update({
      available_usd: (Number(buyerBalance.available_usd || 0) - totalAmount).toString(),
      available_tokens: (Number(buyerBalance.available_tokens || 0) + quantity).toString(),
    }).eq('investor_id', buyerInvestorId);

    // 6. UPDATE balances del seller (seller had locked tokens, now they are transferred so we decrement locked_tokens)
    await supabase.from('balances').update({
      available_usd: (Number(sellerBalance.available_usd || 0) + totalAmount).toString(),
      locked_tokens: (Number(sellerBalance.locked_tokens || 0) - quantity).toString(),
    }).eq('investor_id', order.seller_investor_id);

    // 7. UPDATE p2p_orders
    const newOrderQuantity = Number(order.quantity) - quantity;
    await supabase.from('p2p_orders').update({
      quantity: newOrderQuantity.toString(),
      status: newOrderQuantity <= 0 ? 'closed' : 'open'
    }).eq('id', orderId);

    // 8. INSERT audit_logs
    await supabase.from('audit_logs').insert({
      action: 'P2P_TRADE_EXECUTED',
      details: `Trade executed: ${quantity} tokens for order ${orderId}`,
    });

    // Return the new buyer balance
    const { data: updatedBuyerBalance } = await supabase
      .from('balances')
      .select('available_tokens')
      .eq('investor_id', buyerInvestorId)
      .single();

    return NextResponse.json({ success: true, tradeId: newTrade?.id, newBalance: updatedBuyerBalance?.available_tokens });
  } catch (error) {
    console.error("P2P buy error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
