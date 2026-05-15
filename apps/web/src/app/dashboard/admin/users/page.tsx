export const dynamic = 'force-dynamic';

import { RouteBreadcrumbs, SectionHeader, MissionCard, ErrorState } from "@/components/mission";
import { AdminUsersDataGrid } from "@/components/product/AdminComponents";
import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import { eq } from "drizzle-orm";
import { UserAdminView } from "@/types/product";

export default async function AdminUsersPage() {
  const users: UserAdminView[] = [];
  try {
    const dbUsers = await db.query.investors.findMany();
    for (const u of dbUsers) {
      const balance = await db.query.balances.findFirst({
        where: eq(schema.balances.investorId, u.id)
      });
      users.push({
        id: u.id,
        fullName: `${u.firstName} ${u.lastName}`,
        email: u.email,
        kycStatus: u.kycStatus as "pending" | "approved" | "rejected",
        isVerified: u.kycStatus === 'approved',
        role: "INVESTOR",
        status: "ACTIVE",
        balance: {
          investorId: u.id,
          availableTokens: balance?.availableTokens || "0",
          lockedTokens: balance?.lockedTokens || "0",
          availableUsd: balance?.availableUsd || "0",
          lockedUsd: balance?.lockedUsd || "0",
          lastUpdated: new Date().toISOString()
        }
      });
    }
  } catch (error) {
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
