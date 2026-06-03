import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { createServerClient } from '@/utils/supabase/server';
import { computePachaVotingPower } from '@/lib/governance/computePachaPower';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, amount } = body as { action?: 'stake' | 'unstake'; amount?: number | string };

    if (!action || !['stake', 'unstake'].includes(action)) {
      return NextResponse.json({ success: false, error: 'action must be "stake" or "unstake"' }, { status: 400 });
    }
    const rawAmt = parseFloat(String(amount || '0'));
    if (!rawAmt || rawAmt <= 0) {
      return NextResponse.json({ success: false, error: 'positive amount required' }, { status: 400 });
    }
    const stakeAmt = rawAmt;

    // Resolve investor (same pattern as vote/proposals for demo sessions)
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userEmail = user?.email || 'demo.investor.holder@pachanova.local';

    const client = postgres(process.env.DATABASE_URL!);
    const dbRaw = drizzle(client, { schema });

    const investor = await dbRaw.query.investors.findFirst({
      where: eq(schema.investors.email, userEmail),
    });
    if (!investor) {
      client.end();
      return NextResponse.json({ success: false, error: 'Investor not found for current session' }, { status: 404 });
    }

    // Get current stake (or init 0)
    let stakeRow = await dbRaw.query.stakes.findFirst({
      where: eq(schema.stakes.investorId, investor.id),
    });
    const currentStaked = stakeRow ? parseFloat(stakeRow.stakedAmount || '0') : 0;

    let newStaked: number;
    if (action === 'stake') {
      newStaked = currentStaked + stakeAmt;
      // Fase42: no hard cap (boost via lock; in prod would transfer/lock tokens from balance/erc20)
    } else {
      newStaked = Math.max(0, currentStaked - stakeAmt);
    }

    // Upsert stake row
    if (stakeRow) {
      await dbRaw.update(schema.stakes).set({
        stakedAmount: newStaked.toString(),
        updatedAt: new Date(),
      }).where(eq(schema.stakes.id, stakeRow.id));
    } else {
      await dbRaw.insert(schema.stakes).values({
        investorId: investor.id,
        stakedAmount: newStaked.toString(),
      });
    }

    // Optional audit log (Fase16+ pattern)
    try {
      await db.insert(schema.auditLogs).values({
        action: `GOVERNANCE_${action.toUpperCase()}_PACHA`,
        userId: investor.id,
        metadata: { amount: stakeAmt, previousStaked: currentStaked, newStaked, email: userEmail },
      });
    } catch (auditErr: any) {
      console.warn('[Fase42 stake audit] skipped:', auditErr?.message);
    }

    // Fresh power for response (holdings + new staked)
    const power = await computePachaVotingPower(client, investor.id);

    client.end();

    return NextResponse.json({
      success: true,
      action,
      amount: stakeAmt,
      previousStaked: currentStaked,
      newStakedAmount: newStaked,
      totalPower: power.total,
      baseHoldings: power.holdings,
      message: `${action === 'stake' ? 'Staked' : 'Unstaked'} ${stakeAmt} PACHA. Staked total now: ${newStaked} (power: ${power.total.toLocaleString()})`,
    });
  } catch (error: any) {
    console.error('[GOVERNANCE STAKE API] Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal error in stake' }, { status: 500 });
  }
}

// GET: current stake status + power breakdown for the logged investor (used by client refresh)
export async function GET(req: Request) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userEmail = user?.email || 'demo.investor.holder@pachanova.local';

    const client = postgres(process.env.DATABASE_URL!);
    const dbRaw = drizzle(client, { schema });

    const investor = await dbRaw.query.investors.findFirst({ where: eq(schema.investors.email, userEmail) });

    if (!investor) {
      client.end();
      return NextResponse.json({ success: false, error: 'Investor not found' }, { status: 404 });
    }

    const power = await computePachaVotingPower(client, investor.id);

    let currentStake = null;
    try {
      currentStake = await dbRaw.query.stakes.findFirst({ where: eq(schema.stakes.investorId, investor.id) });
    } catch {}

    client.end();

    return NextResponse.json({
      success: true,
      stakedAmount: power.staked,
      baseHoldings: power.holdings,
      totalPower: power.total,
      stakeRow: currentStake ? {
        id: currentStake.id,
        stakedAmount: currentStake.stakedAmount,
        updatedAt: currentStake.updatedAt,
      } : null,
      investorId: investor.id,
    });
  } catch (error: any) {
    console.error('[GOVERNANCE STAKE GET] Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to load stake status' }, { status: 500 });
  }
}
