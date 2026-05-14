import { RouteBreadcrumbs, SectionHeader, MissionCard, ErrorState } from "@/components/mission";
import { AdminUsersDataGrid } from "@/components/product/AdminComponents";
import { createClient } from "@supabase/supabase-js";
import { UserAdminView } from "@/types/product";

export default async function AdminUsersPage() {
  const users: UserAdminView[] = [];
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: dbUsers, error } = await supabaseAdmin
      .from('investors')
      .select(`
        id, first_name, last_name, email, role, kyc_status,
        balances (available_tokens, locked_tokens, available_usd, locked_usd)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    for (const u of dbUsers) {
      const balance = u.balances?.[0];
      users.push({
        id: u.id,
        fullName: `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'Usuario',
        email: u.email,
        kycStatus: u.kyc_status as "pending" | "approved" | "rejected",
        isVerified: u.kyc_status === 'approved',
        role: "INVESTOR",
        status: "ACTIVE",
        balance: {
          investorId: u.id,
          availableTokens: balance?.available_tokens?.toString() || "0",
          lockedTokens: balance?.locked_tokens?.toString() || "0",
          availableUsd: balance?.available_usd?.toString() || "0",
          lockedUsd: balance?.locked_usd?.toString() || "0",
          lastUpdated: new Date().toISOString()
        }
      });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return <ErrorState title="Error de BD" message="No se pudo cargar la base de usuarios" />;
  }

  return (
    <div className="space-y-8 pb-24">
      <div>
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Consola Admin", href: "/dashboard/admin" },
          { label: "Usuarios y KYC" }
        ]} className="mb-4" />
        <SectionHeader 
          eyebrow="Identidad y Cumplimiento"
          title="Directorio de Usuarios Demo"
          description="Gestión de KYC simulada e identidades en el Sandbox."
        />
      </div>

      <AdminUsersDataGrid users={users} />
    </div>
  );
}
