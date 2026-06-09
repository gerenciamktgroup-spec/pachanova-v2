import postgres from 'postgres';
import dotenv from 'dotenv';

// Load env from apps/dashboard/.env.local
dotenv.config({ path: '.env.local' });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("DATABASE_URL not found in .env.local");
  process.exit(1);
}

// Strip pgbouncer query params if needed
const cleanUrl = dbUrl
  .replace('pgbouncer=true&', '')
  .replace('&pgbouncer=true', '')
  .replace('?pgbouncer=true', '');
const cleanUrl2 = cleanUrl; // to match cleanUrl variable usage if needed

console.log("Connecting to:", cleanUrl.split('@')[1] || "Supabase");

const sql = postgres(cleanUrl, { ssl: { rejectUnauthorized: false } });

async function runAudit() {
  try {
    // 1. List all tables in public schema and their RLS status
    console.log("\n--- Public Schema Tables and RLS Status ---");
    const tables = await sql`
      SELECT tablename, rowsecurity 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `;
    console.table(tables);

    // 2. List all RLS Policies
    console.log("\n--- Active RLS Policies ---");
    const policies = await sql`
      SELECT tablename, policyname, roles, cmd, qual, with_check 
      FROM pg_policies 
      WHERE schemaname = 'public'
      ORDER BY tablename, policyname;
    `;
    console.table(policies);

    // 3. Check table columns for drift analysis
    console.log("\n--- Table Columns for 'users' / 'investors' ---");
    const usersCols = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name IN ('users', 'investors')
      ORDER BY table_name, ordinal_position;
    `;
    console.table(usersCols);

  } catch (err) {
    console.error("Audit Error:", err);
  } finally {
    await sql.end();
  }
}

runAudit();
