export const dynamic = 'force-dynamic';

import { RouteBreadcrumbs, SectionHeader } from "@/components/mission";
import { db } from "@/server/db";
import { DEFAULT_DEMO_INVESTOR, schema } from "@pachanova/database";
import { eq } from "drizzle-orm";
import { Suspense } from "react";
import { P2PMarketplaceClient } from "./P2PMarketplaceClient";

const FALLBACK_P2P_DATA = {
  orders: [
    {
      id: "p2p-order-demo-1",
      sellerInvestorId: "demo-investor-seller-1",
      propertyId: "00000000-0000-0000-0000-000000000001",
      tokenAmount: "250.00",
      unitPriceUsd: "8.40",
      totalUsd: "2100.00",
      status: "open" as const,
      createdAt: new Date().toISOString()
    },
    {
      id: "p2p-order-demo-2",
      sellerInvestorId: "demo-investor-seller-2",
      propertyId: "00000000-0000-0000-0000-000000000002",
      tokenAmount: "100.00",
      unitPriceUsd: "8.50",
      totalUsd: "850.00",
      status: "open" as const,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: "p2p-order-demo-3",
      sellerInvestorId: "demo-investor-seller-3",
      propertyId: "00000000-0000-0000-0000-000000000003",
      tokenAmount: "500.00",
      unitPriceUsd: "8.35",
      totalUsd: "4175.00",
      status: "open" as const,
      createdAt: new Date(Date.now() - 7200000).toISOString()
    }
  ],
  balance: {
    id: "demo-balance-1",
    investorId: "demo-investor-123",
    availableTokens: "1250",
    lockedTokens: "0",
    availableUsd: "5000",
    lockedUsd: "0",
    lastUpdatedAt: new Date()
  },
  userId: "demo-investor-123",
  kycStatus: "approved" as const
};

async function fetchMarketplaceData() {
  try {
    const orders = await db.query.p2pOrders.findMany({
      where: eq(schema.p2pOrders.status, "open"),
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
    });

    const user = await db.query.investors.findFirst({
      where: eq(schema.investors.email, DEFAULT_DEMO_INVESTOR.email),
    });
    if (!user) return FALLBACK_P2P_DATA;

    const balance = await db.query.balances.findFirst({
      where: eq(schema.balances.investorId, user.id),
    });

    return { 
      orders: orders.length > 0 ? orders : FALLBACK_P2P_DATA.orders, 
      balance: balance || FALLBACK_P2P_DATA.balance, 
      userId: user.id, 
      kycStatus: user.kycStatus || "approved" 
    };
  } catch (error) {
    console.warn("DB fetch failed in fetchMarketplaceData, using deterministic fallback:", error);
    return FALLBACK_P2P_DATA;
  }
}

async function MarketplaceContent({ searchParams }: { searchParams?: Promise<{ pnc?: string }> }) {
  const resolvedSearch = searchParams ? await searchParams : {};
  const pncFromQuery = resolvedSearch.pnc || undefined;

  const data = await fetchMarketplaceData();
  const pncLabel = pncFromQuery ? ` • PNC ${pncFromQuery} (from Landbank E2E)` : "";

  return (
    <div className="space-y-6">
      <div>
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Panel Inversor", href: "/dashboard/investor" },
          { label: "Mercado P2P Demo" }
        ]} className="mb-4" />
        <SectionHeader 
          title={`Mercado P2P Demo${pncLabel} • PachaNova Landbanking Full`}
          description="Compra y vende PACHA simulados con usuarios del dataset local. Las órdenes, saldos y trades se persisten en PostgreSQL y se asocian al PNC seleccionado."
        />
      </div>

      <P2PMarketplaceClient 
        orders={data.orders as unknown as Record<string, unknown>[]} 
        balance={data.balance as unknown as Record<string, unknown> | null} 
        kycStatus={data.kycStatus}
        currentUserId={data.userId}
        pncCode={pncFromQuery}
      />
    </div>
  );
}

export default function MarketplacePage({ searchParams }: { searchParams?: Promise<{ pnc?: string }> }) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-pn-text-muted">Cargando mercado P2P...</div>}>
      <MarketplaceContent searchParams={searchParams} />
    </Suspense>
  );
}
