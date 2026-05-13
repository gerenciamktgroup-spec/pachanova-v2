import { IntegrationMode } from './IntegrationMode';
import { IntegrationStatus } from './IntegrationStatus';
import { getIntegrationEnv, getIntegrationMode } from '../env/integrationEnv';

export interface IntegrationHealth {
  provider: string;
  status: IntegrationStatus;
  externalEnabled: boolean;
  simulated: boolean;
  requiredEnv: string[];
  missingEnv: string[];
}

export interface HealthMatrix {
  payments: IntegrationHealth;
  contracts: IntegrationHealth;
  kyc: IntegrationHealth;
  oracle: IntegrationHealth;
  ai: IntegrationHealth;
  email: IntegrationHealth;
}

export class IntegrationRegistry {
  private mode: IntegrationMode;

  constructor() {
    this.mode = getIntegrationMode();
  }

  public getStatus(integration: keyof HealthMatrix): IntegrationHealth {
    const env = getIntegrationEnv();
    
    switch (integration) {
      case 'payments': {
        const external = env.PAYMENTS_EXTERNAL_ENABLED === 'true';
        if (!external || this.mode === 'demo_offline') {
          return { provider: 'demo', status: 'SIMULATED', externalEnabled: false, simulated: true, requiredEnv: [], missingEnv: [] };
        }
        
        const required = ['MERCADOPAGO_ACCESS_TOKEN', 'MERCADOPAGO_PUBLIC_KEY', 'MERCADOPAGO_WEBHOOK_SECRET'];
        const missing = required.filter(k => !(process.env as any)[k] || (process.env as any)[k].startsWith('TEST_placeholder'));
        
        if (missing.length > 0) {
          return { provider: 'mercadopago_sandbox', status: 'PENDING_CREDENTIALS', externalEnabled: true, simulated: false, requiredEnv: required, missingEnv: missing };
        }
        return { provider: 'mercadopago_sandbox', status: 'CONNECTED', externalEnabled: true, simulated: false, requiredEnv: required, missingEnv: [] };
      }
      
      case 'contracts': {
        const external = env.CONTRACTS_EXTERNAL_ENABLED === 'true';
        if (!external || this.mode === 'demo_offline') {
          return { provider: 'demo', status: 'SIMULATED', externalEnabled: false, simulated: true, requiredEnv: [], missingEnv: [] };
        }
        
        const required = ['RPC_URL', 'CONTRACT_TOKEN_ADDRESS'];
        const missing = required.filter(k => !(process.env as any)[k]);
        
        if (missing.length > 0) {
          return { provider: 'real_contracts', status: 'PENDING_DEPLOY', externalEnabled: true, simulated: false, requiredEnv: required, missingEnv: missing };
        }
        return { provider: 'real_contracts', status: 'CONNECTED', externalEnabled: true, simulated: false, requiredEnv: required, missingEnv: [] };
      }

      case 'kyc':
      case 'oracle':
      case 'ai':
      case 'email': {
        const key = `${integration.toUpperCase()}_EXTERNAL_ENABLED` as keyof ReturnType<typeof getIntegrationEnv>;
        const external = env[key] === 'true';
        if (!external || this.mode === 'demo_offline') {
          return { provider: 'demo', status: 'SIMULATED', externalEnabled: false, simulated: true, requiredEnv: [], missingEnv: [] };
        }
        // General pending provider for these
        return { provider: 'real', status: 'PENDING_PROVIDER', externalEnabled: true, simulated: false, requiredEnv: [], missingEnv: [] };
      }
    }
  }

  public getHealthMatrix(): HealthMatrix {
    return {
      payments: this.getStatus('payments'),
      contracts: this.getStatus('contracts'),
      kyc: this.getStatus('kyc'),
      oracle: this.getStatus('oracle'),
      ai: this.getStatus('ai'),
      email: this.getStatus('email'),
    };
  }

  public assertNoProductionConnections() {
    if (this.mode !== 'disabled' && process.env.NODE_ENV === 'production' && process.env.DEMO_PUBLIC_ALLOWED !== 'true') {
      throw new Error("CRITICAL: Demo integrations cannot run in production without DEMO_PUBLIC_ALLOWED=true");
    }
    
    // Check tokens
    if (process.env.MERCADOPAGO_ACCESS_TOKEN?.startsWith('APP_USR')) {
      throw new Error("CRITICAL: Production MercadoPago token detected in Demo Mode");
    }
  }
}

export function createIntegrationRegistry() {
  return new IntegrationRegistry();
}
