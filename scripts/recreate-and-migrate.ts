import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.demo') });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("DATABASE_URL is not set in .env.demo");
  process.exit(1);
}

console.log("Connecting to Database:", dbUrl);
const sql = postgres(dbUrl, { max: 1 });

async function main() {
  console.log("💥 Dropping current schema and drizzle metadata to clear all tables and types...");
  await sql`DROP SCHEMA IF EXISTS public CASCADE;`;
  await sql`DROP SCHEMA IF EXISTS drizzle CASCADE;`;
  await sql`CREATE SCHEMA public;`;
  await sql`GRANT ALL ON SCHEMA public TO postgres;`;
  await sql`GRANT ALL ON SCHEMA public TO public;`;
  console.log("✓ Schema and Drizzle metadata cleared and public schema recreated.");

  const db = drizzle(sql);
  
  console.log("⚙️ Running all database migrations from packages/database/drizzle...");
  await migrate(db, { migrationsFolder: path.join(__dirname, '../packages/database/drizzle') });
  console.log("✓ All migrations applied successfully!");

  await sql.end();
}

main().catch((err) => {
  console.error("❌ Migration runner failed:", err);
  sql.end();
  process.exit(1);
});
