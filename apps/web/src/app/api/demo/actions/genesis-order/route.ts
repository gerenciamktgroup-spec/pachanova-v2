import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import crypto from 'crypto';

const TREASURY_ID = 'PACHANOVA_TREASURY';

const bodySchema = z.object({
  investorId: z.string().min(1),
  propertyId: z.string().min(1),
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

    // Mock bypass si no hay Supabase
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({
        success: true,
        orderId: `demo-order-${Date.now()}`,
        newBalance: quantity.toString(),
        treasuryRemaining: (500000 - quantity).toString(),
        message: 'Orden registrada en sandbox (mock sin Supabase)',
      });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 1. Obtener balance del inversor (maybeSingle para no crashear si no existe)
    const { data: currentBalance } = await supabase
      .from('balances')
      .select('*')
      .eq('investor_id', investorId)
      .maybeSingle();

    // 2. Validar fondos del inversor
    const availableUsd = Number(currentBalance?.available_usd || 0);
    if (availableUsd < totalAmount) {
      return NextResponse.json({
        error: 'Fondos insuficientes',
        available: availableUsd,
        required: totalAmount,
        hint: 'Ir a Depósito Simulado para cargar fondos primero'
      }, { status: 400 });
    }

    // 3. Verificar stock de la bóveda maestra
    const { data: treasury } = await supabase
      .from('balances')
      .select('available_tokens')
      .eq('investor_id', TREASURY_ID)
      .maybeSingle();

    const treasuryStock = Number(treasury?.available_tokens || 0);
    if (treasuryStock < quantity) {
      return NextResponse.json({
        error: 'Stock insuficiente en bóveda PACHA',
        available: treasuryStock,
        requested: quantity
      }, { status: 400 });
    }

    // 4. Crear orden
    const { data: newOrderData } = await supabase.from('token_orders').insert({
      investor_id: investorId,
      property_id: propertyId,
      quantity: quantity.toString(),
      unit_price: unitPrice.toString(),
      total_amount: totalAmount.toString(),
      currency: 'USD',
      status: 'completed',
      is_demo: true,
      metadata: { source: 'genesis_wizard', treasury_id: TREASURY_ID },
    }).select().single();

    // 5. Actualizar balance del inversor
    const prevTokens = Number(currentBalance?.available_tokens || 0);
    await supabase.from('balances').upsert({
      investor_id: investorId,
      available_tokens: (prevTokens + quantity).toString(),
      available_usd: (availableUsd - totalAmount).toString(),
      locked_usd: currentBalance?.locked_usd || '0',
      locked_tokens: currentBalance?.locked_tokens || '0',
      reserved_tokens: currentBalance?.reserved_tokens || '0',
    }, { onConflict: 'investor_id' });

    // 6. Descontar de la bóveda maestra
    await supabase.from('balances').update({
      available_tokens: (treasuryStock - quantity).toString()
    }).eq('investor_id', TREASURY_ID);

    // 7. Ledger auditado
    const txHash = 'DEMO_' + crypto.randomUUID().slice(0, 8).toUpperCase();
    await supabase.from('token_ledger').insert({
      investor_id: investorId,
      operation: 'GENESIS_PURCHASE',
      amount: quantity.toString(),
      tx_hash: txHash,
      previous_hash: 'DEMO_PREV_' + crypto.randomUUID().replace(/-/g, '').slice(0, 16),
      current_hash: 'DEMO_CURR_' + crypto.randomUUID().replace(/-/g, ''),
    });

    // 8. Audit log
    await supabase.from('audit_logs').insert({
      action: 'GENESIS_ORDER_COMPLETED',
      details: `Investor ${investorId} purchased ${quantity} PACHA @ $${unitPrice}. TxHash: ${txHash}. Treasury remaining: ${treasuryStock - quantity}`,
    });

    const { data: updatedBalance } = await supabase
      .from('balances')
      .select('available_tokens, available_usd')
      .eq('investor_id', investorId)
      .single();

    return NextResponse.json({
      success: true,
      orderId: newOrderData?.id,
      txHash,
      newTokenBalance: updatedBalance?.available_tokens || '0',
      newUsdBalance: updatedBalance?.available_usd || '0',
      treasuryRemaining: (treasuryStock - quantity).toString(),
    });
  } catch (error) {
    console.error('Genesis order error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
