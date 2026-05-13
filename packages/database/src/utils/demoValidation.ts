export function validateDemoDatabaseUrl(dbUrl?: string): void {
  if (process.env.DEMO_MODE !== 'true') {
    throw new Error("CRITICAL ERROR: DEMO_MODE is not true");
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error("CRITICAL ERROR: NODE_ENV is production");
  }
  if (!dbUrl) {
    throw new Error("CRITICAL ERROR: DATABASE_URL is missing");
  }
  
  const lowerUrl = dbUrl.toLowerCase();
  
  if (!lowerUrl.includes("demo") && !lowerUrl.includes("localhost") && !lowerUrl.includes("127.0.0.1") && !lowerUrl.includes("pachanova_demo")) {
    throw new Error("CRITICAL ERROR: DATABASE_URL is not a local/demo URL. Aborting to protect production.");
  }

  const prodHosts = ["cloudsql", "neon.tech", "supabase", "firebase", "run.app", "produccion", "production"];
  for (const host of prodHosts) {
    if (lowerUrl.includes(host)) {
      throw new Error(`CRITICAL ERROR: DATABASE_URL contains forbidden production host: ${host}. Aborting.`);
    }
  }
}
