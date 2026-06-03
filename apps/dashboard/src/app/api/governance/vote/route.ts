import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq, and, sql } from 'drizzle-orm';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { createServerClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { proposalId, choice } = body as { proposalId?: string; choice?: 'for' | 'against' | 'abstain' };

    if (!proposalId || !choice || !['for', 'against', 'abstain'].includes(choice)) {
      return NextResponse.json({ success: false, error: 'proposalId and valid choice (for/against/abstain) required' }, { status: 400 });
    }

    // Resolve current investor via Supabase (demo fallback like investor dashboard)
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

    // Compute real total PACHA voting power (available + locked across all properties)
    const powerRows = await client`
      SELECT COALESCE(SUM(available_tokens::numeric + locked_tokens::numeric), 0) as total_power
      FROM balances
      WHERE investor_id = ${investor.id}
    `;
    const votingPower = parseFloat(powerRows[0]?.total_power || '0');

    if (votingPower <= 0) {
      client.end();
      return NextResponse.json({ success: false, error: 'No PACHA holdings detected. Voting power is 0.' }, { status: 400 });
    }

    // Check proposal active
    const proposal = await dbRaw.query.proposals.findFirst({
      where: eq(schema.proposals.id, proposalId),
    });

    if (!proposal || proposal.status !== 'active') {
      client.end();
      return NextResponse.json({ success: false, error: 'Proposal not found or not active' }, { status: 404 });
    }

    // Check existing vote (unique constraint will also enforce)
    const existing = await dbRaw.query.votes.findFirst({
      where: and(
        eq(schema.votes.proposalId, proposalId),
        eq(schema.votes.investorId, investor.id)
      ),
    });

    if (existing) {
      client.end();
      return NextResponse.json({ 
        success: false, 
        error: 'Ya has votado en esta propuesta', 
        existingVote: { choice: existing.choice, power: existing.votingPower, at: existing.createdAt } 
      }, { status: 409 });
    }

    // Insert vote with snapshot power (weighted by real holdings)
    const [newVote] = await dbRaw.insert(schema.votes).values({
      proposalId,
      investorId: investor.id,
      choice,
      votingPower: votingPower.toString(),
    }).returning();

    client.end();

    // Optional: audit log (if table exists)
    try {
      await db.insert(schema.auditLogs).values({
        action: 'GOVERNANCE_VOTE',
        userId: investor.id,
        metadata: { proposalId, choice, votingPower, voteId: newVote.id },
      });
    } catch {}

    return NextResponse.json({ 
      success: true, 
      vote: newVote,
      message: `Voto registrado: ${choice} con poder ${votingPower.toLocaleString()} PACHA`,
      yourPower: votingPower
    });
  } catch (error: any) {
    console.error('[GOVERNANCE VOTE API] Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal error voting' }, { status: 500 });
  }
}

// GET current user's vote for a proposal + summary counts (for UI refresh)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const proposalId = searchParams.get('proposalId');

    if (!proposalId) {
      return NextResponse.json({ success: false, error: 'proposalId required' }, { status: 400 });
    }

    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userEmail = user?.email || 'demo.investor.holder@pachanova.local';

    const client = postgres(process.env.DATABASE_URL!);
    const dbRaw = drizzle(client, { schema });

    const investor = await dbRaw.query.investors.findFirst({ where: eq(schema.investors.email, userEmail) });

    let myVote = null;
    if (investor) {
      myVote = await dbRaw.query.votes.findFirst({
        where: and(eq(schema.votes.proposalId, proposalId), eq(schema.votes.investorId, investor.id)),
      });
    }

    // Aggregate counts (real votes + weighted)
    const tally = await client`
      SELECT 
        choice,
        COUNT(*)::int as vote_count,
        COALESCE(SUM(voting_power::numeric),0) as total_power
      FROM votes
      WHERE proposal_id = ${proposalId}
      GROUP BY choice
    `;

    const summary = { for: { count: 0, power: 0 }, against: { count: 0, power: 0 }, abstain: { count: 0, power: 0 } };
    for (const row of tally) {
      const c = row.choice as 'for'|'against'|'abstain';
      if (summary[c]) {
        summary[c].count = row.vote_count;
        summary[c].power = parseFloat(row.total_power || '0');
      }
    }

    client.end();
    return NextResponse.json({ success: true, myVote, summary, yourEmail: userEmail });
  } catch (error: any) {
    console.error('[GOVERNANCE VOTE GET] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
