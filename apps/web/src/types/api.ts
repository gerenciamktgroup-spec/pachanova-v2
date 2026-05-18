// ─────────────────────────────────────────────────────────────────────────────
//  PachaNova · api.ts
//  Inputs y Outputs de Server Actions y tRPC.
//  Regla: ningún componente de UI importa directamente de supabase.*
//  Todo pasa por estos contratos tipados.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  DbInvestor,
  DbBalance,
  DbProperty,
  DbTokenOrder,
  DbDistribution,
  DbP2pOrder,
  DbP2pTrade,
  DbTransaction,
  DbKycDocument,
  DbNotification,
  KycStatus,
  TransactionStatus,
  PropertyStatus,
} from './database'

// ── Respuesta base ────────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  ok: true
  data: T
}

export interface ApiError {
  ok: false
  error: string
  code?: string
}

export type ApiResult<T> = ApiSuccess<T> | ApiError

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface SignUpInput {
  email: string
  password: string
  first_name: string
  last_name: string
  country?: string
  phone?: string
}

export interface SignInInput {
  email: string
  password: string
}

export interface AuthResult {
  investor: DbInvestor
  isNewUser: boolean
}

// ── Investor ──────────────────────────────────────────────────────────────────

export interface UpdateProfileInput {
  first_name?: string
  last_name?: string
  country?: string
  phone?: string
  wallet_address?: string
}

export interface InvestorProfileResult {
  investor: DbInvestor
  balance: DbBalance
  totalProperties: number
  totalDistributionsUsd: number
}

// ── Properties ────────────────────────────────────────────────────────────────

export interface ListPropertiesInput {
  status?: PropertyStatus
  city?: string
  page?: number
  limit?: number
}

export interface ListPropertiesResult {
  items: DbProperty[]
  total: number
  page: number
  limit: number
}

export interface GetPropertyResult {
  property: DbProperty
  availableTokens: number
  fundingPercent: number
}

// ── Token Orders ──────────────────────────────────────────────────────────────

export interface BuyTokensInput {
  property_id: string
  quantity: number
  unit_price: number
}

export interface BuyTokensResult {
  order: DbTokenOrder
  transaction_id: string
  new_balance: DbBalance
}

// ── Distributions ─────────────────────────────────────────────────────────────

export interface ListDistributionsInput {
  investor_id?: string
  property_id?: string
  period_year?: number
  status?: TransactionStatus
  page?: number
  limit?: number
}

export interface ListDistributionsResult {
  items: DbDistribution[]
  total: number
  totalAmountUsd: number
}

// ── P2P ───────────────────────────────────────────────────────────────────────

export interface CreateP2pOrderInput {
  property_id: string
  quantity: number
  price_per_token: number
  expires_at?: string
}

export interface CreateP2pOrderResult {
  order: DbP2pOrder
}

export interface ExecuteP2pTradeInput {
  order_id: string
}

export interface ExecuteP2pTradeResult {
  trade: DbP2pTrade
  new_balance: DbBalance
}

// ── KYC ───────────────────────────────────────────────────────────────────────

export interface SubmitKycInput {
  document_type: string
  file_url: string
  file_hash?: string
  expires_at?: string
}

export interface KycStatusResult {
  status: KycStatus
  documents: DbKycDocument[]
  pendingCount: number
}

// ── Notifications ─────────────────────────────────────────────────────────────

export interface ListNotificationsInput {
  investor_id?: string
  is_read?: boolean
  page?: number
  limit?: number
}

export interface ListNotificationsResult {
  items: DbNotification[]
  unreadCount: number
}

export interface MarkNotificationsReadInput {
  ids: string[]
}

// ── Wallet / Funds ────────────────────────────────────────────────────────────

export interface DepositFundsInput {
  amount: number
  payment_reference?: string
}

export interface DepositFundsResult {
  transaction: DbTransaction
  new_balance: DbBalance
}

// ── Demo-specific Server Actions ──────────────────────────────────────────────

export interface DemoBuyTokensInput extends BuyTokensInput {
  investor_id: string // explícito porque no hay sesión auth real
}

export interface DemoDepositFundsInput {
  amount: number
}

export interface DemoStartSessionInput {
  investor_name?: string
  investor_email?: string
  scenario?: string
}

export interface DemoStartSessionResult {
  session_token: string
  investor_id: string
}
