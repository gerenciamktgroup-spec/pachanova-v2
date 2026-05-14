import { RouteBreadcrumbs, ErrorState, LoadingState } from "@/components/mission";
import { SafeActionButton } from "@/components/mission/SafeActionButton";
import { 
  AdminMissionOverview, 
  TreasuryMetricsPanel, 
  AdminUsersDataGrid, 
  AuditLogTimeline, 
  IntegrationEventsPanel 
} from "@/components/product";
import { AdminDashboardView, UserAdminView } from "@/types/product";
import { Suspense } from "react";
import { NextStepCard } from "@/components/product/NextStepCard";
import { JourneyProgressRail } from "@/components/product/JourneyProgressRail";
import { adminJourney } from "@/lib/navigation/userJourneys";

async function fetchAdminData(): Promise<{ view: AdminDashboardView, users: UserAdminView[] } | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    
    // Simulate fetching various data.
    // En el futuro esto llamará a /api/admin/users, /api/treasury, etc.
    const view: AdminDashboardView = {
      overview: {
        totalUsers: 1,
        activeUsers: 1,
        totalTokensDistributed: "0",
        systemHealth: "GO"
      },
      treasury: {
        totalUsdRaised: "$0.00",
        totalTokensIssued: "0",
        totalTokensAvailable: "500,000",
        fideicomisoStatus: "PENDING"
      },
      recentAuditLogs: [
        {
          id: "log-1",
          action: "System Initialization",
          details: "Demo Sandbox started and ready.",
          timestamp: new Date().toISOString(),
          actor: "System"
        }
      ],
      recentIntegrationEvents: []
    };

    const users: UserAdminView[] = [
      {
        id: "demo-investor-123",
        fullName: "Inversor Demo",
        email: "investor@pachanova.local",
        kycStatus: "pending",
        isVerified: false,
        role: "INVESTOR",
        status: "ACTIVE",
        balance: {
          investorId: "demo-investor-123",
          availableTokens: "0",
          lockedTokens: "0",
          availableUsd: "0",
          lockedUsd: "0",
          lastUpdated: new Date().toISOString()
        }
      }
    ];

    return { view, users };
  } catch (error) {
    console.error("Error fetching admin view model:", error);
    return null;
  }
}

async function AdminDashboardContent() {
  const data = await fetchAdminData();

  if (!data) {
    return <ErrorState title="Error de carga" message="No se pudo cargar la consola de administración." />;
  }

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Consola Admin" }
        ]} />
        <div className="flex flex-wrap gap-2">
          <SafeActionButton label="Usuarios y KYC" href="/dashboard/admin/users" variant="ghost" />
          <SafeActionButton label="Órdenes Token" href="/dashboard/admin/token-orders" variant="ghost" />
          <SafeActionButton label="Auditoría" href="/dashboard/admin/audit" variant="ghost" />
          <SafeActionButton label="Integraciones" href="/dashboard/admin/integrations" variant="ghost" />
        </div>
      </div>

      <JourneyProgressRail journey={adminJourney} currentStepId="a1" />

      <NextStepCard 
        dataTestId="next-step-card-admin"
        contextLabel="Consola Admin"
        title="Control operativo"
        explanation="Inversores activos son cuentas con al menos 1 token y KYC aprobado. Los tokens emitidos no pueden aumentarse sin aprobación del fideicomiso. Las alertas de auditoría muestran discrepancias entre balance de tokens en BD y registros del fideicomiso."
        nextStep="Revisá el módulo 'Usuarios y KYC' para interactuar con la revisión de inversores."
        primaryAction={{ label: "Ir a Usuarios y KYC", href: "/dashboard/admin/users", intent: "navigate" }}
        secondaryAction={{ label: "Ver Auditoría", href: "/dashboard/admin/audit", intent: "navigate" }}
        status="GO"
      />
      <AdminMissionOverview view={data.view} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <TreasuryMetricsPanel view={data.view} />
          <AdminUsersDataGrid users={data.users} />
        </div>
        
        <div className="space-y-8">
          <AuditLogTimeline view={data.view} />
          <IntegrationEventsPanel view={data.view} />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<LoadingState message="Cargando panel de control de administrador..." />}>
      <AdminDashboardContent />
    </Suspense>
  );
}
