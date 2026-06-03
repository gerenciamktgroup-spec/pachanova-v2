import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.demo') });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("DATABASE_URL is not set in .env.demo");
  process.exit(1);
}

console.log("Connecting to:", dbUrl);
const sql = postgres(dbUrl, { max: 1 });

async function main() {
  console.log("Checking if 'stakes' table exists...");
  const tableCheck = await sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_name = 'stakes'
    );
  `;
  const exists = tableCheck[0]?.exists;
  
  if (exists) {
    console.log("✓ 'stakes' table already exists. No migration needed.");
  } else {
    console.log("Creating 'stakes' table and constraints...");
    await sql`
      CREATE TABLE IF NOT EXISTS "stakes" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "investor_id" uuid NOT NULL,
        "staked_amount" numeric(18, 2) DEFAULT '0' NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `;
    
    try {
      await sql`
        ALTER TABLE "stakes" ADD CONSTRAINT "stakes_investor_id_investors_id_fk" 
        FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;
      `;
      console.log("✓ Foreign key constraint added.");
    } catch (e: any) {
      console.log("Foreign key constraint already exists or skipped:", e.message);
    }
    
    await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS "unique_investor_stake" ON "stakes" ("investor_id");
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS stakes_investor_idx ON "stakes" ("investor_id");
    `;
    console.log("✓ 'stakes' table created successfully!");
  }
  
  await sql.end();
}

main().catch((err) => {
  console.error("Migration runner failed:", err);
  sql.end();
  process.exit(1);
});
