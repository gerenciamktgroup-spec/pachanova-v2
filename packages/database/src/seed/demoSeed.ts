import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { sql, eq, and } from "drizzle-orm";
import * as schema from "../schema";
import * as dotenv from "dotenv";

// Load from .env.demo in root if present
dotenv.config({ path: "../../.env.demo" });
dotenv.config({ path: "../../.env.demo.local" });

import { validateDemoDatabaseUrl } from "../utils/demoValidation";

const dbUrl = process.env.DATABASE_URL;
validateDemoDatabaseUrl(dbUrl);

const client = postgres(dbUrl as string);
const db = drizzle(client, { schema });

async function seed() {
  console.log("🌱 Seeding Demo Database...");

  // 1.5. Seed Properties (First so we have IDs for balances)
  const propertyIdSB = "11111111-1111-1111-1111-111111111111"; // San Bartolo
  const propertyIdParacas = "22222222-2222-2222-2222-222222222222"; // Paracas
  const propertyIdChilca = "33333333-3333-3333-3333-333333333333"; // Chilca

  const propertiesToSeed = [
    {
      id: propertyIdSB,
      name: "PachaNova San Bartolo",
      location: "San Bartolo, Lima, Perú",
      propertyType: "land",
      imageUrl: "/properties/san-bartolo.jpg",
      status: "trading",
      totalValuationUsd: "5000000.00",
      tokenPriceUsd: "10.00",
      totalTokens: "500000.00",
      availableTokens: "480000.00",
      annualYieldExpected: "12.50",
      isDemo: true
    },
    {
      id: propertyIdParacas,
      name: "PachaNova Resort Paracas (PNC-PAR-001)",
      location: "Paracas, Ica, Perú",
      propertyType: "hotel",
      imageUrl: "/properties/paracas.jpg",
      status: "funding",
      totalValuationUsd: "12000000.00",
      tokenPriceUsd: "50.00",
      totalTokens: "240000.00",
      availableTokens: "200000.00",
      annualYieldExpected: "15.00",
      isDemo: true,
      metadata: { pachanova_pnc_codigo: "PNC-PAR-001", landbank_link: true, source: "core-landbank-fase8" }
    },
    {
      id: propertyIdChilca,
      name: "Centro Logístico Chilca",
      location: "Chilca, Lima, Perú",
      propertyType: "rental",
      imageUrl: "/properties/chilca.jpg",
      status: "coming_soon",
      totalValuationUsd: "8500000.00",
      tokenPriceUsd: "25.00",
      totalTokens: "340000.00",
      availableTokens: "340000.00",
      annualYieldExpected: "9.50",
      isDemo: true
    }
  ];

  for (const prop of propertiesToSeed) {
    // @ts-ignore
    await db.insert(schema.properties).values(prop).onConflictDoUpdate({
      target: schema.properties.id,
      set: prop
    });
  }

  // 1. Seed Users
  const users = await db.insert(schema.investors).values([
    { id: "00000000-0000-0000-0000-000000000000", firstName: "PachaNova", lastName: "Treasury", email: "treasury@pachanova.io", role: "admin", kycStatus: "approved", isVerified: true },
    { firstName: "Flavio", lastName: "Master", email: "gerencia.mkrgroup@gmail.com", role: "admin", kycStatus: "approved", isVerified: true },
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
  
  if (holder) {
    // Balance in San Bartolo
    await db.insert(schema.balances).values({
      investorId: holder.id,
      propertyId: propertyIdSB,
      availableTokens: "1250",
      availableUsd: "5000",
      lockedTokens: "0"
    }).onConflictDoUpdate({
      target: [schema.balances.investorId, schema.balances.propertyId],
      set: {
        availableTokens: sql`EXCLUDED.available_tokens`,
        availableUsd: sql`EXCLUDED.available_usd`,
        lockedTokens: sql`EXCLUDED.locked_tokens`
      }
    });

    // Balance in Paracas - Fase 8 Demo: $50k+ available for collateral (1000 locked in loan, 500 available for additional borrow demo)
    await db.insert(schema.balances).values({
      investorId: holder.id,
      propertyId: propertyIdParacas,
      availableTokens: "500",   // remaining available
      availableUsd: "5000",
      lockedTokens: "1000"      // $50k locked as colateral in demo loan
    }).onConflictDoUpdate({
      target: [schema.balances.investorId, schema.balances.propertyId],
      set: {
        availableTokens: sql`EXCLUDED.available_tokens`,
        availableUsd: sql`EXCLUDED.available_usd`,
        lockedTokens: sql`EXCLUDED.locked_tokens`
      }
    });
  }

  // Seed Treasury balance (San Bartolo)
  await db.insert(schema.balances).values({
    investorId: "00000000-0000-0000-0000-000000000000",
    propertyId: propertyIdSB,
    availableTokens: "500000",
    availableUsd: "0",
    lockedTokens: "0"
  }).onConflictDoUpdate({
    target: [schema.balances.investorId, schema.balances.propertyId],
    set: {
      availableTokens: sql`EXCLUDED.available_tokens`,
      availableUsd: sql`EXCLUDED.available_usd`,
      lockedTokens: sql`EXCLUDED.locked_tokens`
    }
  });

  // 2. Seed Valuation
  await db.delete(schema.annualValuations).where(eq(schema.annualValuations.source, "DEMO_VALUATION"));
  await db.insert(schema.annualValuations).values({
    propertyId: propertyIdSB,
    year: 2026,
    totalValuationUsd: "420000.00",
    pricePerSqm: "84.00",
    pricePerToken: "8.40",
    source: "DEMO_VALUATION",
    confirmedByFideicomiso: true
  });

  // Fase 8: Seed demo active loan for Paracas $50k collateral scenario (holder has 1000 tokens = $50k)
  // Uses the updated loans schema (Fase8 fields + pnc link for landbank integration)
  if (holder) {
    const paracasLoanId = "f8a1b2c3-d4e5-6789-abcd-ef0123456789"; // stable demo id
    await db.insert(schema.loans).values({
      id: paracasLoanId,
      investorId: holder.id,
      propertyId: propertyIdParacas,
      collateralAmount: "1000", // $50k value at $50/token
      collateralValueUsd: "50000.00",
      borrowedAmount: "30000.00", // 60% LTV
      interestRate: "0.0850",
      accumulatedInterest: "125.00", // some accrued for demo
      ltvAtBorrow: "0.6000",
      liquidationThreshold: "0.8500",
      healthFactor: "1.4167",
      lastAccruedAt: new Date(),
      status: "active",
      pachanova_pnc_codigo: "PNC-PAR-001", // direct link to core landbank PNC
      manualOverrideNote: "Fase8 Demo: $50k Paracas tokens as collateral. Master can override LTV/rate or force liquidate via Maestro UI."
    }).onConflictDoUpdate({
      target: schema.loans.id,
      set: {
        collateralAmount: "1000",
        collateralValueUsd: "50000.00",
        borrowedAmount: "30000.00",
        status: "active",
        pachanova_pnc_codigo: "PNC-PAR-001",
        manualOverrideNote: sql`EXCLUDED.manual_override_note`
      }
    });

    // Lock the collateral tokens in balance (simulate borrow action)
    await db.update(schema.balances)
      .set({
        availableTokens: "0",
        lockedTokens: "1000",
        lastUpdatedAt: new Date()
      })
      .where(and(
        eq(schema.balances.investorId, holder.id),
        eq(schema.balances.propertyId, propertyIdParacas)
      ));
  }

  // 3. System Parameters
  await db.delete(schema.systemParameters).where(eq(schema.systemParameters.key, "treasury_balance_usd"));
  await db.insert(schema.systemParameters).values([
    { key: "treasury_balance_usd", value: "0" }
  ]);

  console.log("✅ Demo Seeding Complete! (Fase8 Paracas $50k borrow demo seeded)");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed", err);
  process.exit(1);
});
