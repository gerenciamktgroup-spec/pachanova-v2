// ─────────────────────────────────────────────────────────────────────────────
//  PachaNova · useDemoStore.ts
//  Store global del Modo Demo usando Zustand + persist middleware.
//
//  Responsabilidades:
//    · Mantener el estado del inversor simulado (perfil, balance, portafolio)
//    · Controlar la sesión Demo (token, escenario activo, pasos del guide)
//    · Exponer acciones que llaman a supabaseDemo.ts para sincronizar estado
//
//  USO:
//    import { useDemoStore } from '@/stores/useDemoStore'
//    const { investor, balance, buyTokens } = useDemoStore()
// ─────────────────────────────────────────────────────────────────────────────

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Tables } from '@/types/supabase.demo'
import {
  getDemoInvestorProfile,
  getDemoBalance,
  getDemoProperties,
  getDemoDistributions,
  demoBuyTokens,
  depositDemoFunds,
  upsertDemoSession,
} from '@/lib/supabaseDemo'

// ── Tipos derivados de Supabase ───────────────────────────────────────────────
export type DemoInvestor   = Tables<'investors'>
export type DemoBalance    = Tables<'balances'>
export type DemoProperty   = Tables<'properties'>
export type DemoDistribution = Tables<'distributions'>
export type DemoSession    = Tables<'demo_sessions'>

// ── Estado ────────────────────────────────────────────────────────────────────
interface DemoState {
  // Sesión
  isDemo: boolean
  sessionToken: string | null
  scenario: string | null
  currentStep: number
  totalSteps: number

  // Datos del inversor
  investor: DemoInvestor | null
  balance: DemoBalance | null
  properties: DemoProperty[]
  distributions: DemoDistribution[]

  // UI
  isLoading: boolean
  error: string | null
  lastSyncedAt: string | null
}

// ── Acciones ──────────────────────────────────────────────────────────────────
interface DemoActions {
  /** Inicia una sesión Demo nueva o reanuda una existente. */
  startDemo: (opts?: {
    investorId?: string
    investorName?: string
    investorEmail?: string
    scenario?: string
  }) => Promise<void>

  /** Carga el perfil completo del inversor desde Supabase Demo. */
  loadInvestorProfile: (investorId: string) => Promise<void>

  /** Carga las propiedades activas del entorno Demo. */
  loadProperties: () => Promise<void>

  /** Simula la compra de tokens y actualiza el balance en el store. */
  buyTokens: (
    propertyId: string,
    quantity: number,
    unitPrice: number
  ) => Promise<void>

  /** Deposita fondos simulados y refresca el balance. */
  depositFunds: (amount: number) => Promise<void>

  /** Avanza al siguiente paso del guided tour. */
  nextStep: () => void

  /** Retrocede al paso anterior del guided tour. */
  prevStep: () => void

  /** Salta directamente a un paso específico. */
  goToStep: (step: number) => void

  /** Finaliza y limpia la sesión Demo completamente. */
  endDemo: () => void

  /** Limpia el error actual. */
  clearError: () => void
}

type DemoStore = DemoState & DemoActions

// ── Estado inicial ────────────────────────────────────────────────────────────
const initialState: DemoState = {
  isDemo: false,
  sessionToken: null,
  scenario: null,
  currentStep: 0,
  totalSteps: 0,
  investor: null,
  balance: null,
  properties: [],
  distributions: [],
  isLoading: false,
  error: null,
  lastSyncedAt: null,
}

// ── Helpers internos ──────────────────────────────────────────────────────────
function generateSessionToken(): string {
  return `demo_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

// ── Store ─────────────────────────────────────────────────────────────────────
export const useDemoStore = create<DemoStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ── startDemo ──────────────────────────────────────────────────────────
      startDemo: async (opts = {}) => {
        set({ isLoading: true, error: null })
        try {
          const token = get().sessionToken ?? generateSessionToken()

          // Registra la sesión en Supabase Demo
          await upsertDemoSession(
            token,
            opts.investorName,
            opts.investorEmail,
            opts.scenario
          )

          set({
            isDemo: true,
            sessionToken: token,
            scenario: opts.scenario ?? 'default',
            currentStep: 0,
            isLoading: false,
          })

          // Si se pasa investorId, carga el perfil de inmediato
          if (opts.investorId) {
            await get().loadInvestorProfile(opts.investorId)
          }

          // Carga propiedades en paralelo
          await get().loadProperties()
        } catch (err) {
          set({ isLoading: false, error: (err as Error).message })
        }
      },

      // ── loadInvestorProfile ────────────────────────────────────────────────
      loadInvestorProfile: async (investorId) => {
        set({ isLoading: true, error: null })
        try {
          const [profile, balance, distributions] = await Promise.all([
            getDemoInvestorProfile(investorId),
            getDemoBalance(investorId),
            getDemoDistributions(investorId),
          ])

          set({
            investor: profile as DemoInvestor,
            balance,
            distributions,
            lastSyncedAt: new Date().toISOString(),
            isLoading: false,
          })
        } catch (err) {
          set({ isLoading: false, error: (err as Error).message })
        }
      },

      // ── loadProperties ─────────────────────────────────────────────────────
      loadProperties: async () => {
        try {
          const properties = await getDemoProperties()
          set({ properties: properties ?? [] })
        } catch (err) {
          set({ error: (err as Error).message })
        }
      },

      // ── buyTokens ──────────────────────────────────────────────────────────
      buyTokens: async (propertyId, quantity, unitPrice) => {
        const { investor } = get()
        if (!investor) {
          set({ error: 'No hay inversor Demo cargado.' })
          return
        }

        set({ isLoading: true, error: null })
        try {
          await demoBuyTokens(investor.id, propertyId, quantity, unitPrice)
          // Refrescar balance e inversiones tras la compra
          const [balance, distributions] = await Promise.all([
            getDemoBalance(investor.id),
            getDemoDistributions(investor.id),
          ])
          set({
            balance,
            distributions,
            lastSyncedAt: new Date().toISOString(),
            isLoading: false,
          })
        } catch (err) {
          set({ isLoading: false, error: (err as Error).message })
        }
      },

      // ── depositFunds ───────────────────────────────────────────────────────
      depositFunds: async (amount) => {
        const { investor } = get()
        if (!investor) {
          set({ error: 'No hay inversor Demo cargado.' })
          return
        }

        set({ isLoading: true, error: null })
        try {
          await depositDemoFunds(amount)
          const balance = await getDemoBalance(investor.id)
          set({
            balance,
            lastSyncedAt: new Date().toISOString(),
            isLoading: false,
          })
        } catch (err) {
          set({ isLoading: false, error: (err as Error).message })
        }
      },

      // ── Guided tour ────────────────────────────────────────────────────────
      nextStep: () =>
        set((s) => ({
          currentStep: Math.min(s.currentStep + 1, s.totalSteps - 1),
        })),

      prevStep: () =>
        set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),

      goToStep: (step) =>
        set((s) => ({
          currentStep: Math.max(0, Math.min(step, s.totalSteps - 1)),
        })),

      // ── endDemo ────────────────────────────────────────────────────────────
      endDemo: () => set(initialState),

      // ── clearError ─────────────────────────────────────────────────────────
      clearError: () => set({ error: null }),
    }),
    {
      name: 'pachanova-demo-store', // clave en localStorage
      storage: createJSONStorage(() => sessionStorage), // sesión de tab, no persistente entre cierres
      partialize: (state) => ({
        // Solo persistimos lo mínimo necesario entre navegaciones
        isDemo: state.isDemo,
        sessionToken: state.sessionToken,
        scenario: state.scenario,
        currentStep: state.currentStep,
        investor: state.investor,
      }),
    }
  )
)

// ── Selectores de conveniencia ────────────────────────────────────────────────
// Evitan re-renders innecesarios al suscribirse solo a la slice relevante.

export const selectDemoIsActive    = (s: DemoStore) => s.isDemo
export const selectDemoInvestor    = (s: DemoStore) => s.investor
export const selectDemoBalance     = (s: DemoStore) => s.balance
export const selectDemoProperties  = (s: DemoStore) => s.properties
export const selectDemoStep        = (s: DemoStore) => ({
  current: s.currentStep,
  total: s.totalSteps,
})
export const selectDemoLoading     = (s: DemoStore) => s.isLoading
export const selectDemoError       = (s: DemoStore) => s.error
