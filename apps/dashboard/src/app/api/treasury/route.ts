import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    // Aquí el treasury sería un system parameter o una cuenta específica
    const treasuryParam = await db.query.systemParameters.findFirst({
      where: eq(schema.systemParameters.key, 'treasury_balance_usd'),
    });

    return NextResponse.json({ 
      success: true, 
      treasury: {
        usd: treasuryParam ? treasuryParam.value : "0",
        totalTokens: 500000 // Supply inmutable de PACHA
      } 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
