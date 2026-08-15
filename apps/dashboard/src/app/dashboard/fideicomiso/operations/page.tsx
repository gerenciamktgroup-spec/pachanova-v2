export const dynamic = 'force-dynamic';

import { createClient } from "@supabase/supabase-js";
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

const FALLBACK_OPERATIONS: FideicomisoOp[] = [
  {
    id: "op-demo-1",
    type: "EMISION_GENESIS",
    status: "signed",
    required_signatures: 3,
    current_signatures: 2,
    created_at: new Date().toISOString()
  },
  {
    id: "op-demo-2",
    type: "VALUATION_ORACLE_UPDATE",
    status: "executed",
    required_signatures: 2,
    current_signatures: 2,
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];

async function fetchOperations(): Promise<FideicomisoOp[]> {
  if (process.env.DEMO_MODE === 'true' || !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
    return FALLBACK_OPERATIONS;
  }

  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabaseAdmin
      .from("fideicomiso_operations")
      .select("id, type, status, required_signatures, current_signatures, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error || !data || data.length === 0) return FALLBACK_OPERATIONS;
    return data as FideicomisoOp[];
  } catch {
    return FALLBACK_OPERATIONS;
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
          title="Operaciones Fiduciarias"
          description="Gestión de propuestas de mutación y quórum de firmas."
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
                  <th className="p-3">ID Operación</th>
                  <th className="p-3">Tipo</th>
                  <th className="p-3">Firmas</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {operations.map((op) => (
                  <tr key={op.id} className="border-b border-pn-border/50 hover:bg-pn-surface-strong/30">
                    <td className="p-3 font-mono text-xs text-pn-text-muted">{op.id.slice(0, 8)}...</td>
                    <td className="p-3 font-semibold text-pn-text">{op.type}</td>
                    <td className="p-3 font-mono text-xs">{op.current_signatures} / {op.required_signatures}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                        op.status === 'executed' || op.status === 'signed' 
                          ? 'bg-pn-success/20 text-pn-success' 
                          : 'bg-pn-warning/20 text-pn-warning'
                      }`}>
                        {op.status}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-pn-text-muted">{new Date(op.created_at).toLocaleDateString()}</td>
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
