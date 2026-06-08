"use server";

import { getDb, schema } from "@pachanova/database";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function signAgreement(supabaseAuthId: string, agreementType: string, documentHash: string = "simulated_hash_123") {
  try {
    const db = getDb();
    
    // Buscar usuario
    const userResult = await db.select().from(schema.users).where(eq(schema.users.supabaseAuthId, supabaseAuthId)).limit(1);
    
    if (userResult.length === 0) {
      throw new Error("Usuario no encontrado");
    }
    
    const userId = userResult[0].id;
    
    // Simular obtención de IP
    const mockIp = "192.168.1.100";
    
    // Registrar firma
    await db.insert(schema.userAgreements).values({
      userId,
      agreementType,
      documentHash,
      ipAddress: mockIp,
    });
    
    revalidatePath("/dashboard/investor");
    revalidatePath("/dashboard/investor/kyc");
    
    return { success: true, message: "Acuerdo firmado exitosamente." };
  } catch (error: any) {
    console.error("Error signing agreement:", error);
    return { success: false, error: error.message || "Error al firmar el acuerdo" };
  }
}

export async function getPropertyDocuments(propertyId: string) {
  try {
    const db = getDb();
    
    const docs = await db.select().from(schema.propertyDocuments).where(eq(schema.propertyDocuments.propertyId, propertyId));
    
    return { success: true, data: docs };
  } catch (error: any) {
    console.error("Error fetching property documents:", error);
    return { success: false, error: error.message || "Error al obtener documentos" };
  }
}
