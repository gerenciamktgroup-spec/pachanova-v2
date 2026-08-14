
import { validateDemoDatabaseUrl as assertDemoDatabaseUrl } from "@pachanova/database/src/utils/demoValidation";

export function validateDemoDatabaseUrl(): boolean {
  try {
    assertDemoDatabaseUrl(process.env.DATABASE_URL);
    return true;
  } catch {
    return false;
  }
}

export function assertDemoMode() {
  if (process.env.DEMO_MODE !== 'true') {
    throw new Error('DEMO_MODE is not enabled');
  }
}

export function assertDemoDatabase() {
  if (!validateDemoDatabaseUrl()) {
    throw new Error('DATABASE_URL points to a production or forbidden environment');
  }
}

export function assertNoProductionConnection() {
  assertDemoMode();
  assertDemoDatabase();
}

export function assertSafeDemoAction() {
  assertNoProductionConnection();
  // Safe generic entry point
}
