import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import * as schema from "../schema";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env.demo" });
dotenv.config({ path: "../../.env.demo.local" });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error("DATABASE_URL missing");

const client = postgres(dbUrl as string);
const db = drizzle(client, { schema });

async function reset() {
  console.log("🗑️ Phase 4: Full Database Reset (Wipe All Data)...");
  
  await db.execute(sql`TRUNCATE TABLE 
    audit_logs, 
    fideicomiso_signatures, 
    fideicomiso_operations, 
    transactions, 
    distributions, 
    loans, 
    balances, 
    genesis_purchases, 
    token_orders, 
    p2p_trades, 
    p2p_orders, 
    proposals, 
    votes, 
    properties, 
    kyc_documents, 
    investors, 
    integration_events, 
    annual_valuations, 
    system_parameters 
  CASCADE`);
  
  console.log("✅ Phase 4 Reset Complete!");
  process.exit(0);
}

reset().catch((err) => {
  console.error("Reset failed", err);
  process.exit(1);
});
