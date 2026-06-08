"use server";

import { getDb, schema } from "@pachanova/database";
import { createServerClient } from "@/utils/supabase/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function stakeTokens(amount: number) {
  try {
    if (amount <= 0) throw new Error("La cantidad debe ser mayor a 0");

    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    const db = getDb();
    const [dbUser] = await db.select().from(schema.users).where(eq(schema.users.supabaseAuthId, user.id));
    if (!dbUser) throw new Error("Usuario no encontrado");

    // 1. Verificar balance líquido disponible
    // Se asume que el token PACHA es el ID 0 o se suma todo lo disponible (para simplificar en este prototipo, sumamos todos los tokens líquidos).
    // Idealmente, el PACHA token tendría un ID fijo en `properties`.
    const balances = await db.select().from(schema.balances).where(eq(schema.balances.investorId, dbUser.id));
    const totalLiquid = balances.reduce((acc, b) => acc + parseFloat(b.availableTokens), 0);

    if (totalLiquid < amount) {
      throw new Error("No tienes suficientes tokens líquidos para hacer staking.");
    }

    // 2. Descontar del balance líquido (Lógica simplificada: descontar secuencialmente de las bóvedas hasta cubrir el monto)
    let remainingToStake = amount;
    for (const b of balances) {
      const available = parseFloat(b.availableTokens);
      if (available > 0 && remainingToStake > 0) {
        const toDeduct = Math.min(available, remainingToStake);
        const newAvailable = available - toDeduct;
        
        await db.update(schema.balances)
          .set({ availableTokens: newAvailable.toString() })
          .where(eq(schema.balances.id, b.id));
          
        remainingToStake -= toDeduct;
      }
    }

    // 3. Añadir a la tabla de Staking
    const [existingStake] = await db.select().from(schema.stakes).where(eq(schema.stakes.investorId, dbUser.id));
    if (existingStake) {
      const currentStaked = parseFloat(existingStake.stakedAmount);
      await db.update(schema.stakes)
        .set({ stakedAmount: (currentStaked + amount).toString(), updatedAt: new Date() })
        .where(eq(schema.stakes.id, existingStake.id));
    } else {
      await db.insert(schema.stakes).values({
        investorId: dbUser.id,
        stakedAmount: amount.toString(),
      });
    }

    revalidatePath("/dashboard/investor/staking");
    revalidatePath("/dashboard/investor/governance");
    revalidatePath("/dashboard/investor/wallet");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error staking tokens:", error);
    return { success: false, error: error.message };
  }
}

export async function unstakeTokens(amount: number) {
  try {
    if (amount <= 0) throw new Error("La cantidad debe ser mayor a 0");

    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    const db = getDb();
    const [dbUser] = await db.select().from(schema.users).where(eq(schema.users.supabaseAuthId, user.id));

    const [existingStake] = await db.select().from(schema.stakes).where(eq(schema.stakes.investorId, dbUser.id));
    if (!existingStake) throw new Error("No tienes tokens en staking");

    const currentStaked = parseFloat(existingStake.stakedAmount);
    if (currentStaked < amount) throw new Error("No tienes esa cantidad bloqueada en staking");

    // Reducir Staking
    await db.update(schema.stakes)
      .set({ stakedAmount: (currentStaked - amount).toString(), updatedAt: new Date() })
      .where(eq(schema.stakes.id, existingStake.id));

    // Devolver al balance líquido (Se lo damos al Virtual Vault de la Billetera para simplificar el Unstake)
    const WALLET_VAULT_ID = "00000000-0000-0000-0000-000000000000";
    const [walletBalance] = await db.select().from(schema.balances)
      .where(eq(schema.balances.investorId, dbUser.id));

    if (walletBalance) {
      const currentAvailable = parseFloat(walletBalance.availableTokens);
      await db.update(schema.balances)
        .set({ availableTokens: (currentAvailable + amount).toString() })
        .where(eq(schema.balances.id, walletBalance.id));
    } else {
      await db.insert(schema.balances).values({
        investorId: dbUser.id,
        propertyId: WALLET_VAULT_ID,
        availableTokens: amount.toString(),
        availableUsd: "0",
        lockedTokens: "0"
      });
    }

    revalidatePath("/dashboard/investor/staking");
    revalidatePath("/dashboard/investor/governance");
    revalidatePath("/dashboard/investor/wallet");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error unstaking tokens:", error);
    return { success: false, error: error.message };
  }
}
