export const dynamic = 'force-dynamic';

import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import { desc } from "drizzle-orm";
import { RouteBreadcrumbs, SectionHeader, MissionCard } from "@/components/mission";
import { requireRole } from "@/utils/auth/requireRole";

type FideicomisoSig = {
  id: string;
  operationId: string;
  signerRole: string;
  signatureHash: string | null;
  timestamp: string;
};

async function fetchSignatures(): Promise<FideicomisoSig[]> {
  try {
    const data = await db.query.fideicomisoSignatures.findMany({
      orderBy: [desc(schema.fideicomisoSignatures.timestamp)],
      limit: 50
    });
    return data.map(sig => ({
      id: sig.id,
      operationId: sig.operationId,
      signerRole: sig.signerRole,
      signatureHash: sig.signatureHash,
      timestamp: sig.timestamp.toISOString()
    }));
  } catch (error) {
    console.error("Error fetching trust signatures:", error);
    return [];
  }
}

export default async function FideicomisoSignaturesPage() {
  await requireRole(["admin", "fiduciario", "fideicomiso"]);
  const signatures = await fetchSignatures();

  return (
    <div className="space-y-8 pb-24">
      <div>
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Fideicomiso", href: "/dashboard/fideicomiso" },
          { label: "Firmas" }
        ]} className="mb-4" />
        <SectionHeader 
          eyebrow="Gobernanza"
          title="Auditoría de Firmas"
          description="Historial inmutable de firmas aprobadas por los miembros del quórum."
        />
      </div>

      <MissionCard title="Historial de Firmas Multi-Sig">
        {signatures.length === 0 ? (
          <p className="text-sm text-pn-text-muted p-4">
            Sin firmas registradas en este entorno.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-pn-border text-pn-text-muted text-left">
                  <th className="py-3 px-4 font-medium">Operación ID</th>
                  <th className="py-3 px-4 font-medium">Rol Firmante</th>
                  <th className="py-3 px-4 font-medium">Hash de Firma</th>
                  <th className="py-3 px-4 font-medium">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {signatures.map((sig) => (
                  <tr key={sig.id} className="border-b border-pn-border hover:bg-pn-surface-strong">
                    <td className="py-3 px-4 text-pn-text-muted font-mono text-xs">
                      {sig.operationId.substring(0, 8)}...{sig.operationId.substring(sig.operationId.length - 8)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-pn-gold/10 text-pn-gold uppercase">
                        {sig.signerRole}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-pn-text font-mono text-xs">
                      {sig.signatureHash ? (
                        <>
                          {sig.signatureHash.substring(0, 10)}...{sig.signatureHash.substring(sig.signatureHash.length - 10)}
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-3 px-4 text-pn-text-muted">
                      {new Date(sig.timestamp).toLocaleString("es-AR", {
                        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
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
