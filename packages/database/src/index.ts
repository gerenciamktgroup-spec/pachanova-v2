import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';
import * as schema from './schema';

export * as schema from './schema';

// Connection details from env
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const databaseUrl = process.env.DATABASE_URL || '';

if (!supabaseUrl || !databaseUrl) {
  console.warn('⚠️ Missing Database or Supabase URL in environment variables.');
}

// Detect if we are in demo mode
export const isDemo = process.env.IS_DEMO === 'true';

// Export Supabase Client
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

// Export Drizzle ORM client
const queryClient = postgres(databaseUrl, { prepare: false });
export const db = drizzle(queryClient, { schema });
