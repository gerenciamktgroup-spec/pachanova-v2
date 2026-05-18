// ─────────────────────────────────────────────────────────────────────────────
//  PachaNova · database.ts
//  Tipos de dominio derivados de las tablas Supabase.
//  Capa intermedia entre los tipos crudos de Supabase y los ViewModels de UI.
//
//  Regla: cada tipo aquí es un alias 1:1 de Tables<'tabla'> o una
//  combinación mínima de ellas. NO incluye lógica de presentación.
//  Para eso, ver product.ts (ViewModels) o ui.ts (Props de componentes).
//
//  Importa desde aquí cuando necesites el "shape" real de la BD,
//  sin depender de cuál proyecto Supabase está activo.
// ─────────────────────────────────────────────────────────────────────────────

import type { Tables, Enums } from './supabase.production'

// ── Enums ────────────────────────────────────────────────────────────────────

export type KycStatus            = Enums<'kyc_status_enum'>
export type UserRole             = Enums<'user_role_enum'>
export type PropertyStatus       = Enums<'property_status_enum'>
export type TransactionStatus    = Enums<'transaction_status_enum'>
export type TransactionType      = Enums<'transaction_type_enum'>
export type P2pStatus            = Enums<'p2p_status_enum'>
export type NotificationType     = Enums<'notification_type_enum'>

// ── Entidades base ────────────────────────────────────────────────────────────

/** Inversor tal como vive en la tabla `investors`. */
export type DbInvestor           = Tables<'investors'>

/** Balance de tokens y USD de un inversor. */
export type DbBalance            = Tables<'balances'>

/** Propiedad inmobiliaria tokenizada. */
export type DbProperty           = Tables<'properties'>

/** Entrada del ledger de tokens (inmutable, encadenada). */
export type DbTokenLedgerEntry   = Tables<'token_ledger'>

/** Orden de compra de tokens. */
export type DbTokenOrder         = Tables<'token_orders'>

/** Transacción financiera genérica (depósito, retiro, comisión…). */
export type DbTransaction        = Tables<'transactions'>

/** Distribución de rendimientos a un inversor. */
export type DbDistribution       = Tables<'distributions'>

/** Operación del fideicomiso que requiere firmas múltiples. */
export type DbFideicomisoOp      = Tables<'fideicomiso_operations'>

/** Firma individual de una operación del fideicomiso. */
export type DbFideicomisoSig     = Tables<'fideicomiso_signatures'>

/** Documento KYC asociado a un inversor. */
export type DbKycDocument        = Tables<'kyc_documents'>

/** Notificación enviada a un inversor. */
export type DbNotification       = Tables<'notifications'>

/** Orden P2P publicada por un vendedor. */
export type DbP2pOrder           = Tables<'p2p_orders'>

/** Trade P2P ejecutado entre comprador y vendedor. */
export type DbP2pTrade           = Tables<'p2p_trades'>

/** Valoración anual de una propiedad. */
export type DbAnnualValuation    = Tables<'annual_valuations'>

/** Entrada del log de auditoría. */
export type DbAuditLog           = Tables<'audit_logs'>

/** Evento de integración (MercadoPago, KYC, etc.). */
export type DbIntegrationEvent   = Tables<'integration_events'>

/** Parámetro de sistema (clave/valor). */
export type DbSystemParameter    = Tables<'system_parameters'>

/** Paso del onboarding de un inversor. */
export type DbOnboardingStep     = Tables<'user_onboarding_steps'>

/** Documento de propiedad (escritura, SUNARP, etc.). */
export type DbPropertyDocument   = Tables<'property_documents'>

/** Proyección de rendimiento futuro de una propiedad. */
export type DbYieldProjection    = Tables<'yield_projections'>

/** Registro de lista de espera pre-lanzamiento. */
export type DbWaitlistEntry      = Tables<'waitlist'>

// ── Tipos compuestos (joins frecuentes) ───────────────────────────────────────

/** Propiedad con su última valoración anual. */
export type DbPropertyWithValuation = DbProperty & {
  latest_valuation?: DbAnnualValuation | null
}

/** Orden de compra con datos de propiedad embebidos. */
export type DbTokenOrderWithProperty = DbTokenOrder & {
  properties: Pick<DbProperty, 'id' | 'name' | 'city' | 'token_price_usd'> | null
}

/** Distribución con datos de propiedad embebidos. */
export type DbDistributionWithProperty = DbDistribution & {
  properties: Pick<DbProperty, 'id' | 'name' | 'city'> | null
}

/** Trade P2P con datos de ambas partes y propiedad. */
export type DbP2pTradeWithDetails = DbP2pTrade & {
  properties:       Pick<DbProperty, 'id' | 'name' | 'city'> | null
  buyer_investor:   Pick<DbInvestor, 'id' | 'first_name' | 'last_name'> | null
  seller_investor:  Pick<DbInvestor, 'id' | 'first_name' | 'last_name'> | null
}

/** Perfil de inversor con balance incluido. */
export type DbInvestorWithBalance = DbInvestor & {
  balance: DbBalance | null
}

// ── Tipos de input (formularios / Server Actions) ─────────────────────────────

/** Datos mínimos para crear un inversor nuevo. */
export type CreateInvestorInput = {
  email: string
  first_name: string
  last_name: string
  country?: string
  phone?: string
  supabase_auth_id?: string
}

/** Datos para actualizar el perfil de un inversor. */
export type UpdateInvestorInput = Partial<
  Pick<DbInvestor, 'first_name' | 'last_name' | 'country' | 'phone' | 'wallet_address' | 'metadata'>
>

/** Datos para crear una orden de compra de tokens. */
export type CreateTokenOrderInput = {
  investor_id: string
  property_id: string
  quantity: number
  unit_price: number
  currency?: string
}

/** Datos para crear una orden P2P. */
export type CreateP2pOrderInput = {
  seller_investor_id: string
  property_id: string
  quantity: number
  price_per_token: number
  expires_at?: string
}
