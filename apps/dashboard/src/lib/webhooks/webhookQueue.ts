import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq, and, lte } from 'drizzle-orm';
import { errorMessage } from '@/lib/errors';

// ─── Enqueue a webhook for async processing ───────────────────────────────────
export async function enqueueWebhook({
  provider,
  eventType,
  payload,
  rawBody,
  headers,
  isDemo = false,
}: {
  provider: string;
  eventType: string;
  payload: unknown;
  rawBody?: string;
  headers?: Record<string, string>;
  isDemo?: boolean;
}): Promise<string> {
  const result = await db.insert(schema.webhookQueue).values({
    provider,
    eventType,
    payload,
    rawBody,
    headers,
    isDemo,
    status: 'pending',
    nextRetryAt: new Date(),
  }).returning({ id: schema.webhookQueue.id });
  return result[0].id;
}

// ─── Process pending webhooks (called by the polling endpoint) ─────────────────
export async function processPendingWebhooks(): Promise<{ processed: number; failed: number }> {
  const now = new Date();

  // Pick up to 10 items that are ready to process
  const pending = await db.query.webhookQueue.findMany({
    where: and(
      eq(schema.webhookQueue.status, 'pending'),
      lte(schema.webhookQueue.nextRetryAt, now)
    ),
    limit: 10,
    orderBy: (t, { asc }) => [asc(t.createdAt)],
  });

  let processed = 0;
  let failed = 0;

  for (const job of pending) {
    // Mark as processing
    await db.update(schema.webhookQueue)
      .set({ status: 'processing', attempts: job.attempts + 1 })
      .where(eq(schema.webhookQueue.id, job.id));

    try {
      await processWebhookJob(job);
      await db.update(schema.webhookQueue)
        .set({ status: 'done', processedAt: new Date() })
        .where(eq(schema.webhookQueue.id, job.id));
      processed++;
    } catch (error: unknown) {
      const message = errorMessage(error);
      const nextAttempt = job.attempts + 1;
      const maxAttempts = job.maxAttempts;
      if (nextAttempt >= maxAttempts) {
        await db.update(schema.webhookQueue)
          .set({ status: 'failed', lastError: message, processedAt: new Date() })
          .where(eq(schema.webhookQueue.id, job.id));
      } else {
        // Exponential backoff: 30s, 2min, 10min
        const backoffSeconds = [30, 120, 600][nextAttempt - 1] || 600;
        const nextRetry = new Date(Date.now() + backoffSeconds * 1000);
        await db.update(schema.webhookQueue)
          .set({ status: 'pending', lastError: message, nextRetryAt: nextRetry })
          .where(eq(schema.webhookQueue.id, job.id));
      }
      failed++;
    }
  }

  return { processed, failed };
}

// ─── Individual job processor ──────────────────────────────────────────────────
async function processWebhookJob(job: typeof schema.webhookQueue.$inferSelect): Promise<void> {
  const { provider, eventType, payload } = job;

  await db.insert(schema.auditLogs).values({
    action: `WEBHOOK_PROCESSED`,
    details: `Queue job ${job.id}: ${provider} ${eventType} (attempt ${job.attempts + 1})`,
  });

  await db.insert(schema.integrationEvents).values({
    provider,
    eventType: `QUEUE_${eventType}`,
    payload,
    simulated: job.isDemo,
  });

  // Provider-specific processing hooks can be added here
  // e.g. if (provider === 'MERCADOPAGO') await processMercadoPagoEvent(payload)
}
