import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { inArray, like, eq } from "drizzle-orm";
import * as schema from "../schema";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env.demo" });
dotenv.config({ path: "../../.env.demo.local" });

import { validateDemoDatabaseUrl } from "../utils/demoValidation";

const dbUrl = process.env.DATABASE_URL;
validateDemoDatabaseUrl(dbUrl);

const client = postgres(dbUrl as string);
const db = drizzle(client, { schema });

async function reset() {
  console.log("🗑️ Resetting Demo Database...");
  // Select demo users
  const demoUsers = await db.select({ id: schema.investors.id }).from(schema.investors).where(like(schema.investors.email, "%@pachanova.local"));
  const demoUserIds = demoUsers.map(u => u.id);

  if (demoUserIds.length > 0) {
    await db.delete(schema.balances).where(inArray(schema.balances.investorId, demoUserIds));
    await db.delete(schema.genesisPurchases).where(inArray(schema.genesisPurchases.investorId, demoUserIds));
    await db.delete(schema.tokenOrders).where(inArray(schema.tokenOrders.investorId, demoUserIds));
    await db.delete(schema.auditLogs).where(inArray(schema.auditLogs.userId, demoUserIds));
    // Fideicomiso actions by demo users
    await db.delete(schema.fideicomisoSignatures).where(inArray(schema.fideicomisoSignatures.signerId, demoUserIds));
    await db.delete(schema.fideicomisoOperations).where(inArray(schema.fideicomisoOperations.createdBy, demoUserIds));
    await db.delete(schema.investors).where(inArray(schema.investors.id, demoUserIds));
  }

  // Clear generic demo data
  await db.delete(schema.integrationEvents).where(like(schema.integrationEvents.eventType, "DEMO_%"));
  await db.delete(schema.annualValuations).where(eq(schema.annualValuations.source, "DEMO_VALUATION"));
  await db.delete(schema.systemParameters).where(eq(schema.systemParameters.key, "treasury_balance_usd"));
  console.log("✅ Demo Database Reset Complete!");
  process.exit(0);
}

reset().catch((err) => {
  console.error("Reset failed", err);
  process.exit(1);
});
