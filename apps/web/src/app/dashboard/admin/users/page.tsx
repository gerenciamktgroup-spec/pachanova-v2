export const dynamic = 'force-dynamic';

import { RouteBreadcrumbs, SectionHeader } from "@/components/mission";
import { AdminUsersDataGrid } from "@/components/product/AdminComponents";
import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import { eq } from "drizzle-orm";
import { UserAdminView } from "@/types/product";

const FALLBACK_USERS: UserAdminView[] = [
  {
    id: "demo-investor-holder",
    fullName: "Inversor Principal (Holder)",
    email: "demo.investor.holder@pachanova.local",
    kycStatus: "approved",
    isVerified: true,
    role: "INVESTOR",
    status: "ACTIVE",
    balance: {
      investorId: "demo-investor-holder",
      availableTokens: "1,250",
      lockedTokens: "0",
      availableUsd: "5,000",
      lockedUsd: "0",
      lastUpdated: new Date().toISOString()
    }
  },
  {
    id: "demo-investor-approved",
    fullName: "Inversor Aprobado (Sandbox)",
    email: "demo.investor.approved@pachanova.local",
    kycStatus: "approved",
    isVerified: true,
    role: "INVESTOR",
    status: "ACTIVE",
    balance: {
      investorId: "demo-investor-approved",
      availableTokens: "500",
      lockedTokens: "0",
      availableUsd: "2,500",
      lockedUsd: "0",
      lastUpdated: new Date().toISOString()
    }
  },
  {
    id: "demo-investor-pending",
    fullName: "Inversor Pendiente KYC",
    email: "demo.investor.pending@pachanova.local",
    kycStatus: "pending",
    isVerified: false,
    role: "INVESTOR",
    status: "ACTIVE",
    balance: {
      investorId: "demo-investor-pending",
      availableTokens: "0",
      lockedTokens: "0",
      availableUsd: "1,000",
      lockedUsd: "0",
      lastUpdated: new Date().toISOString()
    }
  }
];

export default async function AdminUsersPage() {
  let users: UserAdminView[] = [];
  try {
    const dbUsers = await db.query.investors.findMany();
    for (const u of dbUsers) {
      const balance = await db.query.balances.findFirst({
        where: eq(schema.balances.investorId, u.id)
      });
      users.push({
        id: u.id,
        fullName: `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Usuario',
        email: u.email,
        kycStatus: (u.kycStatus || 'pending') as "pending" | "approved" | "rejected",
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
    console.warn("Error fetching users, using fallback:", error);
    users = FALLBACK_USERS;
  }

  if (users.length === 0) {
    users = FALLBACK_USERS;
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
