import postgres from 'postgres';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("DATABASE_URL not found in .env.local");
  process.exit(1);
}

const cleanUrl = dbUrl
  .replace('pgbouncer=true&', '')
  .replace('&pgbouncer=true', '')
  .replace('?pgbouncer=true', '');

const sql = postgres(cleanUrl, { ssl: { rejectUnauthorized: false } });

async function deploy() {
  try {
    console.log("--- 1. Creating missing V2.0 tables (trusts, assets, users_identity) ---");
    // Read and run the Fase 1 SQL migration
    const migrationPath = path.join('..', '..', 'supabase', 'migrations', '20260608125000_fase1_rwa_trusts_assets_kyc.sql');
    if (fs.existsSync(migrationPath)) {
      const sqlContent = fs.readFileSync(migrationPath, 'utf8');
      console.log("Running migration file 20260608125000_fase1_rwa_trusts_assets_kyc.sql...");
      await sql.unsafe(sqlContent);
      console.log("Migration executed successfully.");
    } else {
      console.log("Migration file not found at", migrationPath);
    }

    console.log("\n--- 2. Enabling Row Level Security (RLS) on all public tables ---");
    const tables = [
      'annual_valuations',
      'audit_logs',
      'balances',
      'burn_vaults',
      'demo_sessions',
      'distributions',
      'escrow_vaults',
      'fideicomiso_audits',
      'fideicomiso_operations',
      'fideicomiso_signatures',
      'gamification',
      'genesis_purchases',
      'integration_events',
      'kyc_documents',
      'loans',
      'notifications',
      'p2p_orders',
      'p2p_trades',
      'properties',
      'proposals',
      'stakes',
      'system_parameters',
      'token_ledger',
      'token_orders',
      'transactions',
      'treasury_vaults',
      'users',
      'votes',
      'trusts',
      'assets',
      'users_identity'
    ];

    for (const table of tables) {
      console.log(`Enabling RLS on public.${table}...`);
      await sql.unsafe(`ALTER TABLE public."${table}" ENABLE ROW LEVEL SECURITY;`);
    }

    console.log("\n--- 3. Deploying strict RLS policies ---");
    
    // Clear any existing policies first to prevent "already exists" errors
    for (const table of tables) {
      const existingPolicies = await sql`
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = ${table};
      `;
      for (const policy of existingPolicies) {
        await sql.unsafe(`DROP POLICY IF EXISTS "${policy.policyname}" ON public."${table}";`);
      }
    }

    // User Profile Read/Update Policy (match auth.uid() to supabase_auth_id)
    console.log("Deploying policies on 'users'...");
    await sql.unsafe(`
      CREATE POLICY "Users can read own profile" ON public.users
        FOR SELECT USING (auth.uid() = supabase_auth_id);
    `);
    await sql.unsafe(`
      CREATE POLICY "Users can update own profile" ON public.users
        FOR UPDATE USING (auth.uid() = supabase_auth_id);
    `);

    // User Identity Policy
    console.log("Deploying policies on 'users_identity'...");
    await sql.unsafe(`
      CREATE POLICY "Users can read own identity" ON public.users_identity
        FOR SELECT USING (auth.uid() = user_id);
    `);

    // KYC Documents Policy
    console.log("Deploying policies on 'kyc_documents'...");
    await sql.unsafe(`
      CREATE POLICY "Users can read own KYC docs" ON public.kyc_documents
        FOR SELECT USING (auth.uid() = investor_id);
    `);
    await sql.unsafe(`
      CREATE POLICY "Users can insert own KYC docs" ON public.kyc_documents
        FOR INSERT WITH CHECK (auth.uid() = investor_id);
    `);

    // Balances Policy
    console.log("Deploying policies on 'balances'...");
    await sql.unsafe(`
      CREATE POLICY "Users can read own balances" ON public.balances
        FOR SELECT USING (auth.uid() = investor_id);
    `);

    // Distributions Policy
    console.log("Deploying policies on 'distributions'...");
    await sql.unsafe(`
      CREATE POLICY "Users can read own distributions" ON public.distributions
        FOR SELECT USING (auth.uid() = investor_id);
    `);

    // Transactions Policy
    console.log("Deploying policies on 'transactions'...");
    await sql.unsafe(`
      CREATE POLICY "Users can read own transactions" ON public.transactions
        FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
    `);

    // Token Orders Policy
    console.log("Deploying policies on 'token_orders'...");
    await sql.unsafe(`
      CREATE POLICY "Users can read own orders" ON public.token_orders
        FOR SELECT USING (auth.uid() = investor_id);
    `);

    // Trusts & Assets Public Select
    console.log("Deploying policies on 'trusts' & 'assets'...");
    await sql.unsafe(`
      CREATE POLICY "Public read for trusts" ON public.trusts
        FOR SELECT USING (true);
    `);
    await sql.unsafe(`
      CREATE POLICY "Public read for assets" ON public.assets
        FOR SELECT USING (true);
    `);

    // Fiduciary/Admin Operations Policy
    console.log("Deploying policies on 'fideicomiso_operations' & 'fideicomiso_signatures'...");
    await sql.unsafe(`
      CREATE POLICY "Public read for fideicomiso_operations" ON public.fideicomiso_operations
        FOR SELECT USING (true);
    `);
    await sql.unsafe(`
      CREATE POLICY "Public read for fideicomiso_signatures" ON public.fideicomiso_signatures
        FOR SELECT USING (true);
    `);

    console.log("\n--- Schema and RLS deployment complete! ---");
  } catch (err) {
    console.error("Deployment Error:", err);
  } finally {
    await sql.end();
  }
}

deploy();
