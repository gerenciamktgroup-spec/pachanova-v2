// Cliente Supabase exclusivo para el modo demo (anon key, proyecto demo)
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_DEMO_URL ?? ''
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_DEMO_ANON_KEY ?? ''

export const demoSupabase = createClient(SUPABASE_URL, SUPABASE_ANON)

// ID fijo del usuario demo principal (Carlos Mendoza)
export const DEMO_INVESTOR_ID = 'a1000000-0000-0000-0000-000000000001'
export const DEMO_PROPERTY_ID = 'b1000000-0000-0000-0000-000000000001'

export interface DemoInvestorProfile {
  id: string
  first_name: string
  last_name: string
  email: string
  kyc_status: string
  is_accredited: boolean
  available_usd: number
  available_tokens: number
  total_invested_usd: number
  total_distributions: number
  token_positions: TokenPosition[]
  recent_transactions: RecentTransaction[]
}

export interface TokenPosition {
  property_id: string
  property_name: string
  amount: number
  operation: string
  tx_hash: string
  created_at: string
}

export interface RecentTransaction {
  type: string
  amount: number
  status: string
  tx_hash: string
  created_at: string
}

export interface BuyTokensResult {
  ok: boolean
  order_id?: string
  tx_hash?: string
  quantity?: number
  total_usd?: number
  new_balance_usd?: number
  new_tokens?: number
  error?: string
  available?: number
  required?: number
}

export async function getDemoProfile(): Promise<DemoInvestorProfile | null> {
  const { data, error } = await demoSupabase.rpc('get_demo_investor_profile', {
    p_investor_id: DEMO_INVESTOR_ID,
  })
  if (error) { console.error('[getDemoProfile]', error); return null }
  return data as DemoInvestorProfile
}

export async function buyDemoTokens(
  quantity: number,
  unitPrice: number = 10
): Promise<BuyTokensResult> {
  const { data, error } = await demoSupabase.rpc('demo_buy_tokens', {
    p_investor_id: DEMO_INVESTOR_ID,
    p_property_id: DEMO_PROPERTY_ID,
    p_quantity: quantity,
    p_unit_price: unitPrice,
  })
  if (error) return { ok: false, error: error.message }
  return data as BuyTokensResult
}

export async function getDemoProperty() {
  const { data, error } = await demoSupabase
    .from('properties')
    .select('id, name, description, district, city, token_price_usd, total_tokens, tokens_sold, tokens_reserved, annual_yield_pct, total_valuation_usd, status, images')
    .eq('id', DEMO_PROPERTY_ID)
    .single()
  if (error) { console.error('[getDemoProperty]', error); return null }
  return data
}
