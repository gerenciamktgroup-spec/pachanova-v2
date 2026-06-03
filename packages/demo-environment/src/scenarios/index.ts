import type { DemoScenario } from './types';
import { happyScenario } from './happy';
import { rejectedPaymentScenario } from './rejected-payment';
import { kycPendingScenario } from './kyc-pending';
import { duplicateWebhookScenario } from './duplicate-webhook';

// Registro de escenarios disponibles
const scenarioRegistry: Record<string, DemoScenario> = {
  happy: happyScenario,
  'rejected-payment': rejectedPaymentScenario,
  'kyc-pending': kycPendingScenario,
  'duplicate-webhook': duplicateWebhookScenario,
};

export function getScenario(name: string): DemoScenario | undefined {
  return scenarioRegistry[name.toLowerCase()];
}

export function listScenarios(): DemoScenario[] {
  return Object.values(scenarioRegistry);
}

export { happyScenario, rejectedPaymentScenario, kycPendingScenario, duplicateWebhookScenario };
export type { DemoScenario, DemoScenarioRunner } from './types';
