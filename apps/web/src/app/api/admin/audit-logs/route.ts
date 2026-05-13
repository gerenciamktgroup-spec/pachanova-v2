import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const logs = await db.query.auditLogs.findMany({
      orderBy: [desc(schema.auditLogs.timestamp)],
      limit: 100,
    });
    return NextResponse.json({ success: true, logs });
  } catch (error) {
    console.error("Audit Logs API Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch audit logs', logs: [] }, { status: 500 });
  }
}
