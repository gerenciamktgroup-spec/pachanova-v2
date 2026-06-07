import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from "@/server/db";
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
    const userEmail = user?.email || 'investor@pachanova.local';

    const investor = await db.query.investors.findFirst({ where: eq(schema.investors.email, userEmail) });
    if (!investor) {
      return NextResponse.json({ success: false, error: 'Investor not found' }, { status: 404 });
    }

    // Fase42: compute Vertex prediction and store it
    let vertexPrediction: any = null;
    try {
      const fs = require('fs');
      const path = require('path');
      let orq: any = null;
      const paths = [
        path.resolve(process.cwd(), 'orchestrator_agent.cjs'),
        path.resolve(process.cwd(), '../orchestrator_agent.cjs'),
        path.resolve(process.cwd(), '../../orchestrator_agent.cjs'),
        path.resolve(process.cwd(), '../../../orchestrator_agent.cjs'),
        path.resolve(process.cwd(), '../../../../orchestrator_agent.cjs'),
        path.resolve(process.cwd(), '../../../../../orchestrator_agent.cjs'),
      ];
      for (const p of paths) {
        if (fs.existsSync(p)) {
          orq = eval('require')(p);
          break;
        }
      }
      if (orq && typeof orq.computeGovernanceVertexPrediction === 'function') {
        vertexPrediction = await orq.computeGovernanceVertexPrediction(title, relatedPNC || 'PNC-PAR-001');
      }
    } catch (predErr: any) {
      console.warn('[GOV PROPOSALS CREATE] Vertex prediction compute error:', predErr.message);
    }

    // Fase36: create proposal (active, linked to PNC for gov + portfolio cards)
    const [newProposal] = await db.insert(schema.proposals).values({
      title,
      description: description || `Propuesta generada para ${relatedPNC || 'PNC general'}`,
      status: 'active',
      creatorInvestorId: investor.id,
      vertexPrediction: vertexPrediction ? JSON.stringify(vertexPrediction) : null,
      // relatedPropertyId can be resolved later if needed
    }).returning();

    return NextResponse.json({ success: true, proposal: newProposal, message: 'Propuesta creada. Vota con tu poder PACHA real.' });
  } catch (e: any) {
    console.error('[GOV PROPOSALS CREATE] ', e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

