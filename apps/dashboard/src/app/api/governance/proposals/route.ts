import { NextResponse } from 'next/server';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { schema } from '@pachanova/database';
import { createServerClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, relatedPNC } = body as { title?: string; description?: string; relatedPNC?: string };

    if (!title) {
      return NextResponse.json({ success: false, error: 'title required' }, { status: 400 });
    }

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

    // Fase42: compute Vertex prediction and store it
    let vertexPrediction: any = null;
    try {
      const path = require('path');
      const orqPath = path.join(process.cwd(), '../../orchestrator_agent.cjs');
      const { computeGovernanceVertexPrediction } = require(orqPath);
      vertexPrediction = await computeGovernanceVertexPrediction(title, relatedPNC || 'PNC-PAR-001');
    } catch (predErr: any) {
      console.warn('[GOV PROPOSALS CREATE] Vertex prediction compute error:', predErr.message);
    }

    // Fase36: create proposal (active, linked to PNC for gov + portfolio cards)
    const [newProposal] = await dbRaw.insert(schema.proposals).values({
      title,
      description: description || `Propuesta generada para ${relatedPNC || 'PNC general'}`,
      status: 'active',
      creatorInvestorId: investor.id,
      vertexPrediction: vertexPrediction ? JSON.stringify(vertexPrediction) : null,
      // relatedPropertyId can be resolved later if needed
    }).returning();

    client.end();

    return NextResponse.json({ success: true, proposal: newProposal, message: 'Propuesta creada. Vota con tu poder PACHA real.' });
  } catch (e: any) {
    console.error('[GOV PROPOSALS CREATE] ', e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
