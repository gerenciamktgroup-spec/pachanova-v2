export function validateDemoDatabaseUrl(dbUrl?: string): asserts dbUrl is string {
  const target = `${process.env.DATABASE_URL ?? ''} ${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''} ${process.env.SUPABASE_URL ?? ''}`;
  const DEMO_REF = 'cndppfspgqomgwixlfkw';
  const PROD_REF = 'wdrhurnbxkhwmqrcbgpu';

  if (target.includes(PROD_REF)) {
    throw new Error("CRITICAL ERROR: Demo is pointing to PROD Supabase project");
  }

  if (!dbUrl) {
    return;
  }
  
  const lowerUrl = dbUrl.toLowerCase();
  const isLocal = lowerUrl.includes("localhost") || lowerUrl.includes("127.0.0.1");
  const isNamedDemo = lowerUrl.includes("demo") || lowerUrl.includes("pachanova_demo");
  const isApprovedRemoteDemo = target.includes(DEMO_REF);

  if (!isLocal && !isNamedDemo && !isApprovedRemoteDemo) {
    // If not local or demo ref, ensure it doesn't contain forbidden prod hosts
    const prodHosts = ["cloudsql", "neon.tech", "firebase", "run.app", "produccion", "production"];
    for (const host of prodHosts) {
      if (lowerUrl.includes(host)) {
        throw new Error(`CRITICAL ERROR: DATABASE_URL contains forbidden production host: ${host}. Aborting.`);
      }
    }
  }
}
