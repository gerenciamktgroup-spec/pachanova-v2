export const dynamic = 'force-dynamic';

import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import { desc } from "drizzle-orm";
import { RouteBreadcrumbs, SectionHeader, MissionCard } from "@/components/mission";
import { requireRole } from "@/utils/auth/requireRole";

type FideicomisoOp = {
  id: string;
  type: string;
  status: string;
  required_signatures: number;
  current_signatures: number;
  created_at: string;
};

async function fetchOperations(): Promise<FideicomisoOp[]> {
  try {
    const data = await db.query.fideicomisoOperations.findMany({
      orderBy: [desc(schema.fideicomisoOperations.id)],
      limit: 50
    });
    return data.map(op => ({
      id: op.id,
      type: op.type,
      status: op.status,
      required_signatures: op.requiredSignatures,
      current_signatures: op.currentSignatures,
      created_at: op.executedAt ? op.executedAt.toISOString() : new Date().toISOString()
    }));
  } catch (error) {
    console.error("Error fetching operations:", error);
    return [];
  }
}

export default async function FideicomisoOperationsPage() {
  await requireRole(["admin", "fiduciario", "fideicomiso"]);
  const operations = await fetchOperations();

  return (
    <div className="space-y-8 pb-24">
      <div>
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Fideicomiso", href: "/dashboard/fideicomiso" },
          { label: "Operaciones" }
        ]} className="mb-4" />
        <SectionHeader 
          eyebrow="Multi-Sig"
          title="Operaciones Pendientes"
          description="Gestión de propuestas de mutación on-chain."
        />
      </div>

      <MissionCard title="Operaciones del Fideicomiso">
        {operations.length === 0 ? (
          <p className="text-sm text-pn-text-muted p-4">
            Sin operaciones registradas en este entorno.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-pn-border text-pn-text-muted text-left">
                  <th className="py-3 px-4 font-medium">Tipo</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Firmas</th>
                  <th className="py-3 px-4 font-medium">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {operations.map((op) => (
                  <tr key={op.id} className="border-b border-pn-border hover:bg-pn-surface-strong">
                    <td className="py-3 px-4 text-pn-text font-mono text-xs">
                      {op.type}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        op.status === "completed" || op.status === "executed" || op.status === "executed_simulated"
                          ? "bg-pn-success/10 text-pn-success"
                          : op.status === "pending" || op.status === "fiduciario_signed"
                          ? "bg-pn-warning/10 text-pn-warning"
                          : "bg-pn-surface-strong text-pn-text-muted"
                      }`}>
                        {op.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-pn-text tabular-nums">
                      {op.current_signatures} / {op.required_signatures}
                    </td>
                    <td className="py-3 px-4 text-pn-text-muted">
                      {new Date(op.created_at).toLocaleDateString("es-AR", {
                        day: "2-digit", month: "short", year: "numeric"
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </MissionCard>
    </div>
  );
}
