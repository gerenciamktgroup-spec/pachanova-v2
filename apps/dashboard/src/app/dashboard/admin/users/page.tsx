import { RouteBreadcrumbs, ErrorState, LoadingState } from "@/components/mission";
import { Suspense } from "react";
import { createServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { UserAdminView } from "@/types/product";
import { AdminUsersDataGrid } from "@/components/product";

export const dynamic = 'force-dynamic';

async function fetchUsersData(): Promise<UserAdminView[]> {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");
    const role = user.app_metadata?.role as string | undefined;
    if (role !== "admin") redirect("/unauthorized"); // Solo Admin Supremo

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: rawInvestors } = await supabaseAdmin
      .from("investors")
      .select(`
        id, first_name, last_name, email, role, kyc_status, is_verified, created_at,
        balances (*),
        kyc_documents!kyc_documents_investor_id_fkey (status)
      `)
      .order("created_at", { ascending: false });

    return (rawInvestors || []).map((inv: any) => {
      const balance = (inv.balances && inv.balances.length > 0) ? inv.balances[0] : null;
      const kycDocs = inv.kyc_documents || [];
      const computedKycStatus = kycDocs.length > 0 ? kycDocs[0].status : (inv.kyc_status || "pending");

      return {
        id: inv.id,
        fullName: `${inv.first_name || ''} ${inv.last_name || ''}`.trim() || "Usuario",
        email: inv.email,
        kycStatus: computedKycStatus as any,
        isVerified: inv.is_verified || false,
        role: (inv.role || "INVESTOR").toUpperCase() as any,
        status: "ACTIVE", 
        balance: {
          investorId: inv.id,
          availableTokens: balance?.available_tokens?.toString() || "0",
          lockedTokens: balance?.locked_tokens?.toString() || "0",
          availableUsd: balance?.available_usd?.toString() || "0",
          lockedUsd: balance?.locked_usd?.toString() || "0",
          lastUpdated: balance?.last_updated_at || new Date().toISOString()
        }
      };
    });
  } catch (error) {
    console.error("Error fetching users for admin:", error);
    return [];
  }
}

async function UsersAdminContent() {
  const users = await fetchUsersData();

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <RouteBreadcrumbs items={[
          { label: "Dashboard", href: "/dashboard/admin" },
          { label: "Consola Admin", href: "/dashboard/admin" },
          { label: "Usuarios y KYC" }
        ]} />
      </div>

      <div className="bg-pn-surface border border-pn-border rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-pn-text">Gestión de Empleados y Clientes</h2>
            <p className="text-sm text-pn-text-soft">
              Administra los accesos de todos los usuarios. Asigna o quita privilegios de administrador, operador o inversor.
            </p>
          </div>
          <button className="bg-pn-gold hover:bg-pn-gold/90 text-black px-4 py-2 rounded font-medium transition-colors">
            Crear Usuario
          </button>
        </div>

        <AdminUsersDataGrid users={users} />
      </div>
    </div>
  );
}

export default function UsersAdminPage() {
  return (
    <Suspense fallback={<LoadingState message="Cargando gestor de usuarios..." />}>
      <UsersAdminContent />
    </Suspense>
  );
}
