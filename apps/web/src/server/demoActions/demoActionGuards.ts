
export function validateDemoDatabaseUrl(url: string | undefined): boolean {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  const forbidden = ['cloudsql', 'neon.tech', 'supabase', 'run.app', 'firebase', 'production'];
  return !forbidden.some(f => lowerUrl.includes(f));
}

export function assertDemoMode() {
  if (process.env.DEMO_MODE !== 'true') {
    throw new Error('DEMO_MODE is not enabled');
  }
}

export function assertDemoDatabase() {
  if (!validateDemoDatabaseUrl(process.env.DATABASE_URL)) {
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
