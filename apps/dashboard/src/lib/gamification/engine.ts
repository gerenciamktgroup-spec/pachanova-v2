import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import { eq, sql } from "drizzle-orm";

export const LEVEL_THRESHOLDS = [
  { level: 1, minXp: 0, name: "Pacha Explorer" },
  { level: 2, minXp: 500, name: "Inversor Activo" },
  { level: 3, minXp: 2000, name: "Pacha Whale" },
  { level: 4, minXp: 5000, name: "Socio Fundador" },
];

export function calculateLevel(xp: number): number {
  let currentLevel = 1;
  for (const threshold of LEVEL_THRESHOLDS) {
    if (xp >= threshold.minXp) {
      currentLevel = threshold.level;
    }
  }
  return currentLevel;
}

export function getNextLevelThreshold(xp: number) {
  const currentLevel = calculateLevel(xp);
  const nextThreshold = LEVEL_THRESHOLDS.find(t => t.level === currentLevel + 1);
  return nextThreshold || null;
}

export async function awardXP(userId: string, action: string, xpAwarded: number, metadata?: any) {
  return await db.transaction(async (tx) => {
    const user = await tx.query.users.findFirst({
      where: eq(schema.users.id, userId)
    });

    if (!user) throw new Error("User not found");

    const newXp = user.xp + xpAwarded;
    const newLevel = calculateLevel(newXp);

    // Update user
    await tx.update(schema.users)
      .set({
        xp: newXp,
        level: newLevel,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, userId));

    // Record in ledger
    await tx.insert(schema.gamificationLedger).values({
      userId,
      action,
      xpAwarded,
      metadata: metadata || {},
    });

    return {
      previousXp: user.xp,
      newXp,
      previousLevel: user.level,
      newLevel,
      leveledUp: newLevel > user.level
    };
  });
}
