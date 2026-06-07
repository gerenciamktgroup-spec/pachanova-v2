import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { schema } from "@pachanova/database";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const treasury = await db.query.treasury_vaults.findMany({
      with: {
        property: true,
      }
    });

    const escrow = await db.query.escrow_vaults.findMany();
    const burn = await db.query.burn_vaults.findMany();

    // Aggregates
    let totalMintedTokens = 0;
    let totalEscrowedTokens = 0;
    let totalEscrowedUsd = 0;
    let totalBurnedTokens = 0;
    let totalLiquidationUsd = 0;

    const vaultsByProperty: Record<string, any> = {};

    // Group logic
    for (const vault of treasury) {
      if (!vault.propertyId) continue;
      
      const propId = vault.propertyId;
      
      if (!vaultsByProperty[propId]) {
        vaultsByProperty[propId] = {
          property: vault.property,
          treasury: vault,
          escrow: null,
          burn: null,
        };
      } else {
        vaultsByProperty[propId].treasury = vault;
      }

      totalMintedTokens += parseFloat(vault.availableTokens) + parseFloat(vault.lockedTokens);
    }

    for (const esc of escrow) {
      const propId = esc.propertyId;
      if (vaultsByProperty[propId]) {
        vaultsByProperty[propId].escrow = esc;
      }
      totalEscrowedTokens += parseFloat(esc.escrowedTokens);
      totalEscrowedUsd += parseFloat(esc.escrowedUsd);
    }

    for (const b of burn) {
      const propId = b.propertyId;
      if (vaultsByProperty[propId]) {
        vaultsByProperty[propId].burn = b;
      }
      totalBurnedTokens += parseFloat(b.burnedTokens);
      totalLiquidationUsd += parseFloat(b.liquidationUsd);
    }

    return NextResponse.json({
      success: true,
      metrics: {
        totalMintedTokens,
        totalEscrowedTokens,
        totalEscrowedUsd,
        totalBurnedTokens,
        totalLiquidationUsd,
        totalActiveVaults: Object.keys(vaultsByProperty).length
      },
      vaults: Object.values(vaultsByProperty)
    });
  } catch (err: any) {
    console.error("[treasury GET]", err);
    return NextResponse.json(
      { error: err?.message || "Error fetching treasury data" },
      { status: 500 }
    );
  }
}
