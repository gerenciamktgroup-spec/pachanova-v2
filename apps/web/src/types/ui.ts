// ─────────────────────────────────────────────────────────────────────────────
//  PachaNova · ui.ts
//  Props de componentes de navegación, cards, toasts y elementos de UI.
//  Regla: solo React props y tipos visuales. Sin lógica de negocio.
// ─────────────────────────────────────────────────────────────────────────────

import type { ReactNode } from 'react'
import type {
  DbProperty,
  DbDistribution,
  DbNotification,
  DbP2pOrder,
  KycStatus,
  PropertyStatus,
  TransactionStatus,
  NotificationType,
} from './database'
import type { DemoTourStep, DemoScenario } from './demo'

// ── Tokens / Colores genéricos ────────────────────────────────────────────────

export type ColorVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type SizeVariant  = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// ── Toast / Notificación UI ───────────────────────────────────────────────────

export interface ToastProps {
  id: string
  title: string
  description?: string
  variant: ColorVariant
  duration?: number        // ms; undefined = permanente hasta dismiss
  action?: {
    label: string
    onClick: () => void
  }
}

export interface ToastState {
  toasts: ToastProps[]
  push: (toast: Omit<ToastProps, 'id'>) => void
  dismiss: (id: string) => void
  dismissAll: () => void
}

// ── Navigation ────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
  icon?: ReactNode
  badge?: string | number
  isActive?: boolean
  isDisabled?: boolean
  children?: NavItem[]
}

export interface SidebarProps {
  items: NavItem[]
  isCollapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
  footer?: ReactNode
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

// ── Property Card ─────────────────────────────────────────────────────────────

export interface PropertyCardProps {
  property: DbProperty
  onSelect?: (id: string) => void
  isDemo?: boolean
  showBadge?: boolean
}

export interface PropertyBadgeProps {
  status: PropertyStatus
}

export interface PropertyFundingBarProps {
  tokensSold: number
  totalTokens: number
  showPercent?: boolean
}

// ── Token / Balance ───────────────────────────────────────────────────────────

export interface BalanceCardProps {
  availableUsd: number
  availableTokens: number
  lockedUsd: number
  lockedTokens: number
  lastUpdated: string
  isLoading?: boolean
}

export interface TokenCounterProps {
  value: number
  label?: string
  size?: SizeVariant
  animated?: boolean
}

// ── Distribution Row ──────────────────────────────────────────────────────────

export interface DistributionRowProps {
  distribution: DbDistribution & {
    properties?: { name: string; city: string | null } | null
  }
  showProperty?: boolean
}

export interface DistributionListProps {
  items: DistributionRowProps['distribution'][]
  isLoading?: boolean
  emptyMessage?: string
}

// ── Notification ──────────────────────────────────────────────────────────────

export interface NotificationItemProps {
  notification: DbNotification
  onRead?: (id: string) => void
}

export interface NotificationBellProps {
  unreadCount: number
  onClick?: () => void
}

// ── KYC ───────────────────────────────────────────────────────────────────────

export interface KycStatusBadgeProps {
  status: KycStatus
  showLabel?: boolean
}

export interface KycUploadFormProps {
  onSubmit: (file: File, documentType: string) => Promise<void>
  isLoading?: boolean
}

// ── P2P ───────────────────────────────────────────────────────────────────────

export interface P2pOrderRowProps {
  order: DbP2pOrder & {
    properties?: { name: string } | null
  }
  onBuy?: (orderId: string) => void
  isBuying?: boolean
}

// ── Transaction Status ────────────────────────────────────────────────────────

export interface StatusPillProps {
  status: TransactionStatus | KycStatus
  size?: SizeVariant
}

// ── Demo UI ───────────────────────────────────────────────────────────────────

export interface DemoBannerProps {
  scenario: DemoScenario
  onEnd?: () => void
}

export interface DemoTooltipProps {
  step: DemoTourStep
  onNext?: () => void
  onPrev?: () => void
  onSkip?: () => void
}

export interface DemoProgressBarProps {
  current: number
  total: number
  showSteps?: boolean
}

export interface DemoScenarioPickerProps {
  selected: DemoScenario
  onChange: (scenario: DemoScenario) => void
  disabled?: boolean
}

// ── Shared layout ─────────────────────────────────────────────────────────────

export interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  breadcrumbs?: BreadcrumbItem[]
}

export interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

export interface LoadingSkeletonProps {
  rows?: number
  variant?: 'card' | 'list' | 'table'
}
