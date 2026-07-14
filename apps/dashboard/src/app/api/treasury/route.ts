export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq, sql, desc } from 'drizzle-orm';

export async function GET() {
  try {
    // Treasury balance from system_parameters
    const treasuryParam = await db.query.systemParameters.findFirst({
      where: eq(schema.systemParameters.key, 'treasury_balance_usd'),
    });

    // Tokens sold & USD raised from filled orders
    const tokenOrders = await db.query.tokenOrders.findMany({
      where: eq(schema.tokenOrders.status, 'completed'),
    });

    const tokensSold = tokenOrders.reduce((acc, o) => acc + Number(o.quantity ?? 0), 0);
    const totalUsdRaised = tokenOrders.reduce((acc, o) => acc + Number(o.totalAmount ?? 0), 0);
    const totalSupply = 500000;
    const utilizationPercent = (tokensSold / totalSupply) * 100;

    // P2P volume
    const p2pOrders = await db.query.p2pOrders.findMany({
      where: eq(schema.p2pOrders.status, 'filled'),
    });
    const p2pVolume = p2pOrders.reduce((acc, o) => acc + Number(o.pricePerToken ?? 0) * Number(o.quantity ?? 0), 0);

    return NextResponse.json({
      success: true,
      treasury: {
        balanceUsd: treasuryParam?.value ?? "0",
        tokensSold,
        totalSupply,
        totalUsdRaised,
        p2pVolume,
        utilizationPercent: utilizationPercent.toFixed(2),
      }
    });
  } catch (error) {
    console.error('Treasury API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
