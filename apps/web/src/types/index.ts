// ─────────────────────────────────────────────────────────────────────────────
//  PachaNova · types/index.ts
//  Barrel central — re-exporta todo el sistema de tipos.
//
//  Árbol de dependencias (sin ciclos):
//
//    supabase.demo.ts        ← generado por Supabase CLI (demo)
//    supabase.production.ts  ← generado por Supabase CLI (prod)
//           ↓
//       database.ts          ← aliases de dominio + tipos compuestos
//           ↓
//    demo.ts  api.ts         ← contratos de negocio / Demo
//           ↓
//         ui.ts              ← props de componentes React
//           ↓
//       index.ts             ← este archivo
//
//  Uso:
//    import type { DbInvestor, DemoStoreState, BuyTokensInput } from '@/types'
// ─────────────────────────────────────────────────────────────────────────────

// ── Tipos Supabase crudos (re-export con alias de namespace) ──────────────────
export type {
  Database as DemoDatabase,
  Tables  as DemoTables,
  Enums   as DemoEnums,
  Json    as SupabaseJson,
} from './supabase.demo'

export type {
  Database as ProdDatabase,
  Tables   as ProdTables,
  Enums    as ProdEnums,
} from './supabase.production'

// ── Tipos de dominio (source of truth) ───────────────────────────────────────
export type {
  // Enums
  KycStatus,
  UserRole,
  PropertyStatus,
  TransactionStatus,
  TransactionType,
  P2pStatus,
  NotificationType,

  // Entidades base
  DbInvestor,
  DbBalance,
  DbProperty,
  DbTokenLedgerEntry,
  DbTokenOrder,
  DbTransaction,
  DbDistribution,
  DbFideicomisoOp,
  DbFideicomisoSig,
  DbKycDocument,
  DbNotification,
  DbP2pOrder,
  DbP2pTrade,
  DbAnnualValuation,
  DbAuditLog,
  DbIntegrationEvent,
  DbSystemParameter,
  DbOnboardingStep,
  DbPropertyDocument,
  DbYieldProjection,
  DbWaitlistEntry,

  // Tipos compuestos
  DbPropertyWithValuation,
  DbTokenOrderWithProperty,
  DbDistributionWithProperty,
  DbP2pTradeWithDetails,
  DbInvestorWithBalance,

  // Tipos de input
  CreateInvestorInput,
  UpdateInvestorInput,
  CreateTokenOrderInput,
  CreateP2pOrderInput,
} from './database'

// ── ViewModels legacy (product.ts) ────────────────────────────────────────────
export type {
  TokenBalanceView,
  InvestorSummary,
  LedgerEntryView,
  AuditLogView,
  IntegrationStatusView,
  FideicomisoOperationView,
  TreasurySummaryView,
  UserAdminView,
  IntegrationEventView,
  InvestorDashboardView,
  AdminDashboardView,
  FideicomisoDashboardView,
} from './product'

// ── Demo ──────────────────────────────────────────────────────────────────────
export type {
  // Entidades Demo
  DemoInvestor,
  DemoBalance,
  DemoProperty,
  DemoDistribution,
  DemoSession,
  DemoGuideStep,

  // Escenarios y sesión
  DemoScenario,
  StartDemoOptions,
  DemoSessionMeta,

  // Store
  DemoStoreState,
  DemoStorePersisted,

  // Guided Tour
  TooltipPosition,
  DemoTourStep,
  DemoTourProgress,

  // Fixtures
  DemoInvestorSnapshot,
  DemoBuyTokensResult,
  DemoDepositResult,

  // Eventos
  DemoEventType,
  DemoEvent,
} from './demo'

// ── API (Server Actions / tRPC) ───────────────────────────────────────────────
export type {
  // Respuesta base
  ApiSuccess,
  ApiError,
  ApiResult,

  // Auth
  SignUpInput,
  SignInInput,
  AuthResult,

  // Investor
  UpdateProfileInput,
  InvestorProfileResult,

  // Properties
  ListPropertiesInput,
  ListPropertiesResult,
  GetPropertyResult,

  // Token Orders
  BuyTokensInput,
  BuyTokensResult,

  // Distributions
  ListDistributionsInput,
  ListDistributionsResult,

  // P2P
  CreateP2pOrderInput,
  CreateP2pOrderResult,
  ExecuteP2pTradeInput,
  ExecuteP2pTradeResult,

  // KYC
  SubmitKycInput,
  KycStatusResult,

  // Notifications
  ListNotificationsInput,
  ListNotificationsResult,
  MarkNotificationsReadInput,

  // Funds
  DepositFundsInput,
  DepositFundsResult,

  // Demo Server Actions
  DemoBuyTokensInput,
  DemoDepositFundsInput,
  DemoStartSessionInput,
  DemoStartSessionResult,
} from './api'

// ── UI (React component props) ────────────────────────────────────────────────
export type {
  // Tokens
  ColorVariant,
  SizeVariant,

  // Toast
  ToastProps,
  ToastState,

  // Navigation
  NavItem,
  SidebarProps,
  BreadcrumbItem,
  BreadcrumbProps,

  // Property
  PropertyCardProps,
  PropertyBadgeProps,
  PropertyFundingBarProps,

  // Balance / Tokens
  BalanceCardProps,
  TokenCounterProps,

  // Distributions
  DistributionRowProps,
  DistributionListProps,

  // Notifications
  NotificationItemProps,
  NotificationBellProps,

  // KYC
  KycStatusBadgeProps,
  KycUploadFormProps,

  // P2P
  P2pOrderRowProps,

  // Status
  StatusPillProps,

  // Demo UI
  DemoBannerProps,
  DemoTooltipProps,
  DemoProgressBarProps,
  DemoScenarioPickerProps,

  // Layout
  PageHeaderProps,
  EmptyStateProps,
  LoadingSkeletonProps,
} from './ui'
