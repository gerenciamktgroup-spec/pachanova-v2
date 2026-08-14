import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "../schema";
import { validateDemoDatabaseUrl } from "../utils/demoValidation";

dotenv.config({ path: "../../.env.demo" });
dotenv.config({ path: "../../.env.demo.local" });

const dbUrl = process.env.DATABASE_URL;
validateDemoDatabaseUrl(dbUrl);

const client = postgres(dbUrl, { prepare: false });
const db = drizzle(client, { schema });

async function reset() {
  console.log("Resetting dedicated demo database...");

  await db.transaction(async (tx) => {
    await tx.delete(schema.webhookQueue);
    await tx.delete(schema.notifications);
    await tx.delete(schema.fideicomisoSignatures);
    await tx.delete(schema.fideicomisoOperations);
    await tx.delete(schema.p2pTrades);
    await tx.delete(schema.p2pOrders);
    await tx.delete(schema.tokenLedger);
    await tx.delete(schema.transactions);
    await tx.delete(schema.distributions);
    await tx.delete(schema.annualValuations);
    await tx.delete(schema.genesisPurchases);
    await tx.delete(schema.tokenOrders);
    await tx.delete(schema.balances);
    await tx.delete(schema.kycDocuments);
    await tx.delete(schema.auditLogs);
    await tx.delete(schema.integrationEvents);
    await tx.delete(schema.demoSessions);
    await tx.delete(schema.properties);
    await tx.delete(schema.investors);
    await tx.delete(schema.systemParameters);
  });

  console.log("Dedicated demo database reset complete.");
}

reset()
  .catch((error) => {
    console.error("Demo reset failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await client.end();
  });
