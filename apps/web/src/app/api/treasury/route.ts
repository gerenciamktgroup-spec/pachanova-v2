import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Lee system_parameters WHERE key = 'treasury_balance_usd'
    const { data: systemParam } = await supabase
      .from('system_parameters')
      .select('value')
      .eq('key', 'treasury_balance_usd')
      .single();

    // 2. Hace SUM de token_orders WHERE status = 'completed'
    // Como Supabase JS no tiene SUM directo sin RPC, lo sumamos en memoria o usando aggregation si la version lo soporta.
    // Usaremos memoria para simpleza, o RPC si existe, pero .select() todo es facil si hay pocos.
    const { data: tokenOrders } = await supabase
      .from('token_orders')
      .select('quantity, total_amount')
      .eq('status', 'completed');

    const totalTokensSold = tokenOrders?.reduce((acc, order) => acc + Number(order.quantity), 0) || 0;
    const totalUsdRaised = tokenOrders?.reduce((acc, order) => acc + Number(order.total_amount), 0) || 0;

    // 3. Hace SUM de p2p_trades
    const { data: p2pTrades } = await supabase
      .from('p2p_trades')
      .select('total_amount');

    const p2pVolume = p2pTrades?.reduce((acc, trade) => acc + Number(trade.total_amount), 0) || 0;

    const totalSupply = 500000;
    const utilizationPercent = (totalTokensSold / totalSupply) * 100;

    // 4. Return
    return NextResponse.json({
      success: true,
      treasury: {
        balanceUsd: systemParam?.value || "0",
        totalSupply: totalSupply,
        tokensSold: totalTokensSold,
        tokensAvailable: totalSupply - totalTokensSold,
        totalUsdRaised: totalUsdRaised,
        p2pVolume: p2pVolume,
        utilizationPercent: utilizationPercent
      }
    });
  } catch (error) {
    console.error("Treasury API Error:", error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
