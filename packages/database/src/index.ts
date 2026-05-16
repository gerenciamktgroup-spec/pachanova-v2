import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { createClient } from '@supabase/supabase-js'
import * as schema from './schema'

export * as schema from './schema'
export { schema }

export const isDemo = process.env.IS_DEMO === 'true'

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder_key_not_configured',
  { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
)

// DB singleton - se crea una sola vez
let _db: ReturnType<typeof drizzle> | null = null

export function getDb() {
  if (_db) return _db

  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl || dbUrl.includes('[TU_PASSWORD]') || dbUrl.includes('placeholder')) {
    throw new Error(
      'DATABASE_URL no configurada correctamente en las variables de entorno de Vercel. ' +
      'Ve a: Vercel Dashboard -> Settings -> Environment Variables'
    )
  }

  const sql = neon(dbUrl)
  _db = drizzle(sql, { schema })
  return _db
}

// Export db como getter para compatibilidad con rutas existentes
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_t, prop) {
    const instance = getDb()
    return Reflect.get(instance, prop)
  }
})
