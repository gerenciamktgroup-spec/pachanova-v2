import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const bodySchema = z.object({
  investorId: z.string().min(1),  // No forzar UUID — puede ser cualquier ID de Supabase
  amountUsd: z.number().positive().max(1000000),
});

export async function POST(req: Request) {
  try {
    const isDemo = process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_IS_DEMO === 'true';
    if (!isDemo) return NextResponse.json({ error: 'DEMO_MODE=true required' }, { status: 403 });

    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Parámetros inválidos', details: result.error }, { status: 400 });
    }

    const { investorId, amountUsd } = result.data;

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({
        success: true,
        message: `Depósito de $${amountUsd} USD procesado (modo offline)`,
        newBalance: amountUsd,
      });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // maybeSingle — no crashea si el registro no existe
    const { data: existing } = await supabase
      .from('balances')
      .select('*')
      .eq('investor_id', investorId)
      .maybeSingle();

    let newBalance: number;

    if (!existing) {
      // Crear balance si no existe
      newBalance = amountUsd;
      const { error: insertError } = await supabase.from('balances').insert({
        investor_id: investorId,
        available_usd: amountUsd.toString(),
        locked_usd: '0',
        available_tokens: '0',
        locked_tokens: '0',
        reserved_tokens: '0',
      });
      if (insertError) {
        return NextResponse.json({ error: 'Error al crear balance: ' + insertError.message }, { status: 500 });
      }
    } else {
      newBalance = Number(existing.available_usd || 0) + amountUsd;
      const { error: updateError } = await supabase
        .from('balances')
        .update({ available_usd: newBalance.toString() })
        .eq('investor_id', investorId);
      if (updateError) {
        return NextResponse.json({ error: 'Error al actualizar balance: ' + updateError.message }, { status: 500 });
      }
    }

    await supabase.from('audit_logs').insert({
      action: 'DEMO_SIMULATED_DEPOSIT',
      details: `Depósito simulado de $${amountUsd} USD para inversor ${investorId}. Nuevo saldo: $${newBalance} USD.`,
    });

    // integration_events — ignorar si la tabla no existe
    await supabase.from('integration_events').insert({
      provider: 'DEMO_PAYMENT_GATEWAY',
      event_type: 'SIMULATED_DEPOSIT_COMPLETED',
      payload: { investorId, amountUsd, newBalance },
      simulated: true,
    }).then(() => {}).catch(() => {});

    return NextResponse.json({
      success: true,
      message: `Depósito de $${amountUsd} USD acreditado exitosamente.`,
      newBalance,
    });
  } catch (error) {
    console.error('Simulated deposit error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
