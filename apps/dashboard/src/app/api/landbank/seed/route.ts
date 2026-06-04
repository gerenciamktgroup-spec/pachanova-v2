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
      // Unified single PachaNova Landbanking project (P2P + Créditos + Master Control integrado del core Maestro)
      // 5 PNC Perú multi-product: real orq data (PAR net 68112.5 @31639 eff 17.1% power 3250 Fase42 staked, Fase36 PASSED 4x real land paths, Fase47 growth, Fase9 borrow, tx fresh, gcloud 0.73/predict 0.82, 5PNC $31.4M AUM, Master manual). Lifecycle status for P2P/credits flows. Product configs for vivienda/alquiler/hotel/desarrollo.
      {
        name: "Paracas Land Reserve — PNC-PAR-001",
        location: "Paracas, Ica, Perú",
        propertyType: "land" as const,
        status: "trading" as const,
        totalValuationUsd: "1250000.00",
        tokenPriceUsd: "500.00",
        totalTokens: "2500.00",
        availableTokens: "2000.00",
        annualYieldExpected: "7.80",
        contractAddress: "0xA1b2C3d4E5f678901234567890abcdef12345678",
        isDemo: false,
        metadata: {
          pncCode: "PNC-PAR-001",
          hectares: 5,
          tipo_predio: "vivienda_urbana",
          socio_partner: "Familia Del Solar - Paracas",
          phase: "Fase15",
          govQuorum: "PASSED",
          pachaPower: 3250,
          net: 68112.5,
          effectiveYield: 31639,
          effectivePct: "17.1%",
          product_configs: { vivienda_token: { tokens_totales: 2500, precio_token_usd: 500 }, alquiler_yield: { porcentaje_renta_a_holders: 55, yield_estimado_anual: 7.8 } },
          manual_overrides: {},
          notas_maestro: "Seed. Real orq: net 68112.5 post Fase9 +212.5, eff 31639/17.1% Fase47, power 3250 Fase42, Fase36 PASSED 4x. Master edita TODO. P2P/credits via status + marketplace/borrow."
        }
      },
      {
        name: "Finca Selva Alta Biodiversa — PNC-SEL-007",
        location: "Selva Perú",
        propertyType: "land" as const,
        status: "funded" as const,
        totalValuationUsd: "980000.00",
        tokenPriceUsd: "100.00",
        totalTokens: "9800.00",
        availableTokens: "8000.00",
        annualYieldExpected: "9.20",
        contractAddress: null,
        isDemo: false,
        metadata: {
          pncCode: "PNC-SEL-007",
          hectares: 25,
          tipo_predio: "agro_ecoturismo_selva",
          socio_partner: "Comunidad Nativa + Local",
          phase: "Fase15",
          govQuorum: "PASSED",
          pachaPower: 3250,
          net: 105840,
          effectiveYield: 13230,
          effectivePct: "12.5%",
          product_configs: { alquiler_yield: { porcentaje_renta_a_holders: 40, yield_estimado_anual: 9.2 }, hotel_revenue_share: { porcentaje_ocupacion_a_holders: 35 } },
          manual_overrides: {},
          notas_maestro: "Seed Selva. Master ajusta."
        }
      },
      {
        name: "Frente Playa San Bartolo Premium — PNC-SB-003",
        location: "San Bartolo, Lima Sur, Perú",
        propertyType: "residential" as const,
        status: "funded" as const,
        totalValuationUsd: "2450000.00",
        tokenPriceUsd: "1350.00",
        totalTokens: "1800.00",
        availableTokens: "1500.00",
        annualYieldExpected: "12.50",
        contractAddress: null,
        isDemo: false,
        metadata: {
          pncCode: "PNC-SB-003",
          hectares: 1.8,
          tipo_predio: "hotel_hospitality",
          socio_partner: "Grupo San Bartolo Partners",
          phase: "Fase15",
          govQuorum: "PASSED",
          pachaPower: 3250,
          net: 105840,
          effectiveYield: 13230,
          effectivePct: "12.5%",
          product_configs: { hotel_revenue_share: { porcentaje_ocupacion_a_holders: 48 }, vivienda_token: { tokens_totales: 1800, precio_token_usd: 1350 } },
          manual_overrides: {},
          notas_maestro: "Seed SB. Override yields."
        }
      },
      {
        name: "Chilca Coastal Development — PNC-CHI-004",
        location: "Chilca, Lima, Perú",
        propertyType: "land" as const,
        status: "trading" as const,
        totalValuationUsd: "1650000.00",
        tokenPriceUsd: "390.00",
        totalTokens: "4200.00",
        availableTokens: "3500.00",
        annualYieldExpected: "8.10",
        contractAddress: null,
        isDemo: false,
        metadata: {
          pncCode: "PNC-CHI-004",
          hectares: 8.5,
          tipo_predio: "mixto_residencial_turistico",
          socio_partner: "Inversionistas Chilca & Fam",
          phase: "Fase15",
          govQuorum: "PASSED",
          pachaPower: 3250,
          net: 68112.5,
          effectiveYield: 31639,
          effectivePct: "17.1%",
          product_configs: { vivienda_token: { tokens_totales: 4200, precio_token_usd: 390 }, alquiler_yield: { porcentaje_renta_a_holders: 50, yield_estimado_anual: 8.1 }, hotel_revenue_share: { porcentaje_ocupacion_a_holders: 30 } },
          manual_overrides: {},
          notas_maestro: "Seed Chilca. Master Lima token."
        }
      },
      {
        name: "Lima Sur Desarrollos Mixtos — PNC-LIM-012",
        location: "Lima Sur, Perú",
        propertyType: "residential" as const,
        status: "coming_soon" as const,
        totalValuationUsd: "4850000.00",
        tokenPriceUsd: "570.00",
        totalTokens: "8500.00",
        availableTokens: "8500.00",
        annualYieldExpected: "6.90",
        contractAddress: null,
        isDemo: false,
        metadata: {
          pncCode: "PNC-LIM-012",
          hectares: 2.2,
          tipo_predio: "vivienda_urbana",
          socio_partner: "Desarrolladora Lima Capital + Fam",
          phase: "Fase15",
          govQuorum: "PASSED",
          pachaPower: 3250,
          net: 68112.5,
          effectiveYield: 31639,
          effectivePct: "17.1%",
          product_configs: { vivienda_token: { tokens_totales: 8500, precio_token_usd: 570 }, alquiler_yield: { porcentaje_renta_a_holders: 62, yield_estimado_anual: 6.9 } },
          manual_overrides: { valor_total_proyecto: { valor: 4900000, razon: "Master manual comps 2026", by: "master_ideador" } },
          notas_maestro: "Seed Lima. Override splits. LIM manual 0.95 in orq."
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
