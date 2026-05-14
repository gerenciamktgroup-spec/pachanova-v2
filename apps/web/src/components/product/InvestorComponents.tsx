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

export function InvestorPortfolioHero({ view }: { view: InvestorDashboardView }) {
  const availableTokensStr = String(view.investor.balance.availableTokens || "0");
  const balance = Number(availableTokensStr.replace(/,/g, ''));
  const sqm = tokensToSquareMeters(balance);
  const ownership = tokenOwnershipPercent(balance);

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
          <p className="text-xs text-pn-text-soft uppercase tracking-wider mb-1">Balance Total</p>
          <TokenAmount amount={balance} />
        </div>
        <div>
          <p className="text-xs text-pn-text-soft uppercase tracking-wider mb-1">Superficie Pro-Rata</p>
          <SquareMeterAmount amount={sqm} />
        </div>
        <div>
          <p className="text-xs text-pn-text-soft uppercase tracking-wider mb-1">Valor Estimado Demo</p>
          <MoneyAmount amount={Number(view.investor.balance.availableUsd.replace(/[^0-9.-]+/g, ""))} />
        </div>
        <div>
          <p className="text-xs text-pn-text-soft uppercase tracking-wider mb-1">Ownership Genesis</p>
          <span className="text-pn-text font-medium">{ownership.toFixed(2)}%</span>
        </div>
      </div>
    </MissionCard>
  );
}

export function ProRataLandCardV2({ view }: { view: InvestorDashboardView }) {
  const availableTokensStr = String(view.investor.balance.availableTokens || "0");
  const balance = Number(availableTokensStr.replace(/,/g, ''));
  const sqm = tokensToSquareMeters(balance);

  return (
    <MissionCard title="Respaldo Subyacente (Demo)" data-testid="pro-rata-land-card">
      <div className="aspect-video w-full rounded-md bg-pn-bg border border-pn-border overflow-hidden relative mb-4 flex items-center justify-center p-6">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#4B8FF0 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="z-10 w-full h-full border border-pn-gold/30 bg-pn-surface/50 rounded flex flex-col items-center justify-center">
          <IntegrationStatusBadge status="SIMULATED" />
          <h4 className="mt-4 font-semibold text-pn-gold tracking-wide">Visualización 2D Demo</h4>
          <p className="text-xs text-pn-text-muted mt-2">Motor 3D desactivado localmente</p>
          <div className="mt-6 flex gap-4 text-xs">
            <div className="text-center px-4 py-2 border border-pn-border bg-pn-bg rounded">
              <span className="block text-pn-text-soft">San Bartolo</span>
              <span className="font-bold text-pn-text">50,000 m²</span>
            </div>
            <div className="text-center px-4 py-2 border border-pn-border bg-pn-bg rounded">
              <span className="block text-pn-text-soft">Relación Demo</span>
              <span className="font-bold text-pn-text">1 PACHA = 0.1 m²</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center p-3 rounded bg-pn-surface-strong border border-pn-border">
        <div>
          <h4 className="text-sm font-medium text-pn-text">Proyecto San Bartolo</h4>
          <p className="text-xs text-pn-text-soft">Lote Demo • 50,000 m² Totales</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-pn-text-soft uppercase mb-1">Tu Fracción</p>
          <div data-testid="investor-sqm-value">
            <SquareMeterAmount amount={sqm} />
          </div>
        </div>
      </div>
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
              <DataGridCell><span suppressHydrationWarning className="font-mono text-xs text-pn-text-muted">{new Date(tx.timestamp).toLocaleString()}</span></DataGridCell>
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

export function InvestorWalletStatusPanel({ view }: { view: InvestorDashboardView }) {
  const [depositAmount, setDepositAmount] = useState<number>(1000);
  const [isDepositing, setIsDepositing] = useState(false);
  const [message, setMessage] = useState("");

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
          <p className="text-xs text-pn-text-soft mb-1">Saldo Disponible</p>
          <p className="text-xl font-medium text-pn-gold" suppressHydrationWarning>
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(view.investor.balance.availableUsd))}
          </p>
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
