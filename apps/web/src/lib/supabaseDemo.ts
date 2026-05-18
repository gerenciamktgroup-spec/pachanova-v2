// ─────────────────────────────────────────────────────────────────────────────
//  PachaNova · supabaseDemo.ts
//  Cliente Supabase preconfigurado apuntando al proyecto Demo.
//  Proyecto: pachanova-demo | ID: cndppfspgqomgwixlfkw | Región: sa-east-1
//
//  USO:
//    import { supabaseDemo } from '@/lib/supabaseDemo'
//    const { data } = await supabaseDemo.from('properties').select('*')
//
//  ⚠️  Este cliente NO usa autenticación de usuario real.
//      Para operaciones que requieren investor_id, usa las funciones RPC
//      demo_buy_tokens() y deposit_demo_funds() que aceptan el ID explícito.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase.demo'

// ── Env vars ─────────────────────────────────────────────────────────────────
// Agrega estas variables a tu .env.local:
//   NEXT_PUBLIC_SUPABASE_DEMO_URL=https://cndppfspgqomgwixlfkw.supabase.co
//   NEXT_PUBLIC_SUPABASE_DEMO_ANON_KEY=<anon-key-del-proyecto-demo>

const DEMO_URL = process.env.NEXT_PUBLIC_SUPABASE_DEMO_URL!
const DEMO_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_DEMO_ANON_KEY!

if (!DEMO_URL || !DEMO_ANON_KEY) {
  throw new Error(
    '[supabaseDemo] Faltan variables de entorno: ' +
    'NEXT_PUBLIC_SUPABASE_DEMO_URL y NEXT_PUBLIC_SUPABASE_DEMO_ANON_KEY'
  )
}

// ── Instancia única (singleton) ───────────────────────────────────────────────
export const supabaseDemo = createClient<Database>(DEMO_URL, DEMO_ANON_KEY, {
  auth: {
    // El modo Demo no gestiona sesiones de usuario real;
    // deshabilitar persistencia evita colisiones con la sesión de producción.
    persistSession: false,
    autoRefreshToken: false,
    detectSessionFromUrl: false,
  },
})

// ── Helpers tipados ───────────────────────────────────────────────────────────

/** Devuelve todas las propiedades activas del entorno Demo. */
export async function getDemoProperties() {
  const { data, error } = await supabaseDemo
    .from('properties')
    .select('*')
    .eq('is_demo', true)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

/** Devuelve el perfil e inversiones de un inversor Demo por su ID. */
export async function getDemoInvestorProfile(investorId: string) {
  const { data, error } = await supabaseDemo
    .rpc('get_demo_investor_profile', { p_investor_id: investorId })

  if (error) throw error
  return data
}

/** Simula la compra de tokens en el entorno Demo. */
export async function demoBuyTokens(
  investorId: string,
  propertyId: string,
  quantity: number,
  unitPrice: number
) {
  const { data, error } = await supabaseDemo.rpc('demo_buy_tokens', {
    p_investor_id: investorId,
    p_property_id: propertyId,
    p_quantity: quantity,
    p_unit_price: unitPrice,
  })

  if (error) throw error
  return data
}

/** Deposita fondos simulados en la billetera del inversor Demo. */
export async function depositDemoFunds(amount: number) {
  const { data, error } = await supabaseDemo.rpc('deposit_demo_funds', {
    p_amount: amount,
  })

  if (error) throw error
  return data
}

/** Devuelve las distribuciones pagadas de un inversor Demo. */
export async function getDemoDistributions(investorId: string) {
  const { data, error } = await supabaseDemo
    .from('distributions')
    .select('*, properties(name, city)')
    .eq('investor_id', investorId)
    .eq('is_demo', true)
    .order('period_year', { ascending: false })

  if (error) throw error
  return data
}

/** Devuelve el balance actual de un inversor Demo. */
export async function getDemoBalance(investorId: string) {
  const { data, error } = await supabaseDemo
    .from('balances')
    .select('*')
    .eq('investor_id', investorId)
    .single()

  if (error) throw error
  return data
}

/** Registra o actualiza una sesión Demo activa. */
export async function upsertDemoSession(
  sessionToken: string,
  investorName?: string,
  investorEmail?: string,
  scenario?: string
) {
  const { data, error } = await supabaseDemo
    .from('demo_sessions')
    .upsert(
      {
        session_token: sessionToken,
        investor_name: investorName ?? null,
        investor_email: investorEmail ?? null,
        scenario: scenario ?? null,
        is_active: true,
      },
      { onConflict: 'session_token' }
    )
    .select()
    .single()

  if (error) throw error
  return data
}
