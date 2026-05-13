import { z } from 'zod';
import { IntegrationMode } from '../registry/IntegrationMode';

export const integrationEnvSchema = z.object({
  DEMO_MODE: z.string().optional().default('false'),
  DEMO_PROFILE: z.enum(['offline', 'sandbox', 'connected']).optional().default('offline'),

  PAYMENTS_EXTERNAL_ENABLED: z.string().optional().default('false'),
  MERCADOPAGO_ACCESS_TOKEN: z.string().optional(),
  MERCADOPAGO_PUBLIC_KEY: z.string().optional(),
  MERCADOPAGO_WEBHOOK_SECRET: z.string().optional(),

  CONTRACTS_EXTERNAL_ENABLED: z.string().optional().default('false'),
  RPC_URL: z.string().optional(),
  CONTRACT_TOKEN_ADDRESS: z.string().optional(),

  KYC_EXTERNAL_ENABLED: z.string().optional().default('false'),
  ORACLE_EXTERNAL_ENABLED: z.string().optional().default('false'),
  AI_EXTERNAL_ENABLED: z.string().optional().default('false'),
  EMAIL_EXTERNAL_ENABLED: z.string().optional().default('false'),
});

export function getIntegrationEnv() {
  return integrationEnvSchema.parse(process.env);
}

export function getIntegrationMode(): IntegrationMode {
  const env = getIntegrationEnv();
  if (env.DEMO_MODE !== 'true') return 'disabled';
  return `demo_${env.DEMO_PROFILE}` as IntegrationMode;
}
