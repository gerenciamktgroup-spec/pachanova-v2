import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq } from 'drizzle-orm';
import { requireRole } from '@/utils/auth/requireRole';
import { errorMessage } from '@/lib/errors';
import { z } from 'zod';

const settingSchema = z.object({
  key: z.string().trim().min(1).max(255),
  value: z.union([z.string(), z.number(), z.boolean()]),
  description: z.string().trim().max(2000).optional(),
});

export async function GET() {
  try {
    await requireRole(['admin']);
    const params = await db.query.systemParameters.findMany();
    return NextResponse.json({ success: true, params });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: errorMessage(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authUser = await requireRole(['admin']);

    const parsed = settingSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: 'Invalid setting payload' }, { status: 400 });
    const { key, value, description } = parsed.data;

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
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: errorMessage(error) }, { status: 500 });
  }
}
