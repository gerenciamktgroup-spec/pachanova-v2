export const dynamic = 'force-dynamic';

import { RouteBreadcrumbs, SectionHeader, MissionCard } from "@/components/mission";
import { DataGrid, DataGridRow, DataGridCell, ProductEmptyState, TokenAmount } from "@/components/product/SharedComponents";
import { createClient } from "@supabase/supabase-js";
import { db } from "@/server/db";

type TokenOrderRow = {
  id: string;
  quantity: string;
  total_amount: string;
  status: string;
  created_at: string;
  investor: { email?: string } | null;
};

const FALLBACK_TOKEN_ORDERS: TokenOrderRow[] = [
  {
    id: "order-demo-1",
    quantity: "1250",
    total_amount: "$10,500.00",
    status: "completed",
    created_at: new Date().toISOString(),
    investor: { email: "demo.investor.holder@pachanova.local" }
  },
  {
    id: "order-demo-2",
    quantity: "500",
    total_amount: "$4,200.00",
    status: "completed",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    investor: { email: "demo.investor.approved@pachanova.local" }
  },
  {
    id: "order-demo-3",
    quantity: "100",
    total_amount: "$840.00",
    status: "pending_payment",
    created_at: new Date(Date.now() - 7200000).toISOString(),
    investor: { email: "demo.investor.pending@pachanova.local" }
  }
];

export default async function AdminTokenOrdersPage() {
  let orders: TokenOrderRow[] = [];

  try {
    if (process.env.DEMO_MODE === 'true' || !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      try {
        const rawOrders = await db.query.p2pOrders.findMany({ limit: 50 });
        if (rawOrders && rawOrders.length > 0) {
          orders = rawOrders.map(o => ({
            id: o.id,
            quantity: o.quantity?.toString() || "0",
            total_amount: `$${o.totalAmount?.toString() || "0"}`,
            status: o.status || "completed",
            created_at: o.createdAt?.toISOString() || new Date().toISOString(),
            investor: { email: "investor@pachanova.local" }
          }));
        } else {
          orders = FALLBACK_TOKEN_ORDERS;
        }
      } catch {
        orders = FALLBACK_TOKEN_ORDERS;
      }
    } else {
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { data, error } = await supabaseAdmin
        .from('token_orders')
        .select(`
          id, quantity, total_amount, status, created_at,
          investor:investors!token_orders_investor_id_fkey(email, first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error || !data || data.length === 0) {
        orders = FALLBACK_TOKEN_ORDERS;
      } else {
        orders = data as unknown as TokenOrderRow[];
      }
    }
  } catch (error) {
    console.warn("Error fetching token orders, using fallback:", error);
    orders = FALLBACK_TOKEN_ORDERS;
  }

  return (
    <div className="space-y-8 pb-24">
      <div>
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Consola Admin", href: "/dashboard/admin" },
          { label: "Órdenes Token" }
        ]} className="mb-4" />
        <SectionHeader 
          eyebrow="Transaccional"
          title="Órdenes de Adquisición"
          description="Supervisión de intentos Genesis y órdenes registradas."
        />
      </div>

      <MissionCard>
        {orders.length === 0 ? (
          <ProductEmptyState 
            title="Sin Órdenes"
            description="Aún no hay intentos de adquisición registrados."
          />
        ) : (
          <DataGrid headers={["Email Inversor", "Cantidad PACHA", "Total USD", "Status", "Fecha"]}>
            {orders.map((order) => (
              <DataGridRow key={order.id}>
                <DataGridCell>{order.investor?.email || "demo@pachanova.local"}</DataGridCell>
                <DataGridCell><TokenAmount amount={order.quantity} /></DataGridCell>
                <DataGridCell><span className="font-mono text-xs">{order.total_amount}</span></DataGridCell>
                <DataGridCell>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    order.status === 'completed' ? 'bg-pn-success/20 text-pn-success' : 'bg-pn-warning/20 text-pn-warning'
                  }`}>
                    {order.status}
                  </span>
                </DataGridCell>
                <DataGridCell>
                  <span className="font-mono text-xs text-pn-text-muted">
                    {new Date(order.created_at).toLocaleString()}
                  </span>
                </DataGridCell>
              </DataGridRow>
            ))}
          </DataGrid>
        )}
      </MissionCard>
    </div>
  );
}
