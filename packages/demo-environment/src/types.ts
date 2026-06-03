export type DemoMode = 'demo' | 'sandbox' | 'offline';

export interface DemoEnvironmentConfig {
  mode?: DemoMode;
  databaseUrl?: string;
  verbose?: boolean;
}

export interface DemoEnvironmentStatus {
  isHealthy: boolean;
  mode: DemoMode;
  databaseConnected: boolean;
  hasDemoData: boolean;

  // Datos útiles para diagnóstico rápido
  demoUsersCount: number;
  holderBalance?: {
    availableTokens: string;
    availableUsd: string;
  };
  recentIntegrationEvents: number;
  hasFailedPayments: boolean;
  hasPendingKyc: boolean;

  lastReset?: string;
  activeScenario?: string;
  issues: string[];
}

export interface ApplyScenarioOptions {
  force?: boolean;
}
