'use client'
import { create } from 'zustand'
import {
  getDemoProfile,
  getDemoProperty,
  buyDemoTokens,
  type DemoInvestorProfile,
  type BuyTokensResult,
} from './supabaseDemo'

interface DemoStore {
  // Estado
  investor: DemoInvestorProfile | null
  property: Record<string, unknown> | null
  loading: boolean
  buyLoading: boolean
  lastTx: BuyTokensResult | null
  error: string | null

  // Acciones
  loadProfile: () => Promise<void>
  loadProperty: () => Promise<void>
  buyTokens: (quantity: number) => Promise<BuyTokensResult>
  clearLastTx: () => void
}

export const useDemoStore = create<DemoStore>((set, get) => ({
  investor: null,
  property: null,
  loading: false,
  buyLoading: false,
  lastTx: null,
  error: null,

  loadProfile: async () => {
    set({ loading: true, error: null })
    const profile = await getDemoProfile()
    set({ investor: profile, loading: false })
  },

  loadProperty: async () => {
    const prop = await getDemoProperty()
    set({ property: prop })
  },

  buyTokens: async (quantity: number) => {
    set({ buyLoading: true, error: null })
    const result = await buyDemoTokens(quantity)
    if (result.ok) {
      // Actualizar estado local inmediatamente sin refetch
      const inv = get().investor
      const prop = get().property
      if (inv && result.new_balance_usd !== undefined) {
        set({
          investor: {
            ...inv,
            available_usd: result.new_balance_usd,
            available_tokens: inv.available_tokens + (result.new_tokens ?? 0),
            total_invested_usd: inv.total_invested_usd + (result.total_usd ?? 0),
          },
          property: prop ? {
            ...prop,
            tokens_sold: ((prop.tokens_sold as number) ?? 0) + quantity,
          } : prop,
        })
      }
      // Refetch completo en background
      setTimeout(() => get().loadProfile(), 1500)
    } else {
      set({ error: result.error ?? 'Error desconocido' })
    }
    set({ buyLoading: false, lastTx: result })
    return result
  },

  clearLastTx: () => set({ lastTx: null }),
}))
