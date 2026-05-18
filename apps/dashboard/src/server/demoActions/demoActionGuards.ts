
export function validateDemoDatabaseUrl(): boolean {
  if (process.env.DEMO_MODE !== 'true') return false;
  
  const target = `${process.env.DATABASE_URL ?? ''} ${process.env.SUPABASE_URL ?? ''}`
  const DEMO_REF = 'cndppfspgqomgwixlfkw'
  const PROD_REF = 'wdrhurnbxkhwmqrcbgpu'

  if (target.includes(PROD_REF)) return false;
  
  if (
    target.includes('localhost') || 
    target.includes('127.0.0.1') || 
    target.includes('pachanova_demo') || 
    target.includes(DEMO_REF)
  ) {
    return true;
  }

  return false;
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
