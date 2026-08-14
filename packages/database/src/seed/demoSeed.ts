import * as dotenv from "dotenv";
import { and, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { DEMO_IDENTITIES } from "../demo/identities";
import * as schema from "../schema";
import { validateDemoDatabaseUrl } from "../utils/demoValidation";

dotenv.config({ path: "../../.env.demo" });
dotenv.config({ path: "../../.env.demo.local" });

const dbUrl = process.env.DATABASE_URL;
validateDemoDatabaseUrl(dbUrl);

const client = postgres(dbUrl, { prepare: false });
const db = drizzle(client, { schema });

const propertySeeds = [
  {
    id: "10000000-0000-0000-0000-000000000001",
    name: "Parcelas Agro-Residenciales",
    location: "Lima, Peru",
    status: "trading" as const,
    totalValuationUsd: "4200000.00",
    tokenPriceUsd: "8.40",
    totalTokens: "500000.00",
    availableTokens: "500000.00",
    annualYieldExpected: "8.70",
    isDemo: true,
    metadata: { code: "PAR", color: "#7A9A7E", fase: 16, product_config: "PAR", net: 68112.5, eff: 54280, power: 9.4, sqm: 14250, claim: 23125, orq: "SYNC", masterNote: "Referencia Master/ORQ: base net 68112.5" },
  },
  {
    id: "10000000-0000-0000-0000-000000000002",
    name: "Vivienda San Bartolo",
    location: "San Bartolo, Peru",
    status: "trading" as const,
    totalValuationUsd: "265767.60",
    tokenPriceUsd: "8.40",
    totalTokens: "31639.00",
    availableTokens: "31639.00",
    annualYieldExpected: "17.10",
    isDemo: true,
    metadata: { code: "VIV", color: "#C9A77B", fase: 21, product_config: "Vivienda", net: 31639, eff: 31639, power: 17.1, sqm: 6800, claim: 8450, orq: "LIVE" },
  },
  {
    id: "10000000-0000-0000-0000-000000000003",
    name: "Alquiler Yield Estate",
    location: "San Bartolo, Peru",
    status: "trading" as const,
    totalValuationUsd: "346800.00",
    tokenPriceUsd: "12.00",
    totalTokens: "28900.00",
    availableTokens: "28900.00",
    annualYieldExpected: "14.80",
    isDemo: true,
    metadata: { code: "YLD", color: "#4B8FF0", fase: 49, product_config: "Alquiler_Yield", net: 28900, eff: 23125, power: 14.2, sqm: 5200, claim: 23125, orq: "ORQ", masterNote: "Master override: +2.1pp effective yield applied" },
  },
  {
    id: "10000000-0000-0000-0000-000000000004",
    name: "Hotel Boutique Fase",
    location: "San Bartolo, Peru",
    status: "coming_soon" as const,
    totalValuationUsd: "226200.00",
    tokenPriceUsd: "12.00",
    totalTokens: "18850.00",
    availableTokens: "18850.00",
    annualYieldExpected: "22.40",
    isDemo: true,
    metadata: { code: "HTL", color: "#B46A4C", fase: 50, product_config: "Hotel", net: 18850, eff: 17210, power: 11.8, sqm: 3100, claim: 6100, orq: "SYNC" },
  },
  {
    id: "10000000-0000-0000-0000-000000000005",
    name: "Mixed-Use Cross",
    location: "Lima, Peru",
    status: "trading" as const,
    totalValuationUsd: "27300.00",
    tokenPriceUsd: "8.40",
    totalTokens: "3250.00",
    availableTokens: "3250.00",
    annualYieldExpected: "7.90",
    isDemo: true,
    metadata: { code: "MIX", color: "#D8C3A5", fase: 51, product_config: "PAR", net: 3250, eff: 2980, power: 6.5, sqm: 980, claim: 1120, orq: "LIVE", masterNote: "Master notes: cross-PNC attribution + flywheel live" },
  },
] as const;

function metadataCode(value: unknown): string | undefined {
  if (!value || typeof value !== "object" || !("code" in value)) return undefined;
  return String(value.code);
}

async function seed() {
  console.log("Seeding deterministic demo database...");

  const users = await db
    .insert(schema.investors)
    .values([
      { ...DEMO_IDENTITIES.admin, firstName: "Demo", lastName: "Admin", role: "admin", kycStatus: "approved", isVerified: true, isDemo: true },
      { ...DEMO_IDENTITIES.approvedInvestor, firstName: "Demo", lastName: "Investor", role: "investor", kycStatus: "approved", isVerified: true, isDemo: true },
      { ...DEMO_IDENTITIES.holderInvestor, firstName: "Demo", lastName: "Holder", role: "investor", kycStatus: "approved", isVerified: true, isDemo: true },
      { ...DEMO_IDENTITIES.pendingInvestor, firstName: "Demo", lastName: "Pending", role: "investor", kycStatus: "pending", isVerified: false, isDemo: true },
      { ...DEMO_IDENTITIES.fiduciario, firstName: "Demo", lastName: "Fiduciario", role: "fiduciario", kycStatus: "approved", isVerified: true, isDemo: true },
      { ...DEMO_IDENTITIES.comite, firstName: "Demo", lastName: "Comite", role: "comite", kycStatus: "approved", isVerified: true, isDemo: true },
    ])
    .onConflictDoUpdate({
      target: schema.investors.email,
      set: {
        firstName: sql`excluded.first_name`,
        lastName: sql`excluded.last_name`,
        role: sql`excluded.role`,
        kycStatus: sql`excluded.kyc_status`,
        isVerified: sql`excluded.is_verified`,
        isDemo: true,
        updatedAt: new Date(),
      },
    })
    .returning();

  const holder = users.find((user) => user.email === DEMO_IDENTITIES.holderInvestor.email);
  const approved = users.find((user) => user.email === DEMO_IDENTITIES.approvedInvestor.email);
  if (!holder || !approved) throw new Error("Demo identities could not be resolved after seeding");

  for (const balance of [
    { investorId: holder.id, availableTokens: "1250", availableUsd: "5000", lockedUsd: "0", lockedTokens: "0", reservedTokens: "0" },
    { investorId: approved.id, availableTokens: "1750", availableUsd: "10000", lockedUsd: "0", lockedTokens: "0", reservedTokens: "250" },
  ]) {
    await db
      .insert(schema.balances)
      .values(balance)
      .onConflictDoUpdate({
        target: schema.balances.investorId,
        set: {
          availableTokens: balance.availableTokens,
          availableUsd: balance.availableUsd,
          lockedUsd: balance.lockedUsd,
          lockedTokens: balance.lockedTokens,
          reservedTokens: balance.reservedTokens,
          lastUpdatedAt: new Date(),
        },
      });
  }

  const existingProperties = await db.select().from(schema.properties).where(eq(schema.properties.isDemo, true));
  const seededProperties: Array<typeof schema.properties.$inferSelect> = [];

  for (const propertySeed of propertySeeds) {
    const existing = existingProperties.find((property) => metadataCode(property.metadata) === propertySeed.metadata.code);
    if (existing) {
      const [updated] = await db
        .update(schema.properties)
        .set({ ...propertySeed, id: undefined, updatedAt: new Date() })
        .where(eq(schema.properties.id, existing.id))
        .returning();
      seededProperties.push(updated);
    } else {
      const [inserted] = await db.insert(schema.properties).values(propertySeed).returning();
      seededProperties.push(inserted);
    }
  }

  await db.delete(schema.annualValuations).where(eq(schema.annualValuations.source, "DEMO_VALUATION"));
  await db.insert(schema.annualValuations).values(
    seededProperties.map((property) => ({
      propertyId: property.id,
      year: 2026,
      totalValuationUsd: property.totalValuationUsd,
      pricePerSqm: "84.00",
      pricePerToken: property.tokenPriceUsd,
      source: "DEMO_VALUATION",
      confirmedByFideicomiso: true,
      isDemo: true,
    })),
  );

  const par = seededProperties.find((property) => metadataCode(property.metadata) === "PAR");
  if (!par) throw new Error("PAR property was not seeded");

  const [existingMarketOrder] = await db
    .select({ id: schema.p2pOrders.id })
    .from(schema.p2pOrders)
    .where(and(eq(schema.p2pOrders.sellerInvestorId, approved.id), eq(schema.p2pOrders.propertyId, par.id), eq(schema.p2pOrders.status, "open")))
    .limit(1);

  if (!existingMarketOrder) {
    await db.insert(schema.p2pOrders).values({
      sellerInvestorId: approved.id,
      propertyId: par.id,
      quantity: "250",
      pricePerToken: "8.75",
      totalAmount: "2187.50",
      status: "open",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isDemo: true,
    });
  }

  await db
    .insert(schema.genesisPurchases)
    .values({
      id: "20000000-0000-0000-0000-000000000001",
      investorId: holder.id,
      tokenAmount: "1250",
      usdPricePerToken: "8.40",
      totalUsdAmount: "10500.00",
      status: "completed",
      paymentReference: "demo_seed_genesis_holder",
    })
    .onConflictDoNothing({ target: schema.genesisPurchases.id });

  await db
    .insert(schema.tokenLedger)
    .values({
      id: "30000000-0000-0000-0000-000000000001",
      investorId: holder.id,
      operation: "mint",
      amount: "1250",
      txHash: "0x00000000000000000000000000000000000000000000000000000000seed0001",
      previousHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      currentHash: "0x00000000000000000000000000000000000000000000000000000000hash0001",
    })
    .onConflictDoNothing({ target: schema.tokenLedger.id });

  await db
    .insert(schema.systemParameters)
    .values({ key: "treasury_balance_usd", value: "0", description: "Deterministic demo treasury balance" })
    .onConflictDoUpdate({
      target: schema.systemParameters.key,
      set: { value: "0", description: "Deterministic demo treasury balance", updatedAt: new Date() },
    });

  console.log(`Demo seed complete: ${users.length} identities, ${seededProperties.length} properties, one open P2P order.`);
}

seed()
  .catch((error) => {
    console.error("Demo seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await client.end();
  });
