import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { schema } from "@pachanova/database";

export const dynamic = "force-dynamic";

const FALLBACK_PROPERTIES = [
  {
    id: "pnc-par",
    name: "Parcelas Agro-Residenciales",
    location: "Lima, Peru",
    status: "trading",
    totalValuationUsd: "4200000.00",
    tokenPriceUsd: "8.40",
    totalTokens: "500000.00",
    availableTokens: "500000.00",
    annualYieldExpected: "8.70",
    metadata: { code: "PAR", color: "#7A9A7E", fase: 16, product_config: "PAR", net: 68112.5, eff: 54280, power: 9.4, sqm: 14250, claim: 23125, orq: "SYNC", masterNote: "Master: orq real inject 68112.5 base net" }
  },
  {
    id: "pnc-viv",
    name: "Vivienda San Bartolo",
    location: "San Bartolo, Peru",
    status: "trading",
    totalValuationUsd: "265767.60",
    tokenPriceUsd: "8.40",
    totalTokens: "31639.00",
    availableTokens: "31639.00",
    annualYieldExpected: "17.10",
    metadata: { code: "VIV", color: "#C9A77B", fase: 21, product_config: "Vivienda", net: 31639, eff: 31639, power: 17.1, sqm: 6800, claim: 8450, orq: "LIVE" }
  },
  {
    id: "pnc-yld",
    name: "Alquiler Yield Estate",
    location: "San Bartolo, Peru",
    status: "trading",
    totalValuationUsd: "346800.00",
    tokenPriceUsd: "12.00",
    totalTokens: "28900.00",
    availableTokens: "28900.00",
    annualYieldExpected: "14.80",
    metadata: { code: "YLD", color: "#4B8FF0", fase: 49, product_config: "Alquiler_Yield", net: 28900, eff: 23125, power: 14.2, sqm: 5200, claim: 23125, orq: "ORQ", masterNote: "Master override: +2.1pp effective yield applied" }
  },
  {
    id: "pnc-htl",
    name: "Hotel Boutique Fase",
    location: "San Bartolo, Peru",
    status: "coming_soon",
    totalValuationUsd: "226200.00",
    tokenPriceUsd: "12.00",
    totalTokens: "18850.00",
    availableTokens: "18850.00",
    annualYieldExpected: "22.40",
    metadata: { code: "HTL", color: "#B46A4C", fase: 50, product_config: "Hotel", net: 18850, eff: 17210, power: 11.8, sqm: 3100, claim: 6100, orq: "SYNC" }
  },
  {
    id: "pnc-mix",
    name: "Mixed-Use Cross",
    location: "Lima, Peru",
    status: "trading",
    totalValuationUsd: "27300.00",
    tokenPriceUsd: "8.40",
    totalTokens: "3250.00",
    availableTokens: "3250.00",
    annualYieldExpected: "7.90",
    metadata: { code: "MIX", color: "#D8C3A5", fase: 51, product_config: "PAR", net: 3250, eff: 2980, power: 6.5, sqm: 980, claim: 1120, orq: "LIVE", masterNote: "Master notes: cross-PNC attribution + flywheel live" }
  }
];

export async function GET() {
  try {
    const list = await db.query.properties.findMany({
      where: (fields, { eq }) => eq(fields.isDemo, true)
    });

    if (list.length === 0) {
      return NextResponse.json({ success: true, properties: FALLBACK_PROPERTIES });
    }

    // Map DB structure to matches
    const mapped = list.map(item => {
      const meta = typeof item.metadata === "string" ? JSON.parse(item.metadata) : (item.metadata || {});
      return {
        id: item.id,
        code: meta.code || "PNC",
        label: item.name,
        fase: meta.fase || 1,
        product_config: meta.product_config || "Vivienda",
        net: meta.net || Number(item.totalTokens),
        eff: meta.eff || Number(item.availableTokens),
        power: meta.power || Number(item.annualYieldExpected || 0),
        sqm: meta.sqm || 1000,
        yieldPct: Number(item.annualYieldExpected || 0),
        claim: meta.claim || 0,
        orq: meta.orq || "SYNC",
        masterNote: meta.masterNote,
        color: meta.color,
        status: item.status,
        totalValuationUsd: item.totalValuationUsd,
        tokenPriceUsd: item.tokenPriceUsd,
        totalTokens: Number(item.totalTokens),
        availableTokens: Number(item.availableTokens),
        annualYieldExpected: Number(item.annualYieldExpected || 0)
      };
    });

    return NextResponse.json({ success: true, properties: mapped });
  } catch (err) {
    console.warn("DB query failed inside GET /api/properties. Using fallbacks:", err);
    return NextResponse.json({ success: true, properties: FALLBACK_PROPERTIES });
  }
}
