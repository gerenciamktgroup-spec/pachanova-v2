import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';
import * as schema from './schema';

export * as schema from './schema';

// Connection details from env
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const databaseUrl = process.env.DATABASE_URL || '';

if (!supabaseUrl) {
  console.warn('⚠️ SUPABASE_URL no configurada.');
}
if (!databaseUrl) {
  console.warn('⚠️ DATABASE_URL no configurada.');
}

// Detect if we are in demo mode
export const isDemo = process.env.IS_DEMO === 'true';

// Export Supabase Client (lazy - solo falla si realmente se usa sin URL)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceKey || 'placeholder',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  }
);

// Export Drizzle ORM client (lazy)
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getDb(): ReturnType<typeof drizzle<typeof schema>> {
  if (!_db) {
    if (!databaseUrl) {
      throw new Error('DATABASE_URL no está configurada en las variables de entorno.');
    }
    const queryClient = postgres(databaseUrl, { prepare: false });
    _db = drizzle(queryClient, { schema });
  }
  return _db;
}

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop) {
    const instance = getDb();
    return (instance as unknown as Record<string | symbol, unknown>)[prop];
  }
});
