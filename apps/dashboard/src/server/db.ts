import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { schema } from '@pachanova/database';

// This is a singleton instance. 
// We ensure it falls back to a dummy string to avoid crashing at build time if the env variable is missing.
const dbUrl = process.env.DATABASE_URL || "postgresql://pachanova_demo:pachanova_demo@localhost:5433/pachanova_demo";
const useSsl = dbUrl.includes('sslmode=require') || dbUrl.includes('ssl=') || dbUrl.includes('supabase');
const client = postgres(dbUrl, {
  prepare: false,
  ssl: useSsl ? { rejectUnauthorized: false } : undefined
});
export const db = drizzle(client, { schema });

export { schema };
