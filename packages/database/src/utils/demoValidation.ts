export function validateDemoDatabaseUrl(dbUrl?: string): asserts dbUrl is string {
  if (process.env.DEMO_MODE !== 'true') {
    throw new Error("CRITICAL ERROR: DEMO_MODE must be 'true' for demo operations");
  }

  const target = `${process.env.DATABASE_URL ?? ''} ${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''} ${process.env.SUPABASE_URL ?? ''}`
  const DEMO_REF = 'cndppfspgqomgwixlfkw'
  const PROD_REF = 'wdrhurnbxkhwmqrcbgpu'

  if (target.includes(PROD_REF)) throw new Error("CRITICAL ERROR: Demo is pointing to PROD Supabase project");
  if (!dbUrl) {
    throw new Error("CRITICAL ERROR: DATABASE_URL is missing");
  }
  
  const lowerUrl = dbUrl.toLowerCase();
  
  const isLocal = lowerUrl.includes("localhost") || lowerUrl.includes("127.0.0.1");
  const isNamedDemo = lowerUrl.includes("demo") || lowerUrl.includes("pachanova_demo");
  const isApprovedRemoteDemo = target.includes(DEMO_REF);

  if (!isLocal && !isNamedDemo && !isApprovedRemoteDemo) {
    throw new Error("CRITICAL ERROR: DATABASE_URL is not a local/demo URL. Aborting to protect production.");
  }

  const prodHosts = ["cloudsql", "neon.tech", "firebase", "run.app", "produccion", "production"];
  for (const host of prodHosts) {
    if (lowerUrl.includes(host) && !isApprovedRemoteDemo) {
      throw new Error(`CRITICAL ERROR: DATABASE_URL contains forbidden production host: ${host}. Aborting.`);
    }
  }
}
