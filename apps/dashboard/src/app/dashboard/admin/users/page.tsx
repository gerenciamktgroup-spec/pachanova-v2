export const dynamic = 'force-dynamic';

import { RouteBreadcrumbs, SectionHeader, ErrorState } from "@/components/mission";
import { AdminUsersDataGrid } from "@/components/product/AdminComponents";
import { createClient } from "@supabase/supabase-js";
import { UserAdminView } from "@/types/product";
import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import { requireRole } from "@/utils/auth/requireRole";

async function fetchUsersDemo(): Promise<UserAdminView[]> {
  const investors = await db.query.investors.findMany({ limit: 100 });
  const balances = await db.query.balances.findMany();
  const balanceMap = new Map(balances.map(b => [b.investorId, b]));

  return investors.map(inv => {
    const balance = balanceMap.get(inv.id);
    return {
      id: inv.id,
      fullName: `${inv.firstName || ''} ${inv.lastName || ''}`.trim() || 'Usuario',
      email: inv.email,
      kycStatus: (inv.kycStatus || 'pending') as "pending" | "approved" | "rejected",
      isVerified: inv.isVerified || false,
      role: ((inv.role as string | undefined) || "INVESTOR").toUpperCase() as any,
      status: "ACTIVE",
      balance: {
        investorId: inv.id,
        availableTokens: balance?.availableTokens?.toString() || "0",
        lockedTokens: balance?.lockedTokens?.toString() || "0",
        availableUsd: balance?.availableUsd?.toString() || "0",
        lockedUsd: "0",
        lastUpdated: balance?.lastUpdatedAt?.toISOString() || new Date().toISOString()
      }
    };
  });
}

export default async function AdminUsersPage() {
  await requireRole(["admin", "operator"]);

  let users: UserAdminView[] = [];
  try {
    if (process.env.DEMO_MODE === 'true') {
      users = await fetchUsersDemo();
    } else {
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      const { data: dbUsers, error } = await supabaseAdmin
        .from('investors')
        .select(`id, first_name, last_name, email, role, kyc_status,
          balances (available_tokens, locked_tokens, available_usd, locked_usd)`)
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
          title="Directorio de Usuarios"
          description={process.env.DEMO_MODE === 'true' ? "Gestión de KYC en entorno Sandbox (Drizzle ORM directo)." : "Gestión de KYC de inversores reales (Supabase)."}
        />
      </div>
      <AdminUsersDataGrid users={users} />
    </div>
  );
}
