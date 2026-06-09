"use server";

import { getDb, schema } from "@pachanova/database";
import { createServerClient } from "@/utils/supabase/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(data: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  // TODO: address could be added to schema if needed, but for MVP let's store in metadata or assume it's part of KYC
}) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("No autenticado");

    const db = getDb();
    
    const [existingUser] = await db.select().from(schema.investors).where(eq(schema.investors.supabaseAuthId, user.id));
    if (!existingUser) throw new Error("Usuario no encontrado en la base de datos");

    await db.update(schema.investors)
      .set({
        firstName: data.firstName ?? existingUser.firstName,
        lastName: data.lastName ?? existingUser.lastName,
        phone: data.phone ?? existingUser.phone,
        country: data.country ?? existingUser.country,
        updatedAt: new Date()
      })
      .where(eq(schema.investors.id, existingUser.id));

    revalidatePath("/dashboard/investor/settings");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return { success: false, error: error.message };
  }
}
