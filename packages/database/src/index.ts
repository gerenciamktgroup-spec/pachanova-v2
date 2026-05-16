import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { createClient } from '@supabase/supabase-js'
import * as schema from './schema'

export * as schema from './schema'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
const databaseUrl = process.env.DATABASE_URL || ''

export const isDemo = process.env.IS_DEMO === 'true'

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
)

function getDb() {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL no est\u00e1 configurada en las variables de entorno.')
  }
  // Usar neon HTTP driver - funciona en Vercel Edge/Serverless sin conexiones TCP
  const sql = neon(databaseUrl)
  return drizzleNeon(sql, { schema })
}

// Lazy proxy - solo conecta cuando se usa realmente
export const db = new Proxy({} as ReturnType<typeof getDb>, {
  get(_target, prop) {
    const instance = getDb()
    return (instance as unknown as Record<string | symbol, unknown>)[prop]
  }
})
