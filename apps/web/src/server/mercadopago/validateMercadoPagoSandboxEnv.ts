export type EnvValidationResult = {
  status: 'ok' | 'missing' | 'invalid' | 'warnings';
  missing: string[];
  invalid: string[];
  warnings: string[];
  redactedSummary: Record<string, string>;
};

export function validateMercadoPagoSandboxEnv(): EnvValidationResult {
  const missing: string[] = [];
  const invalid: string[] = [];
  const warnings: string[] = [];
  const redactedSummary: Record<string, string> = {};

  const requiredVars = [
    'DEMO_MODE',
    'DEMO_PROFILE',
    'PAYMENTS_PROVIDER',
    'PAYMENTS_EXTERNAL_ENABLED',
    'MERCADOPAGO_PUBLIC_KEY',
    'MERCADOPAGO_ACCESS_TOKEN',
    'MERCADOPAGO_WEBHOOK_SECRET',
    'MERCADOPAGO_WEBHOOK_URL',
    'MERCADOPAGO_CURRENCY'
  ];

  for (const v of requiredVars) {
    if (!process.env[v]) {
      missing.push(v);
    }
  }

  // Value validations
  if (process.env.DEMO_MODE !== 'true') invalid.push('DEMO_MODE must be true');
  if (process.env.DEMO_PROFILE !== 'sandbox') invalid.push('DEMO_PROFILE must be sandbox');
  if (process.env.PAYMENTS_PROVIDER !== 'mercadopago_sandbox') invalid.push('PAYMENTS_PROVIDER must be mercadopago_sandbox');
  if (process.env.PAYMENTS_EXTERNAL_ENABLED !== 'true') invalid.push('PAYMENTS_EXTERNAL_ENABLED must be true');
  if (process.env.NODE_ENV === 'production') invalid.push('NODE_ENV cannot be production in demo mirror');

  const pubKey = process.env.MERCADOPAGO_PUBLIC_KEY || '';
  if (pubKey && !pubKey.startsWith('TEST-')) {
    if (!pubKey.startsWith('TEST_') && pubKey !== 'TEST_placeholder') {
       invalid.push('MERCADOPAGO_PUBLIC_KEY must start with TEST');
    }
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || '';
  if (accessToken) {
    if (accessToken.startsWith('APP_USR')) {
      invalid.push('MERCADOPAGO_ACCESS_TOKEN cannot be a production APP_USR token');
    } else if (!accessToken.startsWith('TEST-') && !accessToken.startsWith('TEST_')) {
      invalid.push('MERCADOPAGO_ACCESS_TOKEN must start with TEST');
    }
    
    if (['TEST_placeholder', 'TEST_dummy', 'TEST_xxx', 'changeme'].includes(accessToken)) {
      warnings.push('MERCADOPAGO_ACCESS_TOKEN is a placeholder');
    }
  }

  const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET || '';
  if (webhookSecret === 'placeholder' || webhookSecret === 'changeme') {
    warnings.push('MERCADOPAGO_WEBHOOK_SECRET is a placeholder');
  }

  const webhookUrl = process.env.MERCADOPAGO_WEBHOOK_URL || '';
  if (webhookUrl && !webhookUrl.startsWith('https://')) {
    invalid.push('MERCADOPAGO_WEBHOOK_URL must be an HTTPS URL');
  }

  if (process.env.MP_WEBHOOK_ALLOW_UNSIGNED === 'true') {
    invalid.push('MP_WEBHOOK_ALLOW_UNSIGNED cannot be true in sandbox');
  }

  const appBaseUrl = process.env.APP_BASE_URL || '';
  const nextAuthUrl = process.env.NEXTAUTH_URL || '';

  if (webhookUrl && (!webhookUrl.startsWith(appBaseUrl) && !webhookUrl.startsWith(nextAuthUrl))) {
    warnings.push('MERCADOPAGO_WEBHOOK_URL domain does not match APP_BASE_URL or NEXTAUTH_URL');
  }

  // Redacted Summary Construction
  redactedSummary['DEMO_MODE'] = process.env.DEMO_MODE || '';
  redactedSummary['DEMO_PROFILE'] = process.env.DEMO_PROFILE || '';
  redactedSummary['MERCADOPAGO_PUBLIC_KEY'] = pubKey ? `${pubKey.substring(0, 8)}...[REDACTED]` : 'MISSING';
  redactedSummary['MERCADOPAGO_ACCESS_TOKEN'] = accessToken ? `${accessToken.substring(0, 8)}...[REDACTED]` : 'MISSING';
  redactedSummary['MERCADOPAGO_WEBHOOK_SECRET'] = webhookSecret ? `[REDACTED_LENGTH_${webhookSecret.length}]` : 'MISSING';
  redactedSummary['MERCADOPAGO_WEBHOOK_URL'] = webhookUrl;
  redactedSummary['MERCADOPAGO_CURRENCY'] = process.env.MERCADOPAGO_CURRENCY || 'MISSING';
  redactedSummary['APP_BASE_URL'] = appBaseUrl;

  let status: 'ok' | 'missing' | 'invalid' | 'warnings' = 'ok';
  if (missing.length > 0) status = 'missing';
  if (invalid.length > 0) status = 'invalid';
  if (status === 'ok' && warnings.length > 0) status = 'warnings';

  return {
    status,
    missing,
    invalid,
    warnings,
    redactedSummary
  };
}
