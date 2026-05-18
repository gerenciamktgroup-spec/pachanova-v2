export function validateDemoDatabaseUrl(dbUrl?: string): void {
  if (process.env.DEMO_MODE !== 'true') {
    throw new Error("CRITICAL ERROR: DEMO_MODE must be 'true' for demo operations");
  }

  const target = `${dbUrl ?? ''} ${process.env.DATABASE_URL ?? ''} ${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''} ${process.env.SUPABASE_URL ?? ''}`
  const DEMO_REF = 'cndppfspgqomgwixlfkw'
  const PROD_REF = 'wdrhurnbxkhwmqrcbgpu'

  const isLocal = target.toLowerCase().includes('localhost') || target.toLowerCase().includes('127.0.0.1');
  
  if (!isLocal) {
    if (target.includes(PROD_REF)) throw new Error("CRITICAL ERROR: Demo is pointing to PROD Supabase project");
    if (!target.includes(DEMO_REF)) throw new Error("CRITICAL ERROR: Demo must point to pachanova-demo Supabase project");
  }
  if (!dbUrl) {
    throw new Error("CRITICAL ERROR: DATABASE_URL is missing");
  }
  
  const lowerUrl = dbUrl.toLowerCase();
  
  if (!lowerUrl.includes("demo") && !lowerUrl.includes("localhost") && !lowerUrl.includes("127.0.0.1") && !lowerUrl.includes("pachanova_demo") && !lowerUrl.includes("cndppfspgqomgwixlfkw")) {
    throw new Error("CRITICAL ERROR: DATABASE_URL is not a local/demo URL. Aborting to protect production.");
  }

  const prodHosts = ["cloudsql", "neon.tech", "firebase", "run.app", "produccion", "production"];
  for (const host of prodHosts) {
    if (lowerUrl.includes(host) && !lowerUrl.includes("cndppfspgqomgwixlfkw")) {
      throw new Error(`CRITICAL ERROR: DATABASE_URL contains forbidden production host: ${host}. Aborting.`);
    }
  }
}
