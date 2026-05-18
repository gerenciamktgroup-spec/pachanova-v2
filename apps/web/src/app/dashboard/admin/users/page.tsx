export const dynamic = 'force-dynamic';

import { RouteBreadcrumbs } from "@/components/mission/RouteBreadcrumbs";
import { SectionHeader } from "@/components/mission/SectionHeader";
import { MissionCard } from "@/components/mission/MissionCard";
import { ErrorState } from "@/components/mission/StateComponents";
import { AdminUsersDataGrid } from "@/components/product/AdminComponents";
import { createServerClient } from "@/utils/supabase/server";
import { UserAdminView } from "@/types/product";

export default async function AdminUsersPage() {
  const users: UserAdminView[] = [];
  const isDemo = process.env.NEXT_PUBLIC_IS_DEMO === 'true';

  if (isDemo) {
    try {
      const { db } = await import('@/server/db');
      const { investors: dbInvestors, balances: dbBalances } = await import('@pachanova/database');
      const { neq } = await import('drizzle-orm');

      const dbUsers = await db.select().from(dbInvestors).where(neq(dbInvestors.id, '00000000-0000-0000-0000-000000000000'));
      const balancesData = await db.select().from(dbBalances);

      for (const u of dbUsers) {
        const balance = balancesData.find(b => b.investorId === u.id);
        users.push({
          id: u.id,
          fullName: `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Inversor Demo',
          email: u.email,
          kycStatus: u.kycStatus as "pending" | "approved" | "rejected",
          isVerified: u.kycStatus === 'approved',
          role: "INVESTOR",
          status: "ACTIVE",
          balance: {
            investorId: u.id,
            availableTokens: balance?.availableTokens?.toString() || "0",
            lockedTokens: balance?.lockedTokens?.toString() || "0",
            availableUsd: balance?.availableUsd?.toString() || "0",
            lockedUsd: balance?.lockedUsd?.toString() || "0",
            lastUpdated: balance?.lastUpdatedAt?.toISOString() || new Date().toISOString()
          }
        });
      }
    } catch (e) {
      console.error("Local Drizzle fetch admin users failed, using fallback:", e);
    }
  } else {
    try {
      const supabase = await createServerClient();
      
      // Fetch all users except the treasury
      const { data: dbUsers, error: usersError } = await supabase
        .from('investors')
        .select('*')
        .neq('id', '00000000-0000-0000-0000-000000000000');
        
      if (usersError) throw usersError;
      
      const { data: balancesData, error: balancesError } = await supabase
        .from('balances')
        .select('*');
        
      if (balancesError) throw balancesError;
      
      for (const u of (dbUsers || [])) {
        const balance = (balancesData || []).find(b => b.investor_id === u.id);
        users.push({
          id: u.id,
          fullName: `${u.first_name} ${u.last_name}`,
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
            lastUpdated: balance?.last_updated_at || new Date().toISOString()
          }
        });
      }
    } catch (error) {
      return <ErrorState title="Error de BD" message="No se pudo cargar la base de usuarios" />;
    }
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
