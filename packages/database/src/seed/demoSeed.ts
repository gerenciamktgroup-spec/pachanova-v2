import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { sql, eq } from "drizzle-orm";
import * as schema from "../schema";
import * as dotenv from "dotenv";

// Load from .env.demo in root if present
dotenv.config({ path: "../../.env.demo" });
dotenv.config({ path: "../../.env.demo.local" });

import { validateDemoDatabaseUrl } from "../utils/demoValidation";

const dbUrl = process.env.DATABASE_URL;
validateDemoDatabaseUrl(dbUrl);

const client = postgres(dbUrl);
const db = drizzle(client, { schema });

async function seed() {
  console.log("🌱 Seeding Demo Database...");

  // 1. Seed Users
  const users = await db.insert(schema.investors).values([
    { firstName: "Demo", lastName: "Admin", email: "demo.admin@pachanova.local", role: "admin", kycStatus: "approved", isVerified: true },
    { firstName: "Demo", lastName: "Investor", email: "demo.investor.approved@pachanova.local", role: "investor", kycStatus: "approved", isVerified: true },
    { firstName: "Demo", lastName: "Holder", email: "demo.investor.holder@pachanova.local", role: "investor", kycStatus: "approved", isVerified: true },
    { firstName: "Demo", lastName: "Pending", email: "demo.investor.pending@pachanova.local", role: "investor", kycStatus: "pending", isVerified: false },
    { firstName: "Demo", lastName: "Fiduciario", email: "demo.fiduciario@pachanova.local", role: "fiduciario", kycStatus: "approved", isVerified: true },
    { firstName: "Demo", lastName: "Comite", email: "demo.comite@pachanova.local", role: "comite", kycStatus: "approved", isVerified: true }
  ]).onConflictDoUpdate({
    target: schema.investors.email,
    set: {
      firstName: sql`EXCLUDED.first_name`,
      lastName: sql`EXCLUDED.last_name`,
      role: sql`EXCLUDED.role`,
      kycStatus: sql`EXCLUDED.kyc_status`,
      isVerified: sql`EXCLUDED.is_verified`
    }
  }).returning();

  const holder = users.find(u => u.email === "demo.investor.holder@pachanova.local");
  const approved = users.find(u => u.email === "demo.investor.approved@pachanova.local");
  
  if (holder) {
    await db.insert(schema.balances).values({
      investorId: holder.id,
      availableTokens: "1250",
      availableUsd: "5000",
      lockedTokens: "0"
    }).onConflictDoUpdate({
      target: schema.balances.investorId,
      set: {
        availableTokens: sql`EXCLUDED.available_tokens`,
        availableUsd: sql`EXCLUDED.available_usd`,
        lockedTokens: sql`EXCLUDED.locked_tokens`
      }
    });
  }

  if (approved) {
    await db.insert(schema.balances).values({
      investorId: approved.id,
      availableTokens: "0",
      availableUsd: "10000",
      lockedTokens: "0"
    }).onConflictDoUpdate({
      target: schema.balances.investorId,
      set: {
        availableTokens: sql`EXCLUDED.available_tokens`,
        availableUsd: sql`EXCLUDED.available_usd`,
        lockedTokens: sql`EXCLUDED.locked_tokens`
      }
    });
  }

  // 2. Seed Properties
  await db.delete(schema.properties).where(eq(schema.properties.isDemo, true));
  const seededProperties = await db.insert(schema.properties).values([
    {
      name: "Parcelas Agro-Residenciales",
      location: "Lima, Peru",
      status: "trading",
      totalValuationUsd: "4200000.00",
      tokenPriceUsd: "8.40",
      totalTokens: "500000.00",
      availableTokens: "500000.00",
      annualYieldExpected: "8.70",
      isDemo: true,
      metadata: { code: "PAR", color: "#7A9A7E", fase: 16, product_config: "PAR", net: 68112.5, eff: 54280, power: 9.4, sqm: 14250, claim: 23125, orq: "SYNC", masterNote: "Master: orq real inject 68112.5 base net" }
    },
    {
      name: "Vivienda San Bartolo",
      location: "San Bartolo, Peru",
      status: "trading",
      totalValuationUsd: "265767.60",
      tokenPriceUsd: "8.40",
      totalTokens: "31639.00",
      availableTokens: "31639.00",
      annualYieldExpected: "17.10",
      isDemo: true,
      metadata: { code: "VIV", color: "#C9A77B", fase: 21, product_config: "Vivienda", net: 31639, eff: 31639, power: 17.1, sqm: 6800, claim: 8450, orq: "LIVE" }
    },
    {
      name: "Alquiler Yield Estate",
      location: "San Bartolo, Peru",
      status: "trading",
      totalValuationUsd: "346800.00",
      tokenPriceUsd: "12.00",
      totalTokens: "28900.00",
      availableTokens: "28900.00",
      annualYieldExpected: "14.80",
      isDemo: true,
      metadata: { code: "YLD", color: "#4B8FF0", fase: 49, product_config: "Alquiler_Yield", net: 28900, eff: 23125, power: 14.2, sqm: 5200, claim: 23125, orq: "ORQ", masterNote: "Master override: +2.1pp effective yield applied" }
    },
    {
      name: "Hotel Boutique Fase",
      location: "San Bartolo, Peru",
      status: "coming_soon",
      totalValuationUsd: "226200.00",
      tokenPriceUsd: "12.00",
      totalTokens: "18850.00",
      availableTokens: "18850.00",
      annualYieldExpected: "22.40",
      isDemo: true,
      metadata: { code: "HTL", color: "#B46A4C", fase: 50, product_config: "Hotel", net: 18850, eff: 17210, power: 11.8, sqm: 3100, claim: 6100, orq: "SYNC" }
    },
    {
      name: "Mixed-Use Cross",
      location: "Lima, Peru",
      status: "trading",
      totalValuationUsd: "27300.00",
      tokenPriceUsd: "8.40",
      totalTokens: "3250.00",
      availableTokens: "3250.00",
      annualYieldExpected: "7.90",
      isDemo: true,
      metadata: { code: "MIX", color: "#D8C3A5", fase: 51, product_config: "PAR", net: 3250, eff: 2980, power: 6.5, sqm: 980, claim: 1120, orq: "LIVE", masterNote: "Master notes: cross-PNC attribution + flywheel live" }
    }
  ]).returning();

  // 3. Seed Valuations
  await db.delete(schema.annualValuations).where(eq(schema.annualValuations.source, "DEMO_VALUATION"));
  for (const prop of seededProperties) {
    await db.insert(schema.annualValuations).values({
      propertyId: prop.id,
      year: 2026,
      totalValuationUsd: prop.totalValuationUsd,
      pricePerSqm: "84.00",
      pricePerToken: prop.tokenPriceUsd,
      source: "DEMO_VALUATION",
      confirmedByFideicomiso: true
    });
  }

  // 3. System Parameters
  await db.delete(schema.systemParameters).where(eq(schema.systemParameters.key, "treasury_balance_usd"));
  await db.insert(schema.systemParameters).values([
    { key: "treasury_balance_usd", value: "0" }
  ]);

  console.log("✅ Demo Seeding Complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed", err);
  process.exit(1);
});
