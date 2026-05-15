export const dynamic = 'force-dynamic';

import { RouteBreadcrumbs, SectionHeader, MissionCard, ErrorState } from "@/components/mission";
import { DataGrid, DataGridRow, DataGridCell, ProductEmptyState, TokenAmount } from "@/components/product/SharedComponents";
import { createClient } from "@supabase/supabase-js";

export default async function AdminTokenOrdersPage() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: orders, error } = await supabaseAdmin
    .from('token_orders')
    .select(`
      id, quantity, total_amount, status, created_at,
      investor:investors!token_orders_investor_id_fkey(email, first_name, last_name)
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching token orders:", error);
    return <ErrorState title="Error de BD" message="No se pudieron cargar las órdenes" />;
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
          description="Supervisión de intentos Genesis simulados."
        />
      </div>

      <MissionCard>
        {!orders || orders.length === 0 ? (
          <ProductEmptyState 
            title="Sin Órdenes"
            description="Aún no hay intentos de adquisición registrados."
          />
        ) : (
          <DataGrid headers={["Email Inversor", "Cantidad PACHA", "Total USD", "Status", "Fecha"]}>
            {orders.map((order: any) => (
              <DataGridRow key={order.id}>
                <DataGridCell>{order.investor?.email || "N/A"}</DataGridCell>
                <DataGridCell><TokenAmount amount={order.quantity} /></DataGridCell>
                <DataGridCell><span className="text-pn-success font-medium">${Number(order.total_amount).toLocaleString()}</span></DataGridCell>
                <DataGridCell>
                  <span className={`text-[10px] uppercase px-2 py-1 rounded font-medium ${
                    order.status === 'completed' ? 'bg-pn-success/20 text-pn-success' : 
                    order.status === 'pending' ? 'bg-pn-warning/20 text-pn-warning' : 
                    'bg-pn-danger/20 text-pn-danger'
                  }`}>
                    {order.status}
                  </span>
                </DataGridCell>
                <DataGridCell>{new Date(order.created_at).toLocaleString()}</DataGridCell>
              </DataGridRow>
            ))}
          </DataGrid>
        )}
      </MissionCard>
    </div>
  );
}
