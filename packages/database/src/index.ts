import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { createClient } from '@supabase/supabase-js'
import * as schema from './schema/index'

export * as schema from './schema/index'
export * from './schema/index'
export type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>

export const isDemo = process.env.IS_DEMO === 'true'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder_key_not_configured',
  { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
)

let _db: DrizzleDB | null = null

export function getDb(): DrizzleDB {
  if (_db) return _db
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl || dbUrl.includes('[TU_PASSWORD]') || dbUrl.includes('placeholder')) {
    throw new Error('DATABASE_URL no configurada en Vercel -> Settings -> Environment Variables')
  }
  const useSsl = dbUrl.includes('sslmode=require') || dbUrl.includes('ssl=') || dbUrl.includes('supabase')
  const client = postgres(dbUrl, {
    prepare: false,
    max: 1, // Crucial for serverless environments to avoid connection exhaustion (504 errors)
    ssl: useSsl ? { rejectUnauthorized: false } : undefined
  })
  _db = drizzle(client, { schema })
  return _db
}
