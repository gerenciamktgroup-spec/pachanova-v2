export const dynamic = 'force-dynamic';

import { RouteBreadcrumbs } from "@/components/mission/RouteBreadcrumbs";
import { SectionHeader } from "@/components/mission/SectionHeader";
import { ErrorState } from "@/components/mission/StateComponents";
import { Suspense } from "react";
import { P2PMarketplaceClient } from "./P2PMarketplaceClient";
import { createServerClient } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { requireRole } from "@/utils/auth/requireRole";

async function MarketplaceContent() {
  await requireRole(["investor"]);
  const authClient = await createServerClient();
  const { data: { user } } = await authClient.auth.getUser();

  if (!user) redirect("/login");

  // Use Service Role to bypass RLS since GoTrue users were recreated and auth.uid() mismatches
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: investor } = await supabase
    .from("investors")
    .select("id, kyc_status, first_name, last_name")
    .eq("supabase_auth_id", user.id)
    .single();

  if (!investor) {
    return <ErrorState title="Error" message={`No se pudo cargar el perfil de inversor para ${user.email}.`} />;
  }

  // Get KYC from documents or fallback
  const { data: kycDocs } = await supabase
    .from("kyc_documents")
    .select("status")
    .eq("investor_id", investor.id)
    .order("created_at", { ascending: false })
    .limit(1);
  const kycStatus = kycDocs && kycDocs.length > 0 ? kycDocs[0].status : (investor.kyc_status || "pending");

  // Get balances
  const { data: balance } = await supabase
    .from("balances")
    .select("available_usd, available_tokens")
    .eq("investor_id", investor.id)
    .single();

  // Get open orders not belonging to user
  const { data: openOrders } = await supabase
    .from("p2p_orders")
    .select(`
      *,
      investor:investors!p2p_orders_seller_investor_id_fkey(first_name, last_name),
      property:properties(name)
    `)
    .eq("status", "open")
    .neq("seller_investor_id", investor.id)
    .order("created_at", { ascending: false });

  const mappedOrders = openOrders?.map(order => ({
    ...order,
    investor: {
      full_name: `${order.investor?.first_name || ''} ${order.investor?.last_name || ''}`.trim() || 'Usuario'
    }
  }));

  // Get user's own active orders
  const { data: myOrders } = await supabase
    .from("p2p_orders")
    .select(`*, property:properties(name)`)
    .eq("seller_investor_id", investor.id)
    .eq("status", "open")
    .order("created_at", { ascending: false });

  // Get first property for selling
  const { data: property } = await supabase.from("properties").select("id").limit(1).single();

  return (
    <div className="space-y-6">
      <div>
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Panel Inversor", href: "/dashboard/investor" },
          { label: "Mercado Secundario (P2P)" }
        ]} className="mb-4" />
        <SectionHeader 
          title="Mercado Secundario P2P"
          description="Compra y vende tokens PACHA directamente con otros miembros de la red."
        />
      </div>

      <P2PMarketplaceClient 
        availableOrders={mappedOrders || []}
        myOrders={myOrders || []}
        balance={balance}
        kycStatus={kycStatus}
        currentUserId={investor.id}
        propertyId={property?.id || "00000000-0000-0000-0000-000000000000"}
      />
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-pn-text-muted">Cargando mercado...</div>}>
      <MarketplaceContent />
    </Suspense>
  );
}
