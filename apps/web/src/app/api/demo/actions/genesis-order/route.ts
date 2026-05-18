import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
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
    const isDemo = process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_IS_DEMO === 'true';
    if (!isDemo) return NextResponse.json({ error: 'DEMO_MODE=true required' }, { status: 403 });

    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Invalid parameters', details: result.error }, { status: 400 });

    const { investorId, propertyId, quantity, unitPrice } = result.data;
    const totalAmount = quantity * unitPrice;

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({
        success: true,
        orderId: `demo-order-${Date.now()}`,
        newBalance: (1500 + quantity).toString(),
        message: 'Orden registrada en sandbox (mock)',
      });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Buscar balance del inversor (maybeSingle para no crashear si no existe)
    const { data: currentBalance } = await supabase
      .from('balances')
      .select('*')
      .eq('investor_id', investorId)
      .maybeSingle();

    // Si no existe el balance, crearlo con 0
    if (!currentBalance) {
      await supabase.from('balances').insert({
        investor_id: investorId,
        available_usd: '0',
        locked_usd: '0',
        available_tokens: '0',
        locked_tokens: '0',
        reserved_tokens: '0',
      });
      return NextResponse.json({
        error: 'Fondos insuficientes. Realizá un depósito primero.',
        available: 0,
        required: totalAmount,
      }, { status: 400 });
    }

    const availableUsd = Number(currentBalance.available_usd || 0);
    if (availableUsd < totalAmount) {
      return NextResponse.json({
        error: 'Fondos insuficientes',
        available: availableUsd,
        required: totalAmount,
      }, { status: 400 });
    }

    // Verificar stock en la bóveda maestra
    const { data: treasury } = await supabase
      .from('balances')
      .select('available_tokens')
      .eq('investor_id', 'PACHANOVA_TREASURY')
      .maybeSingle();

    const treasuryStock = Number(treasury?.available_tokens || 0);
    if (treasuryStock < quantity) {
      return NextResponse.json({
        error: 'Stock insuficiente en bóveda. Contactar a Pachanova.',
        available: treasuryStock,
        required: quantity,
      }, { status: 400 });
    }

    // Registrar la orden
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

    // Actualizar balance del inversor
    const newTokenBalance = (Number(currentBalance.available_tokens || 0) + quantity).toString();
    const newUsdBalance = (availableUsd - totalAmount).toString();

    await supabase.from('balances').update({
      available_tokens: newTokenBalance,
      available_usd: newUsdBalance,
    }).eq('investor_id', investorId);

    // Descontar de la bóveda maestra
    await supabase.from('balances').update({
      available_tokens: (treasuryStock - quantity).toString(),
    }).eq('investor_id', 'PACHANOVA_TREASURY');

    // Registrar en ledger con hash simulado
    const txHash = 'DEMO_' + crypto.randomUUID().slice(0, 8).toUpperCase();
    await supabase.from('token_ledger').insert({
      investor_id: investorId,
      operation: 'GENESIS_PURCHASE',
      amount: quantity.toString(),
      tx_hash: txHash,
      previous_hash: 'DEMO_PREV_' + crypto.randomUUID().replace(/-/g, ''),
      current_hash: 'DEMO_CURR_' + crypto.randomUUID().replace(/-/g, ''),
    });

    // Registrar en audit_logs
    await supabase.from('audit_logs').insert({
      action: 'GENESIS_ORDER_COMPLETED',
      details: `Investor ${investorId} purchased ${quantity} PACHA tokens at $${unitPrice} each. Total: $${totalAmount}. TX: ${txHash}`,
    });

    return NextResponse.json({
      success: true,
      orderId: newOrderData?.id,
      newBalance: newTokenBalance,
      txHash,
      message: `Compraste ${quantity} tokens PACHA exitosamente.`,
    });
  } catch (error) {
    console.error('Genesis order error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
