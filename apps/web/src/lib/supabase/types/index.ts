/**
 * Unified Database type — resolves to the correct schema
 * based on the NEXT_PUBLIC_APP_ENV environment variable.
 *
 * Usage:
 *   import type { Database } from '@/lib/supabase/types'
 *   import type { Tables } from '@/lib/supabase/types'
 *
 * The client.ts already uses this via the generic parameter.
 */

export type { Database, Json, Tables, TablesInsert, TablesUpdate, Enums } from './production'

// Re-export demo types under a named alias for explicit use in demo-specific code
export type {
  Database as DemoDatabase,
  Tables as DemoTables,
  TablesInsert as DemoTablesInsert,
  TablesUpdate as DemoTablesUpdate,
  Enums as DemoEnums,
} from './demo'

// Convenience row types — most commonly used in the app
export type Investor = import('./production').Tables<'investors'>
export type Balance = import('./production').Tables<'balances'>
export type Property = import('./production').Tables<'properties'>
export type TokenOrder = import('./production').Tables<'token_orders'>
export type Transaction = import('./production').Tables<'transactions'>
export type Notification = import('./production').Tables<'notifications'>
export type Distribution = import('./production').Tables<'distributions'>
export type TokenLedger = import('./production').Tables<'token_ledger'>
export type KycDocument = import('./production').Tables<'kyc_documents'>
export type P2pOrder = import('./production').Tables<'p2p_orders'>
export type P2pTrade = import('./production').Tables<'p2p_trades'>

// Enum types
export type KycStatus = import('./production').Enums<'kyc_status_enum'>
export type UserRole = import('./production').Enums<'user_role_enum'>
export type TransactionStatus = import('./production').Enums<'transaction_status_enum'>
export type TransactionType = import('./production').Enums<'transaction_type_enum'>
export type PropertyStatus = import('./production').Enums<'property_status_enum'>
export type NotificationType = import('./production').Enums<'notification_type_enum'>
