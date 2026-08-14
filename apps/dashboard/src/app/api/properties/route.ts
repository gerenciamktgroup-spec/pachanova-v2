import { NextResponse } from "next/server";
import { db } from "@/server/db";

export const dynamic = "force-dynamic";

const FALLBACK_PROPERTIES = [
  {
    id: "pnc-par",
    code: "PAR",
    label: "Parcelas Agro-Residenciales",
    fase: 16,
    product_config: "PAR",
    net: 68112.5,
    eff: 54280,
    power: 9.4,
    sqm: 14250,
    yieldPct: 8.70,
    claim: 23125,
    orq: "SYNC",
    masterNote: "Referencia Master/ORQ: base net 68112.5",
    color: "#7A9A7E",
    status: "trading",
    totalValuationUsd: "4200000.00",
    tokenPriceUsd: "8.40",
    totalTokens: 500000,
    availableTokens: 500000,
    annualYieldExpected: 8.70
  },
  {
    id: "pnc-viv",
    code: "VIV",
    label: "Vivienda San Bartolo",
    fase: 21,
    product_config: "Vivienda",
    net: 31639,
    eff: 31639,
    power: 17.1,
    sqm: 6800,
    yieldPct: 17.10,
    claim: 8450,
    orq: "LIVE",
    color: "#C9A77B",
    status: "trading",
    totalValuationUsd: "265767.60",
    tokenPriceUsd: "8.40",
    totalTokens: 31639,
    availableTokens: 31639,
    annualYieldExpected: 17.10
  },
  {
    id: "pnc-yld",
    code: "YLD",
    label: "Alquiler Yield Estate",
    fase: 49,
    product_config: "Alquiler_Yield",
    net: 28900,
    eff: 23125,
    power: 14.2,
    sqm: 5200,
    yieldPct: 14.80,
    claim: 23125,
    orq: "ORQ",
    masterNote: "Master override: +2.1pp effective yield applied",
    color: "#4B8FF0",
    status: "trading",
    totalValuationUsd: "346800.00",
    tokenPriceUsd: "12.00",
    totalTokens: 28900,
    availableTokens: 28900,
    annualYieldExpected: 14.80
  },
  {
    id: "pnc-htl",
    code: "HTL",
    label: "Hotel Boutique Fase",
    fase: 50,
    product_config: "Hotel",
    net: 18850,
    eff: 17210,
    power: 11.8,
    sqm: 3100,
    yieldPct: 22.40,
    claim: 6100,
    orq: "SYNC",
    color: "#B46A4C",
    status: "coming_soon",
    totalValuationUsd: "226200.00",
    tokenPriceUsd: "12.00",
    totalTokens: 18850,
    availableTokens: 18850,
    annualYieldExpected: 22.40
  },
  {
    id: "pnc-mix",
    code: "MIX",
    label: "Mixed-Use Cross",
    fase: 51,
    product_config: "PAR",
    net: 3250,
    eff: 2980,
    power: 6.5,
    sqm: 980,
    yieldPct: 7.90,
    claim: 1120,
    orq: "LIVE",
    masterNote: "Master notes: cross-PNC attribution + flywheel live",
    color: "#D8C3A5",
    status: "trading",
    totalValuationUsd: "27300.00",
    tokenPriceUsd: "8.40",
    totalTokens: 3250,
    availableTokens: 3250,
    annualYieldExpected: 7.90
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
