import { db } from "@/server/db";

import { assertSafeDemoAction } from "./demoActionGuards";
import { logDemoAuditEvent } from "./auditEvent";
import { logDemoIntegrationEvent } from "./integrationEvent";

export async function executeAdminUserReview(userId: string, action: string) {
  assertSafeDemoAction();

  try {
    return await db.transaction(async () => {
      // 1. Insert Integration Event
      try {
        await logDemoIntegrationEvent(
          "IDENTITY_PROVIDER",
          "REVIEW_FLAGGED",
          "SIMULATED",
          { userId, action }
        );
      } catch (e) {
        console.error("Failed to log demo integration event:", e);
      }

      // 2. Insert Audit Log
      try {
        await logDemoAuditEvent(
          "USER_REVIEW_FLAGGED",
          `Admin simulated marking user ${userId} for review (Action: ${action})`,
          userId.includes('-') && userId.length === 36 ? userId : undefined
        );
      } catch (e) {
        console.error("Failed to log demo audit event:", e);
      }

      return {
        ok: true,
        status: "REVIEW_FLAGGED",
        message: "Operación simulada. Usuario marcado para revisión local.",
        simulated: true,
      };
    });
  } catch (error) {
    console.warn("Local DB transaction failed in executeAdminUserReview, falling back to success mock:", error);
    return {
      ok: true,
      status: "REVIEW_FLAGGED",
      message: "Operación simulada. Usuario marcado para revisión local.",
      simulated: true,
    };
  }
}
