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
    { firstName: "Carlos", lastName: "Mendoza", email: "carlos.mendoza@demo.pachanova.io", role: "admin", kycStatus: "approved", isVerified: true },
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

    // Fase44: Seed historical + current realized distribs / cashflow paid for PNC-PAR (your 12.5% share of ~68325 net) + AET slice.
    // Fase46: + claimable/claimed/compounded rows with status + proofRef + compoundDetails (real 8540/23125 + predict + Fase9 net tie)
    // (refs + predict notes carried in orq cashflowHistory for display; seed provides amounts/dates for HISTORIAL surface + claim/compound actions)
    const distribsToSeed = [
      { id: 'd1111111-1111-1111-1111-111111111111', propertyId: propertyIdParacas, investorId: holder.id, amountUsd: '8540.62', periodStart: new Date('2026-04-01'), periodEnd: new Date('2026-04-30'), isDemo: true, createdAt: new Date('2026-05-01'), status: 'PAGADO', proofRef: 'tx@block-25235270-23125' },
      { id: 'd2222222-2222-2222-2222-222222222222', propertyId: propertyIdParacas, investorId: holder.id, amountUsd: '8540.62', periodStart: new Date('2026-05-01'), periodEnd: new Date('2026-05-31'), isDemo: true, createdAt: new Date('2026-06-01'), status: 'CLAIMABLE', proofRef: 'pending-claim-fase46' }, // Fase46 claimable for RECLAMAR
      { id: 'd3333333-3333-3333-3333-333333333333', propertyId: propertyIdSB, investorId: holder.id, amountUsd: '23125.00', periodStart: new Date('2026-05-15'), periodEnd: new Date('2026-06-02'), isDemo: true, createdAt: new Date('2026-06-02'), status: 'PAGADO', proofRef: 'tx@block-25235280-23125', compoundDetails: '{"toPnc":"PNC-SB-003","tokensAdded":16.9,"growth":196}' }, // Fase46 compounded example
      { id: 'd4444444-4444-4444-4444-444444444444', propertyId: propertyIdParacas, investorId: holder.id, amountUsd: '8540.62', periodStart: new Date('2026-06-01'), periodEnd: new Date('2026-06-03'), isDemo: true, createdAt: new Date('2026-06-03'), status: 'CLAIMED', proofRef: '0xf6b06d413f@25236020', claimedAt: new Date('2026-06-03') } // Fase46 claimed example (real PAR 8540)
    ];
    for (const d of distribsToSeed) {
      await db.insert(schema.distributions).values(d as any).onConflictDoUpdate({
        target: schema.distributions.id,
        set: { amountUsd: (d as any).amountUsd, status: (d as any).status, proofRef: (d as any).proofRef, compoundDetails: (d as any).compoundDetails, claimedAt: (d as any).claimedAt }
      });
    }
  }

  // 2.5 Seed Proposals (Fase33/34 Governance)
  const proposalId1 = "33333333-3333-3333-3333-333333333301";
  const proposalId2 = "33333333-3333-3333-3333-333333333302";
  
  await db.insert(schema.proposals).values([
    {
      id: proposalId1,
      title: "Financiamiento de Fase 2 PNC-PAR-001 (Paracas)",
      description: "Propuesta para autorizar la liberación de fondos de tesorería y expandir el Resort Paracas. Incrementará el LTV máximo de préstamos colaterales en la fase 2.",
      status: "active",
      creatorInvestorId: "00000000-0000-0000-0000-000000000000",
      relatedPropertyId: propertyIdParacas,
      startAt: new Date(),
      endAt: new Date(Date.now() + 10 * 24 * 3600 * 1000), // 10 days
      quorumRequired: "15.00",
      vertexPrediction: "Fase42 Prediction: Probabilidad de Aprobación 78%. Impacto Yield: +1.2% proyectado."
    },
    {
      id: proposalId2,
      title: "Actualización de Rendimiento Anual San Bartolo",
      description: "Propuesta para ajustar el rendimiento esperado de San Bartolo a 13.5% anual debido a mayor ocupación y revaluación comercial.",
      status: "active",
      creatorInvestorId: "00000000-0000-0000-0000-000000000000",
      relatedPropertyId: propertyIdSB,
      startAt: new Date(),
      endAt: new Date(Date.now() + 5 * 24 * 3600 * 1000), // 5 days
      quorumRequired: "10.00",
      vertexPrediction: "Fase42 Prediction: Probabilidad de Aprobación 91%. Impacto Yield: +1.0% proyectado."
    }
  ]).onConflictDoUpdate({
    target: schema.proposals.id,
    set: {
      title: sql`EXCLUDED.title`,
      description: sql`EXCLUDED.description`,
      status: sql`EXCLUDED.status`
    }
  });

  // 3. System Parameters
  await db.delete(schema.systemParameters).where(eq(schema.systemParameters.key, "treasury_balance_usd"));
  await db.insert(schema.systemParameters).values([
    { key: "treasury_balance_usd", value: "0" },
    // Fase3: defaults for borrow/credits full loop (overridable by Master per-PNC in landbank meta or superadmin)
    { key: "defi_max_ltv", value: "0.60", description: "Default max LTV 60% for DeFi RWA borrow against landbank 5PNC collateral" },
    { key: "defi_base_interest_rate", value: "0.0850", description: "Base 8.5% APY interest for active loans (accrue + health tie landbank net)" }
  ]);

  console.log("✅ Demo Seeding Complete! (Fase8 Paracas $50k borrow + Fase44 3 distribs history for PAR/AET ~8540/23125 with predict refs seeded + Fase46 claimable/claimed/compounded rows + status/proof)");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed", err);
  process.exit(1);
});
