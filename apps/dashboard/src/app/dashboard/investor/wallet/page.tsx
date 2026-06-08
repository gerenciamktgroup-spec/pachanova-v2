import { RouteBreadcrumbs } from "@/components/mission";
import { ShieldCheck } from "lucide-react";
import { WalletClient } from "./WalletClient";
import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import { eq, desc, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function WalletPage() {
  const cookieStore = await cookies();
  const sessionStr = cookieStore.get('pachanova-mock-session')?.value;
  if (!sessionStr) redirect('/login');
  
  const user = JSON.parse(sessionStr);
  if (user.role !== 'investor') redirect('/dashboard/admin');

  // Fetch balances
  const userBalances = await db.select()
    .from(schema.balances)
    .where(eq(schema.balances.investorId, user.id));

  const totalUsd = userBalances.reduce((acc, b) => acc + Number(b.availableUsd || 0), 0);

  // Fetch recent transactions (deposits and withdrawals)
  const recentTransactions = await db.select()
    .from(schema.transactions)
    .where(
      and(
        eq(schema.transactions.receiverId, user.id)
      )
    )
    .orderBy(desc(schema.transactions.createdAt))
    .limit(10);

  // Fetch pending dividends
  const pendingDist = await db.select()
    .from(schema.distributions)
    .where(and(eq(schema.distributions.investorId, user.id), eq(schema.distributions.status, "PENDIENTE")));
  const pendingDividends = pendingDist.reduce((acc, dist) => acc + parseFloat(dist.amountUsd), 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <RouteBreadcrumbs />
        <h1 className="text-3xl font-light tracking-tight text-pn-text">
          Billetera <span className="font-semibold text-pn-gold">PachaNova</span>
        </h1>
        <p className="text-pn-text-muted">
          Inyecta saldo fiduciario o retira tus rendimientos en cualquier momento.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulario de Fondeo/Retiro */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-pn-border bg-pn-surface-strong/50 backdrop-blur-sm flex justify-between items-center">
            <div>
              <p className="text-sm text-pn-text-soft">Saldo Disponible</p>
              <p className="text-3xl font-medium text-pn-gold">${totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="px-3 py-1 bg-pn-gold/10 text-pn-gold text-xs font-semibold uppercase tracking-wider rounded border border-pn-gold/20">
              Pacha USD
            </div>
          </div>

          <div className="p-6 rounded-xl border border-pn-border bg-pn-surface-strong/30 backdrop-blur-sm space-y-6">
            <WalletClient totalUsd={totalUsd} pendingDividends={pendingDividends} />
          </div>
        </div>

        {/* Info lateral & Historial */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-pn-border/50 bg-gradient-to-br from-pn-surface-strong/20 to-transparent">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-pn-gold/10 rounded-lg shrink-0">
                <ShieldCheck className="w-6 h-6 text-pn-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-pn-text">Seguridad Institucional</h3>
                <p className="text-sm text-pn-text-soft mt-2 leading-relaxed">
                  PachaNova opera bajo el estándar bancario de <strong>Cuatro Ojos (Maker-Checker)</strong>. Ningún fondo es acreditado sin una doble validación cruzada entre el sistema de pagos y nuestra Consola de Tesorería, garantizando seguridad absoluta contra fraudes.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6 rounded-xl border border-pn-border bg-pn-surface-strong/30">
            <h3 className="font-semibold text-pn-text mb-4">Depósitos Recientes</h3>
            {recentTransactions.length === 0 ? (
              <p className="text-sm text-pn-text-soft text-center py-4">No hay historial de fondeos.</p>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex justify-between items-center p-3 rounded-lg bg-pn-surface/50 border border-pn-border/50">
                    <div>
                      <p className="text-sm font-medium text-pn-text">Fondeo USD</p>
                      <p className="text-xs text-pn-text-soft">{new Date(tx.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-pn-gold">+${Number(tx.amount).toFixed(2)}</p>
                      <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                        tx.status === 'completed' ? 'bg-pn-success/10 text-pn-success' :
                        tx.status === 'failed' || tx.status === 'cancelled' ? 'bg-pn-danger/10 text-pn-danger' :
                        'bg-pn-warning/10 text-pn-warning'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
