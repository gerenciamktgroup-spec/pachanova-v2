"use server";

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq, sql } from "drizzle-orm";
import { schema } from "@pachanova/database";
import { createServerClient } from "@/utils/supabase/server";

export async function buyTokensAction(propertyId: string, quantity: number) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userEmail = user?.email || "demo.investor.holder@pachanova.local";

    const client = postgres(process.env.DATABASE_URL!);
    const db = drizzle(client, { schema });

    const inv = await db.query.investors.findFirst({
      where: eq(schema.investors.email, userEmail)
    });

    if (!inv) return { success: false, error: "Investor not found" };
    if (inv.kycStatus !== 'approved') return { success: false, error: "KYC pending" };

    const property = await db.query.properties.findFirst({
      where: eq(schema.properties.id, propertyId)
    });

    if (!property) return { success: false, error: "Property not found" };

    const costUsd = Number(property.tokenPriceUsd) * quantity;

    // We do a naive update for demo purposes
    // 1. Get or create balance for this property
    const balance = await db.query.balances.findFirst({
      where: sql`${schema.balances.investorId} = ${inv.id} AND ${schema.balances.propertyId} = ${property.id}`
    });

    // Check if the user has enough global USD across their balances? 
    // Actually, in the demo, we'll just allow it and deduct from whatever balance has USD, or just create money for the demo.
    // For realism, let's sum their total USD.
    const allBalances = await db.query.balances.findMany({
      where: eq(schema.balances.investorId, inv.id)
    });
    
    const totalUsd = allBalances.reduce((acc, b) => acc + Number(b.availableUsd), 0);
    
    if (totalUsd < costUsd) {
      return { success: false, error: `Fondos insuficientes. Necesitas $${costUsd}, tienes $${totalUsd}` };
    }

    // Deduct USD from the first balance that has enough, or just the property balance if it exists
    let usdDeducted = false;
    for (const b of allBalances) {
      if (Number(b.availableUsd) >= costUsd) {
        await db.update(schema.balances)
          .set({ availableUsd: String(Number(b.availableUsd) - costUsd) })
          .where(eq(schema.balances.id, b.id));
        usdDeducted = true;
        break;
      }
    }

    if (!usdDeducted) return { success: false, error: "Fondos fragmentados o insuficientes" };

    // Add tokens to the specific property balance
    if (balance) {
      await db.update(schema.balances)
        .set({ availableTokens: String(Number(balance.availableTokens) + quantity) })
        .where(eq(schema.balances.id, balance.id));
    } else {
      await db.insert(schema.balances).values({
        investorId: inv.id,
        propertyId: property.id,
        availableTokens: String(quantity),
        availableUsd: "0",
        lockedTokens: "0",
        lockedUsd: "0"
      });
    }

    // Register transaction
    await db.insert(schema.transactions).values({
      senderId: inv.id, // For demo, buying from treasury can be simulated by sender = investor
      propertyId: property.id,
      amount: String(quantity),
      type: "mint",
      status: "completed",
      isDemo: true,
      metadata: { note: `Adquisición de ${quantity} tokens de ${property.name}` }
    });

    return { success: true, message: `Has adquirido ${quantity} tokens de ${property.name} exitosamente.` };

  } catch (err: any) {
    console.error("buyTokensAction error", err);
    return { success: false, error: err.message };
  }
}
