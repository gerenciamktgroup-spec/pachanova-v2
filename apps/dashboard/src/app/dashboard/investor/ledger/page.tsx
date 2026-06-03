import { Suspense } from "react";
import { RouteBreadcrumbs, SectionHeader, MissionCard, SafeActionButton, LoadingState } from "@/components/mission";
import { DataGrid, DataGridRow, DataGridCell, TokenAmount } from "@/components/product/SharedComponents";
import { createServerClient } from "@/utils/supabase/server";
import { eq } from "drizzle-orm";
import { schema } from "@pachanova/database";
import { db } from "@/server/db";
import { cn } from "@/lib/utils";

export const dynamic = 'force-dynamic';

async function fetchLedgerData() {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Default to mock investor if not logged in for demo ease
    const userEmail = user?.email || "demo.investor.holder@pachanova.local";

    // Use shared db singleton for performance
    const investor = await db.query.investors.findFirst({
      where: eq(schema.investors.email, userEmail),
    });

    if (!investor) {
      return { error: "Investor profile not found. Please log in first." };
    }

    // Fetch all token ledger transactions for this investor
    const transactions = await db.query.tokenLedger.findMany({
      where: eq(schema.tokenLedger.investorId, investor.id),
      orderBy: (l, { desc }) => [desc(l.timestamp)],
    });

    return {
      transactions: transactions.map(tx => ({
        id: tx.id,
        operationType: tx.operation,
        amount: tx.amount,
        timestamp: tx.timestamp,
        txHash: tx.txHash,
      })),
    };
  } catch (error: any) {
    console.error("Error loading ledger data:", error);
    return { error: error.message };
  }
}

async function LedgerContent() {
  const data = await fetchLedgerData();

  if (data.error) {
    return (
      <MissionCard>
        <div className="p-8 text-center text-pn-danger font-medium">
          Error: {data.error}
        </div>
      </MissionCard>
    );
  }

  const txs = data.transactions || [];

  return (
    <MissionCard title="Historial del Ledger">
      {txs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center rounded-md border border-dashed border-pn-border/50 bg-pn-surface-strong/20">
          <p className="text-sm font-medium text-pn-text mb-1">Sin Transacciones</p>
          <p className="text-xs text-pn-text-muted">Aún no tienes registros en el token_ledger local.</p>
        </div>
      ) : (
        <DataGrid headers={["Tipo", "Monto", "Fecha", "Tx Hash Demo"]}>
          {txs.map(tx => (
            <DataGridRow key={tx.id}>
              <DataGridCell>
                <span className={cn(
                  "text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded border",
                  tx.operationType === "GENESIS_PURCHASE" && "bg-pn-gold/10 text-pn-gold border-pn-gold/20",
                  tx.operationType === "TRANSFER" && "bg-pn-blue/10 text-pn-blue border-pn-blue/20",
                  (tx.operationType === "STAKE" || tx.operationType === "UNSTAKE") && "bg-pn-terracotta/10 text-pn-terracotta border-pn-terracotta/20",
                  tx.operationType === "YIELD" && "bg-pn-success/10 text-pn-success border-pn-success/20",
                  !["GENESIS_PURCHASE", "TRANSFER", "STAKE", "UNSTAKE", "YIELD"].includes(tx.operationType) && "bg-pn-surface-strong text-pn-text border-pn-border"
                )}>
                  {tx.operationType}
                </span>
              </DataGridCell>
              <DataGridCell><TokenAmount amount={tx.amount} /></DataGridCell>
              <DataGridCell><span className="font-mono text-xs text-pn-text-muted">{new Date(tx.timestamp).toLocaleString('en-US')}</span></DataGridCell>
              <DataGridCell>
                <span className="font-mono text-[10px] text-pn-text-soft truncate max-w-[120px] block">
                  {tx.txHash || "PENDING"}
                </span>
              </DataGridCell>
            </DataGridRow>
          ))}
        </DataGrid>
      )}
    </MissionCard>
  );
}

export default function InvestorLedgerPage() {
  return (
    <div className="space-y-8 pb-24">
      <div>
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Panel Inversor", href: "/dashboard/investor" },
          { label: "Ledger PACHA" }
        ]} className="mb-4" />
        <SectionHeader 
          eyebrow="On-Chain (Simulated)"
          title="Ledger PACHA"
          description="Historial inmutable de transferencias del token simulado en el Sandbox local."
        />
      </div>

      <Suspense fallback={<LoadingState message="Cargando historial del ledger..." />}>
        <LedgerContent />
      </Suspense>
      
      <div className="flex justify-end">
        <SafeActionButton label="Volver al Panel" href="/dashboard/investor" variant="ghost" />
      </div>
    </div>
  );
}
