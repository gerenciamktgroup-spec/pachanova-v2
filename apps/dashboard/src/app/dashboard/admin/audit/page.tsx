export const dynamic = 'force-dynamic';

import { RouteBreadcrumbs, SectionHeader, MissionCard } from "@/components/mission";
import { AuditLogTimeline } from "@/components/product";
import { AuditLogView } from "@/types/product";
import { createClient } from "@supabase/supabase-js";


async function fetchAuditLogs(): Promise<AuditLogView[]> {
  let logs: any[] = [];
  let fetchFailed = false;

  if (process.env.DEMO_MODE !== 'true' && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      
      const { data, error } = await supabaseAdmin
        .from("audit_logs")
        .select("id, action, details, timestamp, user_id")
        .order("timestamp", { ascending: false })
        .limit(100);

      if (error) throw error;
      logs = data || [];
    } catch (err) {
      console.warn("Supabase fetch failed on audit logs page, falling back to local DB", err);
      fetchFailed = true;
    }
  } else {
    fetchFailed = true;
  }

  if (fetchFailed) {
    try {
      const client = postgres(process.env.DATABASE_URL!);
      const rawAuditLogs = await client`
        SELECT id, action, details, timestamp, user_id
        FROM audit_logs
        ORDER BY timestamp DESC
        LIMIT 100
      `;
      logs = rawAuditLogs || [];
      } catch (dbErr) {
      console.warn("Local DB fetch failed for audit logs, using mocks", dbErr);
      logs = [
        {
          id: "1",
          action: "SIMULATED_AUDIT",
          details: "Offline mode fallback enabled.",
          timestamp: new Date().toISOString(),
          user_id: "system"
        }
      ];
    }
  }

  return logs.map((log: any) => ({
    id: log.id,
    action: log.action ?? "UNKNOWN",
    details: typeof log.details === "string"
      ? log.details
      : JSON.stringify(log.details ?? {}),
    timestamp: log.timestamp,
    actor: log.user_id ? `User:${log.user_id}` : "System",
  }));
}

export default async function AdminAuditPage() {
  const logs = await fetchAuditLogs();
  const view = { recentAuditLogs: logs } as any;

  return (
    <div className="space-y-8 pb-24">
      <div>
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Consola Admin", href: "/dashboard/admin" },
          { label: "Auditoría" }
        ]} className="mb-4" />
        <SectionHeader 
          eyebrow="Seguridad"
          title="Logs de Auditoría"
          description="Registro inmutable de eventos del sistema y mutaciones simuladas."
        />
      </div>

      <MissionCard>
        <AuditLogTimeline view={view} />
      </MissionCard>
    </div>
  );
}

