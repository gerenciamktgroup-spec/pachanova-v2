"use server";

import { getDb, schema } from "@pachanova/database";
import { createServerClient } from "@/utils/supabase/server";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createGovernanceProposal(title: string, description: string, endDate: string) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("No autenticado");
    const role = user.app_metadata?.role || user.user_metadata?.role;
    if (role !== "admin") throw new Error("Solo el administrador puede crear propuestas");

    const db = getDb();

    await db.insert(schema.proposals).values({
      title,
      description,
      status: "active",
      endAt: new Date(endDate),
      quorumRequired: "10.00",
    });

    revalidatePath("/dashboard/investor/governance");
    revalidatePath("/dashboard/admin/governance");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating proposal:", error);
    return { success: false, error: error.message };
  }
}

export async function castVote(proposalId: string, choice: "for" | "against" | "abstain") {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    const db = getDb();

    // 1. Obtener usuario de la BD
    const [dbUser] = await db.select().from(schema.users).where(eq(schema.users.supabaseAuthId, user.id));
    if (!dbUser) throw new Error("Usuario no encontrado en la base de datos");

    // 2. Validar Propuesta Activa
    const [proposal] = await db.select().from(schema.proposals).where(eq(schema.proposals.id, proposalId));
    if (!proposal) throw new Error("Propuesta no encontrada");
    if (proposal.status !== "active") throw new Error("La propuesta ya no está activa");
    if (proposal.endAt && new Date() > new Date(proposal.endAt)) throw new Error("La fecha límite ha expirado");

    // 3. Validar que no haya votado previamente
    const [existingVote] = await db.select()
      .from(schema.votes)
      .where(and(eq(schema.votes.proposalId, proposalId), eq(schema.votes.investorId, dbUser.id)));
      
    if (existingVote) throw new Error("Ya has emitido tu voto para esta propuesta");

    // 4. Calcular PACHA Power (Fase 42 preview: balance liquido + staked * 1.5)
    // Obtener saldos líquidos de token
    const balances = await db.select({
      available: schema.balances.availableTokens
    }).from(schema.balances).where(eq(schema.balances.investorId, dbUser.id));
    
    const liquidTokens = balances.reduce((sum, b) => sum + parseFloat(b.available), 0);

    // Obtener saldos en staking
    const [stake] = await db.select().from(schema.stakes).where(eq(schema.stakes.investorId, dbUser.id));
    const stakedTokens = stake ? parseFloat(stake.stakedAmount) : 0;

    // Fórmula del Pacha Power: 1 PACHA Líquido = 1 Voto. 1 PACHA Staked = 1.5 Votos.
    const votingPower = liquidTokens + (stakedTokens * 1.5);

    if (votingPower === 0) throw new Error("Poder de voto insuficiente. Debes poseer tokens PACHA para votar.");

    // 5. Registrar el Voto
    await db.insert(schema.votes).values({
      proposalId,
      investorId: dbUser.id,
      choice,
      votingPower: votingPower.toString(),
    });

    revalidatePath("/dashboard/investor/governance");
    return { success: true, votingPower };

  } catch (error: any) {
    console.error("Error casting vote:", error);
    return { success: false, error: error.message };
  }
}
