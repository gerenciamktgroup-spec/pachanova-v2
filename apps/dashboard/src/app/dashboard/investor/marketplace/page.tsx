import { RouteBreadcrumbs, ErrorState, LoadingState } from "@/components/mission";
import { HologramPncCard } from "@/components/product/HologramPncCard";
import { eq, and } from "drizzle-orm";
import { schema } from "@pachanova/database";
import { P2PMarketplaceClient } from "./P2PMarketplaceClient";
import { Suspense } from "react";
import { db } from "@/server/db";
import { createServerClient } from "@/utils/supabase/server";
import InvestorMarketplaceClient from "./InvestorMarketplaceClient";

export const dynamic = 'force-dynamic';

async function fetchMarketplaceData() {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const userEmail = user?.email || "investor@pachanova.local";

    // Fetch current investor - using db singleton
    const investor = await db.query.investors.findFirst({
      where: eq(schema.investors.email, userEmail)
    });

    if (!investor) {
      return { error: "Perfil de inversor no encontrado. Inicie sesión para operar." };
    }

    // Fetch open P2P orders - Fase2: tied to landbank 5PNC properties (Master launches feed liquidity, real orq data)
    const orders = await db.query.p2pOrders.findMany({
      where: eq(schema.p2pOrders.status, 'open'),
      orderBy: (o, { desc }) => [desc(o.createdAt)]
    });

    // Enrich orders with landbank 5PNC for full project view (rich demo with orq numbers)
    const landbankProperties = await db.query.properties.findMany({
      where: (p, { like }) => like(p.name, 'PNC-%')
    });
    const enrichedOrders = orders.map(o => {
      const pnc = landbankProperties.find(p => p.id === o.propertyId) || landbankProperties[0];
      return {
        ...o,
        pncCode: pnc?.metadata?.pncCode || '5PNC',
        net: pnc?.metadata?.net || 68112.5,
      };
    });

    // Fetch investor balance for the first available property
    const property = await db.query.properties.findFirst();
    let balance = null;
    if (property) {
      balance = await db.query.balances.findFirst({
        where: and(
          eq(schema.balances.investorId, investor.id),
          eq(schema.balances.propertyId, property.id)
        )
      });
    }

    return {
      investor,
      orders: enrichedOrders.map(o => ({
        id: o.id,
        sellerInvestorId: o.sellerInvestorId,
        propertyId: o.propertyId,
        quantity: parseFloat(o.quantity),
        pricePerToken: parseFloat(o.pricePerToken),
        totalAmount: parseFloat(o.totalAmount),
        status: o.status,
        createdAt: o.createdAt,
        pncCode: o.pncCode,
        net: o.net
      })),
      balance: balance ? {
        availableTokens: parseFloat(balance.availableTokens),
        availableUsd: parseFloat(balance.availableUsd)
      } : null
    };

  } catch (e: any) {
    console.error('[P2P FETCH ERROR]:', e);
    return { error: e.message || 'Error fetching P2P data' };
  }
}

async function P2PMarketplaceContent({ initialPnc }: { initialPnc?: string }) {
  const data = await fetchMarketplaceData();

  if (data.error) {
    return <ErrorState title="Error del Mercado Secundario" message={data.error} />;
  }

  const { investor, orders, balance } = data;

  // MACRO-FASE 141: real holograms for P2P marketplace section using shared helper
  const realP2PHolos = await (await import('../../../../server/db')).getRealHologramPncs(3);

  return (
    <div className="space-y-8">
      <RouteBreadcrumbs items={[
        { label: 'Inversor' }, 
        { label: 'Marketplace' }
      ]} />

      {/* Full Project - P2P is part of entire PachaNova Landbanking + tools (user clarification) */}
      <div className="text-xs uppercase tracking-[2px] text-[#c5a46d]/70 border-b border-[#c5a46d]/20 pb-1 mb-2">P2P ON LANDBANK 5PNC — FULL PACHA NOVA PROJECT (MASTER LAUNCHES → P2P LIQUIDITY + CREDITS + ORQ + AUTONOMY + YIELDS + GOV)</div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mb-4">
        {/* MACRO-FASE 141: real DB holograms for P2P section */}
        {(realP2PHolos || []).map((pnc: any, i: number) => <HologramPncCard key={i} pnc={pnc as any} compact />)}
      </div>
      <div className="text-[9px] text-white/50 -mt-2 mb-4"><a href="#ver-avances" className="text-emerald-400">VER TODOS LOS AVANCES → Fase1 Consolidation + Fase4 Visuals (Hologram expansion to yields/gov/hero/admin/market)</a></div>

      {/* Land Banking Marketplace Section */}
      <div className="bg-[#0a111f] rounded-2xl border border-white/10 p-6 md:p-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white mb-1">🌎 Land Banking — Activos RWA</h2>
            <p className="text-sm text-white/50">Activos inmobiliarios tokenizados disponibles para inversión en primario y mercado secundario.</p>
          </div>
        </div>
        <Suspense fallback={<LoadingState message="Cargando activos..." />}>
          <InvestorMarketplaceClient />
        </Suspense>
      </div>

      {/* P2P Secondary Market */}
      <div className="bg-[#0a111f] min-h-[50vh] text-white rounded-2xl border border-white/10 p-6 md:p-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white mb-1">Mercado Secundario (OTC / P2P)</h2>
            <p className="text-sm text-white/50">Liquidez instantánea. Compra y vende tus fracciones PACHA con otros inversores de la red de forma atómica.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#0f172a] p-5 rounded-xl border border-blue-500/20">
            <h3 className="text-[10px] uppercase tracking-wider text-white/50 mb-1">Tu Saldo Disponible</h3>
            <div className="text-2xl font-semibold text-blue-400">${balance?.availableUsd?.toLocaleString() || '0.00'} USD</div>
          </div>
          <div className="bg-[#0f172a] p-5 rounded-xl border border-white/10">
            <h3 className="text-[10px] uppercase tracking-wider text-white/50 mb-1">Órdenes Activas</h3>
            <div className="text-2xl font-semibold text-white">{orders.length}</div>
          </div>
          <div className="bg-[#0f172a] p-5 rounded-xl border border-white/10">
            <h3 className="text-[10px] uppercase tracking-wider text-white/50 mb-1">Spread Promedio</h3>
            <div className="text-2xl font-semibold text-white">0.8%</div>
          </div>
        </div>

        <P2PMarketplaceClient
          orders={orders}
          balance={balance}
          kycStatus={investor.kycStatus}
          currentUserId={investor.id}
          initialPnc={initialPnc}
        />

        <div className="mt-8 text-center">
          <p className="text-[10px] text-white/30">
            * El mercado secundario está operado mediante lógica transaccional de base de datos local y Smart Contracts simulados. Las liquidaciones son instantáneas y de tipo entrega contra pago (DVP).
          </p>
        </div>
      </div>
    </div>
  );
}

export default async function P2PMarketplacePage({ searchParams }: { searchParams?: Promise<{ pnc?: string }> }) {
  const params = searchParams ? await searchParams : undefined;
  return (
    <Suspense fallback={<LoadingState message="Cargando Marketplace..." />}>
      <P2PMarketplaceContent initialPnc={params?.pnc} />
    </Suspense>
  );
}
