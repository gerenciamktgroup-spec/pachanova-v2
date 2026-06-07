import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const usersData = await db
      .select({
        id: schema.users.id,
        email: schema.users.email,
        kycStatus: schema.users.kycStatus,
        tokenBalance: schema.balances.availableTokens,
      })
      .from(schema.users)
      .leftJoin(schema.balances, eq(schema.users.id, schema.balances.investorId));
    
    return NextResponse.json({ success: true, users: usersData });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 });
  }
}
