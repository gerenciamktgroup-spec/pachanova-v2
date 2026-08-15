export const dynamic = "force-dynamic";

import { DEFAULT_DEMO_INVESTOR, schema } from "@pachanova/database";
import { desc, eq } from "drizzle-orm";

import { MetricTile, MissionCard, RouteBreadcrumbs, SafeActionButton, SectionHeader } from "@/components/mission";
import { DataGrid, DataGridCell, DataGridRow, ProductEmptyState } from "@/components/product/SharedComponents";
import { db } from "@/server/db";

const FALLBACK_LEDGER_DATA = {
  investor: {
    id: "demo-investor-123",
    email: DEFAULT_DEMO_INVESTOR.email,
  },
  balance: {
    availableTokens: "1250.00",
    availableUsd: "5000.00",
  },
  entries: [
    {
      id: "ledger-demo-1",
      timestamp: new Date(),
      operation: "GENESIS_ACQUISITION",
      amount: "1250.00",
      txHash: "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
      currentHash: "0x9a3f29b47e192c73d9e84b01f357aa18f7d9a1c2e4b6d8f012345678abcdef01"
    },
    {
      id: "ledger-demo-2",
      timestamp: new Date(Date.now() - 86400000),
      operation: "YIELD_DISTRIBUTION",
      amount: "25.50",
      txHash: "0x1183b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9011",
      currentHash: "0x7b3f29b47e192c73d9e84b01f357aa18f7d9a1c2e4b6d8f012345678abcdef22"
    }
  ]
};

async function getLedgerData() {
  try {
    const investor = await db.query.investors.findFirst({
      where: eq(schema.investors.email, DEFAULT_DEMO_INVESTOR.email),
    });
    if (!investor) return FALLBACK_LEDGER_DATA;

    const [balance, entries] = await Promise.all([
      db.query.balances.findFirst({ where: eq(schema.balances.investorId, investor.id) }),
      db.query.tokenLedger.findMany({
        where: eq(schema.tokenLedger.investorId, investor.id),
        orderBy: [desc(schema.tokenLedger.timestamp)],
        limit: 100,
      }),
    ]);

    return { 
      investor, 
      balance: balance ? { availableTokens: balance.availableTokens.toString(), availableUsd: balance.availableUsd.toString() } : FALLBACK_LEDGER_DATA.balance, 
      entries: entries.length > 0 ? entries : FALLBACK_LEDGER_DATA.entries 
    };
  } catch (error) {
    console.warn("Unable to load investor ledger from DB, using fallback:", error);
    return FALLBACK_LEDGER_DATA;
  }
}

function shortHash(hash: string | null) {
  if (!hash) return "—";
  return hash.length > 20 ? `${hash.slice(0, 10)}…${hash.slice(-8)}` : hash;
}

export default async function InvestorLedgerPage() {
  const data = await getLedgerData();

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
                <DataGridCell>{new Date(entry.timestamp).toLocaleString("es-PE")}</DataGridCell>
                <DataGridCell><span className="uppercase text-xs font-semibold">{entry.operation}</span></DataGridCell>
                <DataGridCell><span className={Number(entry.amount) >= 0 ? "text-pn-success" : "text-pn-danger"}>{entry.amount} PACHA</span></DataGridCell>
                <DataGridCell><span className="font-mono text-xs" title={entry.txHash ?? undefined}>{shortHash(entry.txHash)}</span></DataGridCell>
                <DataGridCell><span className="font-mono text-xs" title={entry.currentHash}>{shortHash(entry.currentHash)}</span></DataGridCell>
              </DataGridRow>
            ))}
          </DataGrid>
        )}
      </MissionCard>

      <div className="flex justify-end">
        <SafeActionButton label="Volver al Panel" href="/dashboard/investor" variant="ghost" />
      </div>
    </div>
  );
}
