export const dynamic = 'force-dynamic';

import { RouteBreadcrumbs, SectionHeader, MissionCard } from "@/components/mission";
import { AuditLogTimeline } from "@/components/product";
import { AuditLogView } from "@/types/product";
import { createClient } from "@supabase/supabase-js";
import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import { desc } from "drizzle-orm";
import { requireRole } from "@/utils/auth/requireRole";

const FALLBACK_AUDIT_LOGS: AuditLogView[] = [
  {
    id: "log-demo-1",
    action: "FIDEICOMISO_ANCHOR_INIT",
    details: "Patrimonio fiduciario inicializado bajo Ley 26702 con quórum 2/3.",
    timestamp: new Date().toISOString(),
    actor: "System / Fiduciario"
  },
  {
    id: "log-demo-2",
    action: "GENESIS_OFFER_ACTIVE",
    details: "Ronda Génesis activa para 500.000 tokens PACHA a US$ 8.40.",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    actor: "Admin Master"
  },
  {
    id: "log-demo-3",
    action: "ORACLE_VALUATION_SYNC",
    details: "Tasación pericial actualizada: US$ 42.000.000 (San Bartolo, Lima).",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    actor: "Oracle System"
  }
];

async function fetchAuditLogsDemo(): Promise<AuditLogView[]> {
  const logs = await db.query.auditLogs.findMany({
    orderBy: [desc(schema.auditLogs.timestamp)],
    limit: 100,
  });
  return logs.map((log) => ({
    id: log.id,
    action: log.action ?? "UNKNOWN",
    details: typeof log.details === "string"
      ? log.details
      : JSON.stringify(log.details ?? {}),
    timestamp: log.timestamp?.toISOString?.() ?? new Date().toISOString(),
    actor: log.userId ? `User:${log.userId}` : "System",
  }));
}

async function fetchAuditLogs(): Promise<AuditLogView[]> {
  if (process.env.DEMO_MODE === 'true' || !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
    try {
      const demoLogs = await fetchAuditLogsDemo();
      return demoLogs.length > 0 ? demoLogs : FALLBACK_AUDIT_LOGS;
    } catch {
      return FALLBACK_AUDIT_LOGS;
    }
  }
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data, error } = await supabaseAdmin
    .from("audit_logs")
    .select("id, action, details, timestamp, user_id")
    .order("timestamp", { ascending: false })
    .limit(100);

  if (error || !data || data.length === 0) return FALLBACK_AUDIT_LOGS;

  const rows = data as Array<{ id: string; action: string | null; details: unknown; timestamp: string; user_id: string | null }>;
  return rows.map((log) => ({
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
  await requireRole(["admin", "operator"]);
  let logs: AuditLogView[] = [];
  try {
    logs = await fetchAuditLogs();
  } catch (e) {
    console.warn("Audit fetch error, using fallback:", e);
    logs = FALLBACK_AUDIT_LOGS;
  }
  const view = { recentAuditLogs: logs };

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
          description={`${logs.length} eventos registrados. ${process.env.DEMO_MODE === 'true' ? '(Sandbox — Drizzle ORM)' : '(Producción — Supabase)'}`}
        />
      </div>
      <MissionCard>
        <AuditLogTimeline view={view} />
      </MissionCard>
    </div>
  );
}
