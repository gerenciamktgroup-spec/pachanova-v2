
export function validateDemoDatabaseUrl(): boolean {
  if (process.env.DEMO_MODE !== 'true') return false;
  
  const target = `${process.env.DATABASE_URL ?? ''} ${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''} ${process.env.SUPABASE_URL ?? ''}`
  const DEMO_REF = 'cndppfspgqomgwixlfkw'
  const PROD_REF = 'wdrhurnbxkhwmqrcbgpu'

  if (target.includes(PROD_REF)) return false;
  if (!target.includes(DEMO_REF)) return false;

  return true;
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
