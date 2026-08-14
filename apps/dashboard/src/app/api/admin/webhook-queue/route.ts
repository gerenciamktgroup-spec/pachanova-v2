import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq, desc } from 'drizzle-orm';
import { processPendingWebhooks } from '@/lib/webhooks/webhookQueue';
import { requireRole } from '@/utils/auth/requireRole';
import { errorMessage } from '@/lib/errors';

// GET /api/admin/webhook-queue — list recent jobs with status
export async function GET(req: Request) {
  try {
    await requireRole(['admin', 'operator']);
    const url = new URL(req.url);
    const status = url.searchParams.get('status'); // optional filter

    const jobs = await db.query.webhookQueue.findMany({
      where: status ? eq(schema.webhookQueue.status, status) : undefined,
      orderBy: [desc(schema.webhookQueue.createdAt)],
      limit: 50,
    });

    const summary = {
      pending: jobs.filter(j => j.status === 'pending').length,
      processing: jobs.filter(j => j.status === 'processing').length,
      done: jobs.filter(j => j.status === 'done').length,
      failed: jobs.filter(j => j.status === 'failed').length,
    };

    return NextResponse.json({ success: true, summary, jobs });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: errorMessage(error) }, { status: 500 });
  }
}

// POST /api/admin/webhook-queue — trigger processing of pending jobs
export async function POST() {
  try {
    await requireRole(['admin', 'operator']);
    if (process.env.DEMO_MODE !== 'true') {
      // In production, this would be called by a cron job or queue worker
      // For now allow admins to trigger manually
    }
    const result = await processPendingWebhooks();
    return NextResponse.json({ success: true, ...result });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: errorMessage(error) }, { status: 500 });
  }
}
