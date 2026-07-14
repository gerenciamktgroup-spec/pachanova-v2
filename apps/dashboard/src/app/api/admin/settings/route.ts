import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq } from 'drizzle-orm';
import { requireRole } from '@/utils/auth/requireRole';

export async function GET() {
  try {
    await requireRole(['admin']);
    const params = await db.query.systemParameters.findMany();
    return NextResponse.json({ success: true, params });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authUser = await requireRole(['admin']);

    const body = await req.json();
    const { key, value, description } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ success: false, error: 'Missing parameters key or value' }, { status: 400 });
    }

    const existing = await db.query.systemParameters.findFirst({
      where: eq(schema.systemParameters.key, key),
    });

    if (existing) {
      await db.update(schema.systemParameters)
        .set({
          value: String(value),
          updatedAt: new Date(),
        })
        .where(eq(schema.systemParameters.key, key));
    } else {
      await db.insert(schema.systemParameters).values({
        key,
        value: String(value),
        description: description || '',
      });
    }

    await db.insert(schema.auditLogs).values({
      action: 'SYSTEM_PARAMETER_CHANGED',
      details: `Admin ${authUser.email} updated system parameter [${key}] to value: ${value}`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
