import { db } from "@/server/db";
import { schema } from "@pachanova/database";

export async function logDemoAuditEvent(action: string, details: string, userId?: string) {
  try {
    await db.insert(schema.auditLogs).values({
      action: `[DEMO] ${action}`,
      details,
      userId: userId || null,
    });
  } catch (error) {
    console.error("Failed to insert demo audit log:", error);
  }
}
