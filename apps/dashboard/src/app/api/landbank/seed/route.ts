import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import { eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

// POST /api/landbank/seed - seeds demo properties for Land Banking demo
export async function POST() {
  try {
    // Check if we already have non-demo properties
    const existing = await db.query.properties.findMany();
    
    const demoProperties = [
      {
        name: "Paracas Land Reserve — PNC-PAR-001",
        location: "Paracas, Ica, Perú",
        propertyType: "land" as const,
        status: "trading" as const,
        totalValuationUsd: "680000.00",
        tokenPriceUsd: "1.00",
        totalTokens: "680000.00",
        availableTokens: "595000.00",
        annualYieldExpected: "8.50",
        contractAddress: "0xA1b2C3d4E5f678901234567890abcdef12345678",
        isDemo: false,
        metadata: {
          pncCode: "PNC-PAR-001",
          hectares: 5,
          phase: "Fase15",
          govQuorum: "PASSED",
          pachaPower: 3250,
          net: 68112.5,
          effectiveYield: 31639,
          effectivePct: "17.1%"
        }
      },
      {
        name: "San Bartolo Coastal Estate — PNC-SB-003",
        location: "San Bartolo, Lima, Perú",
        propertyType: "residential" as const,
        status: "funded" as const,
        totalValuationUsd: "1058400.00",
        tokenPriceUsd: "1.00",
        totalTokens: "1058400.00",
        availableTokens: "925350.00",
        annualYieldExpected: "12.50",
        contractAddress: null,
        isDemo: false,
        metadata: {
          pncCode: "PNC-SB-003",
          hectares: 8,
          phase: "Fase15",
          govQuorum: "PASSED",
          pachaPower: 3250,
          net: 105840,
          effectiveYield: 13230,
          effectivePct: "12.5%"
        }
      },
      {
        name: "Chilca Agricultural Reserve — PNC-CHI-004",
        location: "Chilca, Lima, Perú",
        propertyType: "land" as const,
        status: "funding" as const,
        totalValuationUsd: "420000.00",
        tokenPriceUsd: "1.00",
        totalTokens: "420000.00",
        availableTokens: "420000.00",
        annualYieldExpected: "9.20",
        contractAddress: null,
        isDemo: false,
        metadata: {
          pncCode: "PNC-CHI-004",
          hectares: 3,
          phase: "Fase15",
          govQuorum: "PASSED",
          pachaPower: 3250,
          net: 42000,
          effectiveYield: 5250,
          effectivePct: "12.5%"
        }
      },
      {
        name: "AgroEco Terreno Lima Norte — AET-002",
        location: "Lima Norte, Lima, Perú",
        propertyType: "land" as const,
        status: "coming_soon" as const,
        totalValuationUsd: "242812.50",
        tokenPriceUsd: "1.00",
        totalTokens: "0.00",
        availableTokens: "0.00",
        annualYieldExpected: "11.80",
        contractAddress: null,
        isDemo: false,
        metadata: {
          pncCode: "AET-002",
          hectares: 2,
          phase: "Fase15",
          govQuorum: "PASSED",
          pachaPower: 3250,
          net: 24281,
          effectiveYield: 3035,
          effectivePct: "12.5%"
        }
      },
      {
        name: "Hotel Paracas Luxury Collection — HPL-001",
        location: "Paracas, Ica, Perú",
        propertyType: "hotel" as const,
        status: "coming_soon" as const,
        totalValuationUsd: "3500000.00",
        tokenPriceUsd: "10.00",
        totalTokens: "0.00",
        availableTokens: "0.00",
        annualYieldExpected: "14.50",
        contractAddress: null,
        isDemo: false,
        metadata: {
          pncCode: "HPL-001",
          rooms: 120,
          phase: "Fase55",
          govQuorum: "PENDING",
          occupancyRate: "78%"
        }
      }
    ];

    let seeded = 0;
    let skipped = 0;

    for (const prop of demoProperties) {
      // Check if already exists by name
      const existingProp = existing.find(e => e.name === prop.name);
      if (existingProp) {
        skipped++;
        continue;
      }

      await db.insert(schema.properties).values(prop as any);
      seeded++;
    }

    await db.insert(schema.auditLogs).values({
      action: "LANDBANK_SEED",
      details: { seeded, skipped, total: demoProperties.length }
    } as any);

    return NextResponse.json({
      success: true,
      seeded,
      skipped,
      message: `Seeded ${seeded} properties, skipped ${skipped} existing`
    });
  } catch (err: any) {
    console.error("[landbank seed]", err);
    return NextResponse.json(
      { error: err?.message || "Seed failed" },
      { status: 500 }
    );
  }
}
