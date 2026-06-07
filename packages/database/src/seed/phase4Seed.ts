import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import * as schema from "../schema";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env.demo" });
dotenv.config({ path: "../../.env.demo.local" });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error("DATABASE_URL missing");

const client = postgres(dbUrl as string);
const db = drizzle(client, { schema });

async function seed() {
  console.log("🌱 Phase 4: Seeding Core Banking Database...");

  // 1. Seed Properties (The 3 Models)
  const propertyIdSB = "11111111-1111-1111-1111-111111111111";
  const propertyIdParacas = "22222222-2222-2222-2222-222222222222";
  const propertyIdChilca = "33333333-3333-3333-3333-333333333333";

  const propertiesToSeed = [
    {
      id: propertyIdSB,
      name: "PachaNova San Bartolo",
      location: "San Bartolo, Lima, Perú",
      propertyType: "land", // Landbanking model
      imageUrl: "/properties/san-bartolo.jpg",
      status: "trading",
      totalValuationUsd: "5000000.00",
      tokenPriceUsd: "8.50", // $8.50 per user instructions
      totalTokens: "588235.00", // 5M / 8.5
      availableTokens: "588235.00",
      annualYieldExpected: "13.50",
      isDemo: false
    },
    {
      id: propertyIdParacas,
      name: "Resort Paracas (Desarrollo)",
      location: "Paracas, Ica, Perú",
      propertyType: "hotel", // Development/Sale model
      imageUrl: "/properties/paracas.jpg",
      status: "funding",
      totalValuationUsd: "12000000.00",
      tokenPriceUsd: "50.00",
      totalTokens: "240000.00",
      availableTokens: "240000.00",
      annualYieldExpected: "15.00",
      isDemo: false,
      metadata: { payout_model: "liquidation_sale" }
    },
    {
      id: propertyIdChilca,
      name: "Centro Logístico Chilca",
      location: "Chilca, Lima, Perú",
      propertyType: "rental", // Perpetual Rental model
      imageUrl: "/properties/chilca.jpg",
      status: "coming_soon",
      totalValuationUsd: "8500000.00",
      tokenPriceUsd: "25.00",
      totalTokens: "340000.00",
      availableTokens: "340000.00",
      annualYieldExpected: "9.50",
      isDemo: false,
      metadata: { payout_model: "perpetual_yield" }
    }
  ];

  for (const prop of propertiesToSeed) {
    // @ts-ignore
    await db.insert(schema.properties).values(prop).onConflictDoUpdate({
      target: schema.properties.id,
      set: prop
    });
  }

  // 2. Seed Users
  await db.insert(schema.investors).values([
    { firstName: "Master", lastName: "Admin", email: "carlos.mendoza@demo.pachanova.io", role: "admin", kycStatus: "approved", isVerified: true },
    { firstName: "Nuevo", lastName: "Inversor", email: "investor@pachanova.local", role: "investor", kycStatus: "pending", isVerified: false }
  ]).onConflictDoUpdate({
    target: schema.investors.email,
    set: {
      firstName: sql`EXCLUDED.first_name`,
      lastName: sql`EXCLUDED.last_name`,
      role: sql`EXCLUDED.role`,
      kycStatus: sql`EXCLUDED.kyc_status`,
      isVerified: sql`EXCLUDED.is_verified`
    }
  });

  console.log("✅ Phase 4 Seeding Complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed", err);
  process.exit(1);
});
