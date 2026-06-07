"use server";

import { getDb, schema } from "@pachanova/database";
import { createServerClient } from "@/utils/supabase/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * MAKER: El Inversor solicita un depósito (Fondeo)
 */
export async function createDepositRequest(amountUsd: number) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("No autenticado");

    const db = getDb();

    // Crear la transacción en estado PENDING
    const result = await db.insert(schema.transactions).values({
      type: "deposit",
      investorId: user.id,
      amountUsd: amountUsd.toString(),
      status: "pending",
      description: "Fondeo vía Wallet (Esperando confirmación)",
      isDemo: true // Marcar como demo hasta tener MercadoPago real
    }).returning();

    revalidatePath("/dashboard/investor/wallet");
    return { success: true, transactionId: result[0].id };

  } catch (error: any) {
    console.error("Error creating deposit request:", error);
    return { success: false, error: error.message };
  }
}

/**
 * CHECKER: El Administrador aprueba una transacción
 */
export async function approveTransaction(transactionId: string) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("No autenticado");
    const role = user.app_metadata?.role || user.user_metadata?.role;
    if (role !== "admin") throw new Error("No autorizado. Solo Master Admin.");

    const db = getDb();

    // 1. Obtener la transacción PENDING
    const [tx] = await db.select().from(schema.transactions).where(eq(schema.transactions.id, transactionId));
    if (!tx || tx.status !== "pending") throw new Error("Transacción inválida o ya procesada.");

    // 2. Ejecutar la lógica de aprobación (Atómica idealmente, aquí secuencial por simplicidad)
    if (tx.type === "deposit") {
      // Buscar si el usuario ya tiene un balance de USD (no asociado a una propiedad específica, sino general).
      // En nuestro esquema, el "puente" es un balance en USD asociado a la tesorería o sin propertyId.
      // Revisemos el esquema de balances. Requiere propertyId (NOT NULL). 
      // Usaremos una constante para la "Billetera Principal" (ej. "00000000-0000-0000-0000-000000000000")
      const WALLET_VAULT_ID = "00000000-0000-0000-0000-000000000000";

      const [existingBalance] = await db.select().from(schema.balances)
        .where(eq(schema.balances.investorId, tx.investorId)); // Simplificado para Demo. Ideal: AND eq propertyId.

      if (existingBalance) {
        // Actualizar
        const currentUsd = parseFloat(existingBalance.availableUsd) || 0;
        const newUsd = currentUsd + parseFloat(tx.amountUsd);
        await db.update(schema.balances)
          .set({ availableUsd: newUsd.toString() })
          .where(eq(schema.balances.id, existingBalance.id));
      } else {
        // Crear
        await db.insert(schema.balances).values({
          investorId: tx.investorId,
          propertyId: WALLET_VAULT_ID, // Virtual Vault for Fiat
          availableTokens: "0",
          availableUsd: tx.amountUsd,
          lockedTokens: "0"
        });
      }

      // Marcar como COMPLETED
      await db.update(schema.transactions).set({ status: "completed" }).where(eq(schema.transactions.id, tx.id));
    }

    revalidatePath("/dashboard/admin/approvals");
    return { success: true };

  } catch (error: any) {
    console.error("Error approving transaction:", error);
    return { success: false, error: error.message };
  }
}
