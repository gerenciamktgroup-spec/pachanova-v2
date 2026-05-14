// PachaNova Banking-Grade ViewModels
// Estrictamente mapeados, evitando la exposición cruda de la base de datos a los componentes.

export type TokenBalanceView = {
  investorId: string;
  availableTokens: string; // Formatted number
  lockedTokens: string;
  availableUsd: string;
  lockedUsd: string;
  lastUpdated: string; // ISO date string
};

export type InvestorSummary = {
  id: string;
  fullName: string;
  email: string;
  kycStatus: "pending" | "approved" | "rejected";
  isVerified: boolean;
  balance: TokenBalanceView;
};

export type LedgerEntryView = {
  id: string;
  operationType: "GENESIS_PURCHASE" | "TRANSFER" | "BURN" | "MINT";
  amount: string;
  timestamp: string;
  txHash: string | null;
  status: "pending" | "confirmed" | "failed";
};

export type AuditLogView = {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  actor: string; // "System", "Admin", "User:UUID"
};

export type IntegrationStatusView = {
  provider: "MERCADOPAGO" | "FOUNDRY" | "KYC" | "EMAIL";
  status: "SIMULATED" | "READY-BUT-DISABLED" | "PENDING_CREDENTIALS" | "PENDING_FOUNDRY" | "CONNECTED" | "DISABLED" | "NO-GO";
  lastPing: string | null;
  message: string;
};

export type FideicomisoOperationView = {
  id: string;
  type: string;
  description: string;
  status: "pending" | "signed" | "executed" | "rejected";
  requiredSignatures: number;
  currentSignatures: number;
  signatures: { signerRole: string; signedAt: string }[];
  createdAt: string;
};

export type TreasurySummaryView = {
  totalUsdRaised: string;
  totalTokensIssued: string;
  totalTokensAvailable: string;
  fideicomisoStatus: "ACTIVE" | "PENDING";
};

export type UserAdminView = InvestorSummary & {
  role: "INVESTOR" | "ADMIN" | "OPERATOR";
  status: "ACTIVE" | "SUSPENDED";
};

export type IntegrationEventView = {
  id: string;
  provider: "MERCADOPAGO" | "FOUNDRY" | "KYC" | "EMAIL";
  event: string;
  timestamp: string;
  status: "success" | "error" | "pending";
};

export type InvestorDashboardView = {
  investor: InvestorSummary;
  recentTransactions: LedgerEntryView[];
  kycVerificationProvider: "SIMULATED" | "LOCAL" | "EXTERNAL";
  paymentsReadiness: IntegrationStatusView;
  contractReadiness: IntegrationStatusView;
};

export type AdminDashboardView = {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalTokensDistributed: string;
    systemHealth: "GO" | "WARNING" | "CRITICAL";
  };
  treasury: TreasurySummaryView;
  recentAuditLogs: AuditLogView[];
  recentIntegrationEvents: IntegrationEventView[];
};

export type FideicomisoDashboardView = {
  status: "CONNECTED" | "PENDING_FOUNDRY" | "SIMULATED";
  trustAnchorHash: string | null;
  pendingOperations: FideicomisoOperationView[];
  recentHistory: AuditLogView[];
  quorumRequired: number;
  fiduciarioWallet: string | null;
};
