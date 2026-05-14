import { db } from "@/server/db";
import { schema } from "@pachanova/database";

export async function logDemoIntegrationEvent(
  provider: string,
  eventType: string,
  status: string,
  payload?: Record<string, unknown>
) {
  try {
    const [inserted] = await db.insert(schema.integrationEvents).values({
      provider,
      eventType,
      status,
      payload: payload || null,
      simulated: true,
    }).returning({ id: schema.integrationEvents.id });
    return inserted.id;
  } catch (error) {
    console.error("Failed to insert demo integration event:", error);
    return null;
  }
}
