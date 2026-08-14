export const dynamic = 'force-dynamic';

import { RouteBreadcrumbs, SectionHeader, ErrorState } from "@/components/mission";
import { db } from "@/server/db";
import { DEFAULT_DEMO_INVESTOR, schema } from "@pachanova/database";
import { eq } from "drizzle-orm";
import { Suspense } from "react";
import { P2PMarketplaceClient } from "./P2PMarketplaceClient";

async function fetchMarketplaceData() {
  try {
    const orders = await db.query.p2pOrders.findMany({
      where: eq(schema.p2pOrders.status, "open"),
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
    });

    const user = await db.query.investors.findFirst({
      where: eq(schema.investors.email, DEFAULT_DEMO_INVESTOR.email),
    });
    if (!user) return null;

    const balance = await db.query.balances.findFirst({
      where: eq(schema.balances.investorId, user.id),
    });

    return { orders, balance, userId: user.id, kycStatus: user.kycStatus };
  } catch (error) {
    console.error("Error fetching P2P data:", error);
    return null;
  }
}

async function MarketplaceContent({ searchParams }: { searchParams?: Promise<{ pnc?: string }> }) {
  const resolvedSearch = searchParams ? await searchParams : {};
  const pncFromQuery = resolvedSearch.pnc || undefined;

  const data = await fetchMarketplaceData();

  if (!data) {
    return <ErrorState title="Mercado no disponible" message="No se pudo cargar el mercado P2P. Verifica PostgreSQL y reconstruye el dataset demo." />;
  }

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
        orders={data.orders} 
        balance={data.balance || null} 
        kycStatus={data.kycStatus}
        currentUserId={data.userId}
        pncCode={pncFromQuery}
      />
    </div>
  );
}

export default function MarketplacePage({ searchParams }: { searchParams?: Promise<{ pnc?: string }> }) {
  return (
    <Suspense fallback={<div>Cargando mercado...</div>}>
      <MarketplaceContent searchParams={searchParams} />
    </Suspense>
  );
}
