import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { schema } from '@pachanova/database';

// This is a singleton instance. 
// We ensure it falls back to a dummy string to avoid crashing at build time if the env variable is missing.
const client = postgres(process.env.DATABASE_URL || "postgresql://postgres@localhost:5433/pachanova_demo");
export const db = drizzle(client, { schema });
