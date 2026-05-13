import { db } from "@/server/db";

import { assertSafeDemoAction } from "./demoActionGuards";
import { logDemoAuditEvent } from "./auditEvent";
import { logDemoIntegrationEvent } from "./integrationEvent";

export async function executeAdminUserReview(userId: string, action: string) {
  assertSafeDemoAction();

  return await db.transaction(async () => {
    // In a real app we'd update the user's KYC state, but the prompt says:
    // "No aprobar KYC real. No suspender real. Solo crear audit_log e integration_event demo."

    // 1. Insert Integration Event
    await logDemoIntegrationEvent(
      "IDENTITY_PROVIDER",
      "REVIEW_FLAGGED",
      "SIMULATED",
      { userId, action }
    );

    // 2. Insert Audit Log
    await logDemoAuditEvent(
      "USER_REVIEW_FLAGGED",
      `Admin simulated marking user ${userId} for review (Action: ${action})`,
      userId // we can use the target user ID or omit. Let's use target.
    );

    return {
      ok: true,
      status: "REVIEW_FLAGGED",
      message: "Operación simulada. Usuario marcado para revisión local.",
      simulated: true,
    };
  });
}
