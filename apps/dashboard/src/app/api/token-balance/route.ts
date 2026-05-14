import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const investorId = searchParams.get('investorId');
    
    let balanceRecord;
    if (investorId) {
      balanceRecord = await db.query.balances.findFirst({
        where: eq(schema.balances.investorId, investorId),
      });
    } else {
      balanceRecord = await db.query.balances.findFirst();
    }

    if (!balanceRecord) {
      return NextResponse.json({ success: false, error: 'Balance not found' }, { status: 404 });
    }

    const tokens = parseFloat(balanceRecord.availableTokens || "0");
    const m2 = (tokens * 0.1).toFixed(2);

    return NextResponse.json({ 
      success: true, 
      balance: {
        usd: balanceRecord.availableUsd,
        tokens: balanceRecord.availableTokens,
        m2
      } 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
