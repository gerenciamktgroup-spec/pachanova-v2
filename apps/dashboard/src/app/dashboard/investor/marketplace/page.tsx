export const dynamic = 'force-dynamic';

import { RouteBreadcrumbs, SectionHeader, MissionCard, ErrorState } from "@/components/mission";
import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import { eq } from "drizzle-orm";
import { Suspense } from "react";
import { P2PMarketplaceClient } from "./P2PMarketplaceClient";

// Dummy logged in user for demo purposes
const DEMO_USER_ID = "00000000-0000-0000-0000-000000000123";

async function fetchMarketplaceData() {
  try {
    const orders = await db.query.p2pOrders.findMany({
      where: eq(schema.p2pOrders.status, "open"),
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
    });

    const balance = await db.query.balances.findFirst({
      where: eq(schema.balances.investorId, DEMO_USER_ID),
    });

    const user = await db.query.investors.findFirst({
      where: eq(schema.investors.id, DEMO_USER_ID),
    });

    return { orders, balance, kycStatus: user?.kycStatus || 'pending' };
  } catch (error) {
    console.error("Error fetching P2P data:", error);
    return null;
  }
}

async function MarketplaceContent() {
  const data = await fetchMarketplaceData();

  if (!data) {
    return <ErrorState title="Error" message="No se pudo cargar el mercado P2P." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Panel Inversor", href: "/dashboard/investor" },
          { label: "Mercado P2P Demo" }
        ]} className="mb-4" />
        <SectionHeader 
          title="Mercado P2P Demo"
          description="Compra y vende tokens PACHA simulados con otros usuarios de la red local."
        />
      </div>

      <P2PMarketplaceClient 
        orders={data.orders} 
        balance={data.balance || null} 
        kycStatus={data.kycStatus}
        currentUserId={DEMO_USER_ID}
      />
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div>Cargando mercado...</div>}>
      <MarketplaceContent />
    </Suspense>
  );
}
