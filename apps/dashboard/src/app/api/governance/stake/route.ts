import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq } from 'drizzle-orm';
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
    const userEmail = user?.email || 'investor@pachanova.local';

    const investor = await db.query.users.findFirst({
      where: eq(schema.users.email, userEmail),
    });
    if (!investor) {
      return NextResponse.json({ success: false, error: 'Investor not found for current session' }, { status: 404 });
    }

    // Get current stake (or init 0)
    const stakeRow = await db.query.stakes.findFirst({
      where: eq(schema.stakes.investorId, investor.id),
    });
    const currentStaked = stakeRow ? parseFloat(stakeRow.stakedAmount || '0') : 0;

    let newStaked: number;
    const userBalances = await db.query.balances.findMany({
      where: eq(schema.balances.investorId, investor.id)
    });

    if (action === 'stake') {
      const totalAvailable = userBalances.reduce((sum, b) => sum + parseFloat(b.availableTokens || '0'), 0);
      if (totalAvailable < stakeAmt) {
        return NextResponse.json({ success: false, error: `Saldo de tokens insuficiente. Tienes ${totalAvailable} PACHA disponibles y requieres ${stakeAmt}.` }, { status: 400 });
      }

      let remainingToDeduct = stakeAmt;
      for (const bal of userBalances) {
        if (remainingToDeduct <= 0) break;
        const avail = parseFloat(bal.availableTokens || '0');
        const locked = parseFloat(bal.lockedTokens || '0');
        if (avail <= 0) continue;
        
        const toDeduct = Math.min(avail, remainingToDeduct);
        const nextAvail = avail - toDeduct;
        const nextLocked = locked + toDeduct;
        remainingToDeduct -= toDeduct;
        
        await db.update(schema.balances).set({
          availableTokens: nextAvail.toString(),
          lockedTokens: nextLocked.toString(),
          lastUpdatedAt: new Date()
        }).where(eq(schema.balances.id, bal.id));
      }

      newStaked = currentStaked + stakeAmt;
    } else {
      if (currentStaked < stakeAmt) {
        return NextResponse.json({ success: false, error: `Monto en staking insuficiente. Tienes ${currentStaked} PACHA en staking y requieres liberar ${stakeAmt}.` }, { status: 400 });
      }

      let remainingToRelease = stakeAmt;
      for (const bal of userBalances) {
        if (remainingToRelease <= 0) break;
        const avail = parseFloat(bal.availableTokens || '0');
        const locked = parseFloat(bal.lockedTokens || '0');
        if (locked <= 0) continue;
        
        const toRelease = Math.min(locked, remainingToRelease);
        const nextAvail = avail + toRelease;
        const nextLocked = locked - toRelease;
        remainingToRelease -= toRelease;
        
        await db.update(schema.balances).set({
          availableTokens: nextAvail.toString(),
          lockedTokens: nextLocked.toString(),
          lastUpdatedAt: new Date()
        }).where(eq(schema.balances.id, bal.id));
      }

      newStaked = currentStaked - stakeAmt;
    }

    // Upsert stake row
    if (stakeRow) {
      await db.update(schema.stakes).set({
        stakedAmount: newStaked.toString(),
        updatedAt: new Date(),
      }).where(eq(schema.stakes.id, stakeRow.id));
    } else {
      await db.insert(schema.stakes).values({
        investorId: investor.id,
        stakedAmount: newStaked.toString(),
      });
    }

    // Optional audit log (Fase16+ pattern)
    try {
      await db.insert(schema.auditLogs).values({
        action: `GOVERNANCE_${action.toUpperCase()}_PACHA`,
        userId: investor.id,
        details: JSON.stringify({ amount: stakeAmt, previousStaked: currentStaked, newStaked, email: userEmail }),
      });
    } catch (auditErr: any) {
      console.warn('[Fase42 stake audit] skipped:', auditErr?.message);
    }

    // Fresh power for response (holdings + new staked)
    // Note: computePachaVotingPower no longer takes 'client' because it should use 'db'
    // Let's pass null for client if it requires it, or just let it use db internally
    const power = await computePachaVotingPower(null as any, investor.id);

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
    const userEmail = user?.email || 'investor@pachanova.local';

    const investor = await db.query.users.findFirst({ where: eq(schema.users.email, userEmail) });

    if (!investor) {
      return NextResponse.json({ success: false, error: 'Investor not found' }, { status: 404 });
    }

    const power = await computePachaVotingPower(null as any, investor.id);

    let currentStake = null;
    try {
      currentStake = await db.query.stakes.findFirst({ where: eq(schema.stakes.investorId, investor.id) });
    } catch {}

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

