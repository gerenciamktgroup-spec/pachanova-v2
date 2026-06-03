"use client";

import React, { useState } from "react";
import { MissionCard } from "@/components/mission/MissionCard";
import { IntegrationStatusBadge } from "@/components/mission/IntegrationStatusBadge";
import { CommandButton } from "@/components/mission/CommandButton";
import { SafeActionButton } from "@/components/mission/SafeActionButton";
import { TokenAmount, SquareMeterAmount, MoneyAmount, UserStatusPill, DataGrid, DataGridRow, DataGridCell, ProductEmptyState } from "./SharedComponents";
import { tokenOwnershipPercent, tokensToSquareMeters } from "@/lib/product/math";
import { InvestorDashboardView } from "@/types/product";
import { PRODUCT_COPY } from "@/lib/copy/productCopy";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export function InvestorPortfolioHero({ view }: { view: InvestorDashboardView & { investor: { portfolio: any[] } } }) {
  const portfolio = view.investor.portfolio || [];
  
  const totalTokens = portfolio.reduce((acc, p) => acc + Number(p.availableTokens || 0), 0);
  const totalUsd = portfolio.reduce((acc, p) => acc + Number(p.availableUsd || 0), 0);
  const totalSqm = tokensToSquareMeters(totalTokens);
  
  // Example simplistic ownership across all (doesn't make much sense for mixed properties, but kept for UI structure)
  const ownership = tokenOwnershipPercent(totalTokens);

  return (
    <MissionCard className="bg-gradient-to-br from-pn-surface to-pn-surface-strong border-pn-gold/20" animated>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tighter text-pn-text mb-2">
            Bienvenido, <span className="font-semibold text-pn-gold">{view.investor.fullName}</span>
          </h1>
          <p className="text-sm text-pn-text-muted max-w-xl">
            {PRODUCT_COPY.disclaimers.noRealMoney} Su cuenta se encuentra en el entorno Demo Local.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <UserStatusPill status={view.investor.kycStatus} />
          <IntegrationStatusBadge status="SIMULATED" />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-pn-border/50 pt-6">
        <div>
          <p className="text-xs text-pn-text-soft uppercase tracking-wider mb-1">Tokens Totales</p>
          <TokenAmount amount={totalTokens} />
        </div>
        <div>
          <p className="text-xs text-pn-text-soft uppercase tracking-wider mb-1">Superficie Total Estimada</p>
          <SquareMeterAmount amount={totalSqm} />
        </div>
        <div>
          <p className="text-xs text-pn-text-soft uppercase tracking-wider mb-1">Billetera USD</p>
          <MoneyAmount amount={totalUsd} />
        </div>
        <div>
          <p className="text-xs text-pn-text-soft uppercase tracking-wider mb-1">Propiedades Activas</p>
          <span className="text-pn-text font-medium">{portfolio.length}</span>
        </div>
      </div>
    </MissionCard>
  );
}

export function ProRataLandCardV2({ view }: { view: any }) {
  const portfolio = view.investor.portfolio || [];

  return (
    <MissionCard title="Portafolio Inmobiliario" data-testid="pro-rata-land-card">
      {portfolio.length === 0 ? (
        <ProductEmptyState title="Sin Inversiones" description="Aún no posees fracciones inmobiliarias." />
      ) : (
        <div className="space-y-4">
          {portfolio.map((item: any) => {
            const balance = Number(item.availableTokens);
            const sqm = tokensToSquareMeters(balance);
            return (
              <div key={item.propertyId} className="flex justify-between items-center p-4 rounded-lg bg-[#0f172a] border border-white/10 hover:border-[#c5a46d]/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded bg-white/5 border border-white/10 overflow-hidden relative flex-shrink-0">
                    <img src={item.imageUrl} alt={item.propertyName} className="object-cover w-full h-full opacity-60" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white/90">{item.propertyName}</h4>
                    <p className="text-xs text-white/50">{item.location} • {item.propertyType}</p>
                    <a href={`/dashboard/investor/certificate/${item.propertyId}`} target="_blank" rel="noreferrer" className="text-[10px] text-[#c5a46d] hover:underline mt-1 inline-block">
                      📄 Descargar Certificado
                    </a>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/50 uppercase mb-1">Fracción ({item.availableTokens} PACHA)</p>
                  <div className="font-semibold text-[#c5a46d]">
                    <SquareMeterAmount amount={sqm} />
                  </div>
                  <a href={`/dashboard/investor/invest/${item.propertyId}`} className="text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded mt-2 inline-block transition-colors">
                    + Invertir Más
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </MissionCard>
  );
}

export function InvestorLedgerPanel({ view }: { view: InvestorDashboardView }) {
  return (
    <MissionCard title="Local Token Ledger" data-testid="investor-ledger-panel">
      {view.recentTransactions.length === 0 ? (
        <ProductEmptyState 
          title="Sin Transacciones" 
          description="Aún no tienes registros en el token_ledger local." 
        />
      ) : (
        <DataGrid headers={["Tipo", "Monto", "Fecha", "Tx Hash Demo"]}>
          {view.recentTransactions.map(tx => (
            <DataGridRow key={tx.id}>
              <DataGridCell><span className="text-xs font-medium px-2 py-1 bg-pn-surface-strong rounded border border-pn-border">{tx.operationType}</span></DataGridCell>
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
      <div className="mt-4 flex justify-end">
        <SafeActionButton label="Ver Ledger Completo" href="/dashboard/investor/ledger" variant="ghost" />
      </div>
    </MissionCard>
  );
}

export function InvestorKycStatusPanel({ view }: { view: InvestorDashboardView }) {
  return (
    <MissionCard title="Identidad Inversor">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-pn-surface-strong rounded-full border border-pn-border">
          <ShieldAlert className="w-5 h-5 text-pn-text-muted" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-sm font-medium text-pn-text">Estado KYC Demo</h4>
            <UserStatusPill status={view.investor.kycStatus} />
          </div>
          <p className="text-xs text-pn-text-soft mb-4">
            El proveedor de identidad está configurado como {view.kycVerificationProvider}.
          </p>
          <Link href="/demo/control-room">
            <CommandButton variant="outline" fullWidth>Gestionar Identidad Demo</CommandButton>
          </Link>
        </div>
      </div>
    </MissionCard>
  );
}

export function GenesisDemoActionCard({ view }: { view: InvestorDashboardView }) {
  const isKycApproved = view.investor.kycStatus === "approved";
  const isPaymentsReady = view.paymentsReadiness.status === "SIMULATED" || view.paymentsReadiness.status === "CONNECTED";

  return (
    <MissionCard title="Oferta Genesis (Simulación)" variant="elevated" data-testid="genesis-demo-action">
      <div className="p-4 rounded-md border border-pn-border bg-pn-surface-strong mb-6 space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-pn-text-soft">Equivalencia PACHA</span>
          <span className="text-pn-text font-medium">1 PACHA = 0.1 m²</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-pn-text-soft">Precio PACHA (Demo)</span>
          <span className="text-pn-text font-medium">US$ 8.40</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-pn-text-soft">MercadoPago Readiness</span>
          <IntegrationStatusBadge status="PENDING_CREDENTIALS" />
        </div>
      </div>

      <p className="text-xs text-pn-warning text-center mb-4">
        No production connections. Entorno aislado.
      </p>

      <div className="space-y-3">
        <SafeActionButton 
          variant="primary" 
          label="Simular adquisición Genesis"
          href="/dashboard/investor/genesis"
          status={(!isKycApproved) ? "disabled" : "active"}
          disabledReason={!isKycApproved ? "Requiere estado KYC Approved." : ""}
        />
        
        {!isKycApproved && (
          <div className="pt-2 text-center">
            <SafeActionButton variant="outline" label="Abrir Control Room" href="/demo/control-room" />
          </div>
        )}
      </div>
    </MissionCard>
  );
}

export function InvestorWalletStatusPanel({ view }: { view: any }) {
  const [depositAmount, setDepositAmount] = useState<number>(1000);
  const [isDepositing, setIsDepositing] = useState(false);
  const [message, setMessage] = useState("");

  const totalUsd = view.investor.portfolio?.reduce((acc: number, p: any) => acc + Number(p.availableUsd || 0), 0) || 0;

  const handleDeposit = async () => {
    setIsDepositing(true);
    setMessage("");
    try {
      const res = await fetch("/api/demo/actions/simulated-deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ investorId: view.investor.id, amountUsd: depositAmount })
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Depósito simulado con éxito. Actualiza la página para ver tu saldo.");
      } else {
        setMessage(data.error || "Error al depositar");
      }
    } catch (e) {
      setMessage("Error de red");
    } finally {
      setIsDepositing(false);
    }
  };

  return (
    <MissionCard title="Billetera USD (Simulada)">
      <div className="space-y-4">
        <div className="p-3 bg-pn-surface-strong rounded border border-pn-border">
          <p className="text-xs text-pn-text-soft mb-1">Saldo Disponible Total</p>
          <p className="text-xl font-medium text-pn-gold">${totalUsd.toLocaleString('en-US')}</p>
        </div>

        <div className="space-y-2 mt-4 pt-4 border-t border-pn-border">
          <label className="text-sm text-pn-text-muted">Simular Depósito (USD)</label>
          <div className="flex gap-2">
            <input 
              type="number" 
              value={depositAmount} 
              onChange={e => setDepositAmount(Number(e.target.value))} 
              className="flex-1 bg-pn-bg border border-pn-border rounded px-3 py-1 text-sm focus:outline-none focus:border-pn-gold"
            />
            <CommandButton variant="primary" onClick={handleDeposit} disabled={isDepositing || depositAmount <= 0}>
              {isDepositing ? "..." : "Depositar"}
            </CommandButton>
          </div>
          {message && <p className="text-xs text-pn-gold mt-2">{message}</p>}
        </div>

        <div className="flex justify-between items-center text-sm pt-4 border-t border-pn-border">
          <span className="text-pn-text-soft">Contratos Custodios</span>
          <IntegrationStatusBadge status={view.contractReadiness.status} />
        </div>
        <p className="text-xs text-pn-text-muted">
          El saldo y los tokens PACHA virtuales residen temporalmente en la base de datos local hasta conectar Foundry.
        </p>
      </div>
    </MissionCard>
  );
}
