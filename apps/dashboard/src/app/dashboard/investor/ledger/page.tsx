export const dynamic = "force-dynamic";

import { DEFAULT_DEMO_INVESTOR, schema } from "@pachanova/database";
import { desc, eq } from "drizzle-orm";

import { MetricTile, MissionCard, RouteBreadcrumbs, SafeActionButton, SectionHeader } from "@/components/mission";
import { DataGrid, DataGridCell, DataGridRow, ProductEmptyState } from "@/components/product/SharedComponents";
import { db } from "@/server/db";

async function getLedgerData() {
  const investor = await db.query.investors.findFirst({
    where: eq(schema.investors.email, DEFAULT_DEMO_INVESTOR.email),
  });
  if (!investor) return null;

  const [balance, entries] = await Promise.all([
    db.query.balances.findFirst({ where: eq(schema.balances.investorId, investor.id) }),
    db.query.tokenLedger.findMany({
      where: eq(schema.tokenLedger.investorId, investor.id),
      orderBy: [desc(schema.tokenLedger.timestamp)],
      limit: 100,
    }),
  ]);

  return { investor, balance, entries };
}

function shortHash(hash: string | null) {
  if (!hash) return "—";
  return hash.length > 20 ? `${hash.slice(0, 10)}…${hash.slice(-8)}` : hash;
}

export default async function InvestorLedgerPage() {
  let data: Awaited<ReturnType<typeof getLedgerData>> = null;
  let loadError = false;
  try {
    data = await getLedgerData();
  } catch (error) {
    console.error("Unable to load investor ledger", error);
    loadError = true;
  }

  return (
    <div className="space-y-8 pb-24">
      <div>
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Panel Inversor", href: "/dashboard/investor" },
          { label: "Ledger PACHA" },
        ]} className="mb-4" />
        <SectionHeader
          eyebrow="Ledger local verificable"
          title="Ledger PACHA"
          description="Movimientos persistidos por Génesis, mercado P2P y rendimientos del entorno demo. Cada registro conserva su referencia y encadenamiento de hash."
        />
      </div>

      {loadError || !data ? (
        <MissionCard variant="warning">
          <ProductEmptyState
            title="Ledger no disponible"
            description="Inicializa PostgreSQL y ejecuta pnpm demo:reset para reconstruir el entorno determinista."
          />
        </MissionCard>
      ) : (
        <>
          <MissionCard>
            <div className="grid gap-6 sm:grid-cols-3">
              <MetricTile label="PACHA disponible" value={data.balance?.availableTokens ?? "0"} unit="PACHA" />
              <MetricTile label="USD disponible" value={data.balance?.availableUsd ?? "0"} unit="USD" />
              <MetricTile label="Movimientos" value={data.entries.length} helper="Últimos 100 registros" />
            </div>
          </MissionCard>

          <MissionCard variant="data">
            {data.entries.length === 0 ? (
              <div className="p-6">
                <ProductEmptyState title="No hay movimientos" description="Completa una compra Génesis o una operación P2P para poblar el ledger." />
              </div>
            ) : (
              <DataGrid headers={["Fecha", "Operación", "Cantidad", "Referencia", "Hash actual"]}>
                {data.entries.map((entry) => (
                  <DataGridRow key={entry.id}>
                    <DataGridCell>{entry.timestamp.toLocaleString("es-PE")}</DataGridCell>
                    <DataGridCell><span className="uppercase text-xs font-semibold">{entry.operation}</span></DataGridCell>
                    <DataGridCell><span className={Number(entry.amount) >= 0 ? "text-pn-success" : "text-pn-danger"}>{entry.amount} PACHA</span></DataGridCell>
                    <DataGridCell><span className="font-mono text-xs" title={entry.txHash ?? undefined}>{shortHash(entry.txHash)}</span></DataGridCell>
                    <DataGridCell><span className="font-mono text-xs" title={entry.currentHash}>{shortHash(entry.currentHash)}</span></DataGridCell>
                  </DataGridRow>
                ))}
              </DataGrid>
            )}
          </MissionCard>
        </>
      )}

      <div className="flex justify-end">
        <SafeActionButton label="Volver al Panel" href="/dashboard/investor" variant="ghost" />
      </div>
    </div>
  );
}
