import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const m2 = parseFloat(url.searchParams.get('m2') || '1');

    // Read price per sqm from system_parameters if available
    const priceParam = await db.query.systemParameters.findFirst({
      where: eq(schema.systemParameters.key, 'oracle_price_per_sqm'),
    });
    const pricePerSqm = priceParam ? parseFloat(priceParam.value) : 10;

    const nav = m2 * pricePerSqm;
    const pricePerToken = pricePerSqm * 0.1;

    return NextResponse.json({
      success: true,
      nav,
      pricePerSqm,
      pricePerToken,
      source: priceParam ? 'system_parameter' : 'simulated_oracle'
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (process.env.DEMO_MODE !== 'true') {
      return NextResponse.json({ error: 'DEMO_MODE=true required' }, { status: 403 });
    }
    const body = await req.json();
    const { pricePerSqm } = body;
    if (!pricePerSqm || isNaN(Number(pricePerSqm))) {
      return NextResponse.json({ error: 'Invalid pricePerSqm' }, { status: 400 });
    }

    // Upsert oracle price in system_parameters
    const existing = await db.query.systemParameters.findFirst({
      where: eq(schema.systemParameters.key, 'oracle_price_per_sqm'),
    });
    if (existing) {
      await db.update(schema.systemParameters)
        .set({ value: String(pricePerSqm), updatedAt: new Date() })
        .where(eq(schema.systemParameters.key, 'oracle_price_per_sqm'));
    } else {
      await db.insert(schema.systemParameters).values({
        key: 'oracle_price_per_sqm',
        value: String(pricePerSqm),
        description: 'Admin-controlled price per sqm for oracle valuation',
      });
    }

    await db.insert(schema.auditLogs).values({
      action: 'ORACLE_PRICE_UPDATED',
      details: `Admin updated oracle price to $${pricePerSqm}/m²`,
    });

    return NextResponse.json({ success: true, pricePerSqm: Number(pricePerSqm) });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
