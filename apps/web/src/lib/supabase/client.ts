import { createBrowserClient } from '@supabase/ssr'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './types'

// ─── Environment helpers ────────────────────────────────────────────────────

function getEnv() {
  const isDemoEnv =
    process.env.NEXT_PUBLIC_APP_ENV === 'demo' ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'

  const url = isDemoEnv
    ? process.env.NEXT_PUBLIC_SUPABASE_URL_DEMO!
    : process.env.NEXT_PUBLIC_SUPABASE_URL_PRODUCTION!

  const anonKey = isDemoEnv
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_DEMO!
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_PRODUCTION!

  return { url, anonKey, isDemoEnv }
}

// ─── Browser client (singleton) ─────────────────────────────────────────────

let _browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null

export function getSupabaseBrowserClient() {
  if (_browserClient) return _browserClient
  const { url, anonKey } = getEnv()
  _browserClient = createBrowserClient<Database>(url, anonKey)
  return _browserClient
}

// ─── Server client (per-request) ────────────────────────────────────────────

export async function getSupabaseServerClient() {
  const cookieStore = await cookies()
  const { url, anonKey } = getEnv()

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        )
      },
    },
  })
}

// ─── Environment flag (client-safe) ─────────────────────────────────────────

export function getIsDemoEnv(): boolean {
  return (
    process.env.NEXT_PUBLIC_APP_ENV === 'demo' ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
  )
}
