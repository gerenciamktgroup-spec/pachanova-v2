import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import { assertSafeDemoAction } from "./demoActionGuards";
import { logDemoAuditEvent } from "./auditEvent";
import { logDemoIntegrationEvent } from "./integrationEvent";
import { eq } from "drizzle-orm";

export async function executeFideicomisoOperation(
  action: "propose" | "sign_fiduciario" | "sign_admin" | "execute_simulated" | "reset",
  operationId?: string,
  userId?: string
) {
  assertSafeDemoAction();

  return await db.transaction(async (tx) => {
    switch (action) {
      case "propose": {
        const [op] = await tx.insert(schema.fideicomisoOperations).values({
          type: "DEMO_EMISSION",
          status: "proposed",
          requiredSignatures: 3,
          currentSignatures: 0,
          createdBy: userId || "system",
          simulated: true,
        }).returning();

        await logDemoAuditEvent("FIDEICOMISO_PROPOSE", `Proposed simulated operation ${op.id}`, userId);
        await logDemoIntegrationEvent("CONTRACTS", "OPERATION_PROPOSED", "SIMULATED", { opId: op.id });

        return { ok: true, status: "proposed", message: "Operación propuesta simulada", simulated: true, operationId: op.id };
      }
      
      case "sign_fiduciario": {
        if (!operationId) throw new Error("operationId required");
        
        await tx.insert(schema.fideicomisoSignatures).values({
          operationId,
          signerId: userId || "fiduciario",
          signerRole: "fiduciario",
          signatureHash: "simulated_hash_fiduciario"
        });

        const [op] = await tx.update(schema.fideicomisoOperations)
          .set({ currentSignatures: 1, status: "fiduciario_signed" })
          .where(eq(schema.fideicomisoOperations.id, operationId))
          .returning();

        await logDemoAuditEvent("FIDEICOMISO_SIGN", `Fiduciario signed simulated operation ${operationId}`, userId);
        return { ok: true, status: op.status, message: "Firma fiduciario registrada", simulated: true };
      }

      case "sign_admin": {
        if (!operationId) throw new Error("operationId required");

        await tx.insert(schema.fideicomisoSignatures).values({
          operationId,
          signerId: userId || "admin",
          signerRole: "admin",
          signatureHash: "simulated_hash_admin"
        });

        const [op] = await tx.update(schema.fideicomisoOperations)
          .set({ currentSignatures: 2, status: "quorum_reached" })
          .where(eq(schema.fideicomisoOperations.id, operationId))
          .returning();

        await logDemoAuditEvent("FIDEICOMISO_SIGN", `Admin signed simulated operation ${operationId}. Quorum reached.`, userId);
        return { ok: true, status: op.status, message: "Firma admin registrada. Quorum alcanzado.", simulated: true };
      }

      case "execute_simulated": {
        if (!operationId) throw new Error("operationId required");
        
        const op = await tx.query.fideicomisoOperations.findFirst({
          where: eq(schema.fideicomisoOperations.id, operationId)
        });

        if (!op || op.currentSignatures < 2) {
          throw new Error("Quorum not reached");
        }

        const [updated] = await tx.update(schema.fideicomisoOperations)
          .set({ status: "executed_simulated", executedAt: new Date() })
          .where(eq(schema.fideicomisoOperations.id, operationId))
          .returning();

        await logDemoIntegrationEvent("CONTRACTS", "OPERATION_EXECUTED", "SIMULATED", { opId: operationId });
        await logDemoAuditEvent("FIDEICOMISO_EXECUTE", `Simulated execution of operation ${operationId}`, userId);
        
        return { ok: true, status: updated.status, message: "Operación ejecutada localmente", simulated: true };
      }

      case "reset": {
        if (!operationId) throw new Error("operationId required");
        // We only reset this specific operation state, per instructions.
        await tx.delete(schema.fideicomisoSignatures).where(eq(schema.fideicomisoSignatures.operationId, operationId));
        await tx.update(schema.fideicomisoOperations)
          .set({ status: "proposed", currentSignatures: 0, executedAt: null })
          .where(eq(schema.fideicomisoOperations.id, operationId));

        return { ok: true, status: "proposed", message: "Estado de operación demo reiniciado", simulated: true };
      }

      default:
        throw new Error("Invalid action");
    }
  });
}
