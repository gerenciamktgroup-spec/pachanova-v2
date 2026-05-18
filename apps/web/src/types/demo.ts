// ─────────────────────────────────────────────────────────────────────────────
//  PachaNova · demo.ts
//  Interfaces exclusivas del Modo Demo:
//    · Estado interno del useDemoStore
//    · Configuración de sesiones y escenarios
//    · Pasos del guided tour
//    · Datos mock y fixtures para presentaciones
//
//  IMPORTANTE: estos tipos NO deben importarse en código de producción.
//  Solo son válidos dentro de rutas/componentes con prefijo demo o
//  guards `if (isDemo)`.
// ─────────────────────────────────────────────────────────────────────────────

import type { Tables as DemoTables } from './supabase.demo'
import type {
  DbInvestor,
  DbBalance,
  DbProperty,
  DbDistribution,
} from './database'

// ── Re-exports de tablas Demo tipadas ────────────────────────────────────────

/** Inversor en el entorno Demo (is_demo = true). */
export type DemoInvestor     = DemoTables<'investors'>

/** Balance de tokens/USD de un inversor Demo. */
export type DemoBalance      = DemoTables<'balances'>

/** Propiedad disponible en el catálogo Demo. */
export type DemoProperty     = DemoTables<'properties'>

/** Distribución simulada de rendimientos. */
export type DemoDistribution = DemoTables<'distributions'>

/** Sesión Demo registrada en Supabase. */
export type DemoSession      = DemoTables<'demo_sessions'>

/** Paso del guided tour almacenado en `demo_guide_steps`. */
export type DemoGuideStep    = DemoTables<'demo_guide_steps'>

// ── Estado del useDemoStore ───────────────────────────────────────────────────

/** Escenarios precargados disponibles para una presentación Demo. */
export type DemoScenario =
  | 'default'         // Inversor genérico con portafolio básico
  | 'high_value'      // Inversor con posición grande y múltiples propiedades
  | 'new_investor'    // Primera inversión, KYC en proceso
  | 'p2p_active'      // Órdenes P2P abiertas y trades recientes
  | 'distribution'    // Distribuciones recientes pagadas

/** Estado completo del store Demo persistido en sessionStorage. */
export interface DemoStoreState {
  // Sesión
  isDemo: boolean
  sessionToken: string | null
  scenario: DemoScenario | null
  currentStep: number
  totalSteps: number

  // Datos
  investor: DemoInvestor | null
  balance: DemoBalance | null
  properties: DemoProperty[]
  distributions: DemoDistribution[]

  // UI
  isLoading: boolean
  error: string | null
  lastSyncedAt: string | null
}

/** Slice persistido en sessionStorage (subconjunto de DemoStoreState). */
export interface DemoStorePersisted {
  isDemo: boolean
  sessionToken: string | null
  scenario: DemoScenario | null
  currentStep: number
  investor: DemoInvestor | null
}

// ── Configuración de sesión ───────────────────────────────────────────────────

/** Opciones para iniciar una nueva sesión Demo. */
export interface StartDemoOptions {
  investorId?: string
  investorName?: string
  investorEmail?: string
  scenario?: DemoScenario
}

/** Metadata de una sesión Demo activa. */
export interface DemoSessionMeta {
  token: string
  scenario: DemoScenario
  startedAt: string
  investorName: string | null
  investorEmail: string | null
}

// ── Guided Tour ───────────────────────────────────────────────────────────────

/** Posición del tooltip del guided tour. */
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right' | 'center'

/** Paso del tour en memoria (derivado de DemoGuideStep con extras de runtime). */
export interface DemoTourStep {
  id: string
  stepKey: string
  stepOrder: number
  title: string
  description: string | null
  targetRoute: string | null
  targetElement: string | null
  tooltipPosition: TooltipPosition
  isActive: boolean
  /** true si el usuario ya completó este paso en la sesión actual. */
  isCompleted: boolean
}

/** Estado de progreso del tour. */
export interface DemoTourProgress {
  currentStep: number
  totalSteps: number
  completedSteps: number[]
  isFinished: boolean
}

// ── Fixtures / Datos mock ──────────────────────────────────────────────────────

/**
 * Perfil de inversor Demo precargado para una presentación.
 * Combina datos de `investors` + `balances` en un objeto plano
 * listo para pintar en pantalla sin llamadas adicionales.
 */
export interface DemoInvestorSnapshot {
  id: string
  fullName: string
  email: string
  scenario: DemoScenario
  // Balance formateado
  availableUsd: number
  availableTokens: number
  totalInvestedUsd: number
  totalDistributions: number
  // Portafolio
  propertiesOwned: number
  properties: Array<{
    propertyId: string
    name: string
    city: string
    tokensHeld: number
    currentValueUsd: number
    yieldPct: number
  }>
}

/**
 * Resultado de una compra simulada de tokens.
 * Devuelto por la RPC `demo_buy_tokens` y tipado para el store.
 */
export interface DemoBuyTokensResult {
  success: boolean
  transactionId: string | null
  newBalance: DemoBalance | null
  tokensAcquired: number
  totalPaidUsd: number
  errorMessage: string | null
}

/**
 * Resultado de un depósito simulado de fondos.
 * Devuelto por la RPC `deposit_demo_funds`.
 */
export interface DemoDepositResult {
  success: boolean
  transactionId: string | null
  amountDeposited: number
  newAvailableUsd: number
  errorMessage: string | null
}

// ── Eventos del log de sesión ─────────────────────────────────────────────────

/** Tipos de evento que se registran en `demo_sessions.events_log`. */
export type DemoEventType =
  | 'session_started'
  | 'step_completed'
  | 'tokens_purchased'
  | 'funds_deposited'
  | 'property_viewed'
  | 'p2p_order_placed'
  | 'session_ended'

/** Evento individual del log de sesión Demo. */
export interface DemoEvent {
  type: DemoEventType
  timestamp: string
  payload?: Record<string, unknown>
}
