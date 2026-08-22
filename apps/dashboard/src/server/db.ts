import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { core } from '@pachanova/database';

const dbUrl = process.env.DATABASE_URL || "postgresql://postgres:pachanova_dev@127.0.0.1:5433/pachanova";
const useSsl = dbUrl.includes('sslmode=require') || dbUrl.includes('ssl=') || dbUrl.includes('supabase');
const client = postgres(dbUrl, {
  prepare: false,
  ssl: useSsl ? { rejectUnauthorized: false } : undefined,
});
export const db = drizzle(client, { schema: core });
export { core };
