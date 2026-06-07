import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq } from 'drizzle-orm';
import { createServerClient } from '@/utils/supabase/server';

// POST: Add a new Fideicomiso Audit Trail (Fase 52)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { propertyId, documentType, ipfsHash, arweaveTxId, metadata } = body;

    if (!propertyId || !documentType || !ipfsHash) {
      return NextResponse.json({ success: false, error: 'propertyId, documentType, and ipfsHash are required' }, { status: 400 });
    }

    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userEmail = user?.email || 'investor@pachanova.local';

    const investor = await db.query.users.findFirst({
      where: eq(schema.users.email, userEmail),
    });

    if (!investor) {
      return NextResponse.json({ success: false, error: 'Investor not found' }, { status: 404 });
    }

    const newAudit = await db.insert(schema.fideicomisoAudits).values({
      propertyId,
      documentType,
      ipfsHash,
      arweaveTxId,
      metadata: metadata ? JSON.stringify(metadata) : null,
      createdBy: investor.id,
    }).returning();

    return NextResponse.json({ success: true, audit: newAudit[0] });
  } catch (error: any) {
    console.error('[API FIDEICOMISO AUDIT] POST Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET: Retrieve Audit Trails for a property
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const propertyId = searchParams.get('propertyId');

    if (!propertyId) {
      return NextResponse.json({ success: false, error: 'propertyId is required' }, { status: 400 });
    }

    const audits = await db.query.fideicomisoAudits.findMany({
      where: eq(schema.fideicomisoAudits.propertyId, propertyId),
      orderBy: (audits, { desc }) => [desc(audits.createdAt)],
    });

    return NextResponse.json({ success: true, audits });
  } catch (error: any) {
    console.error('[API FIDEICOMISO AUDIT] GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
