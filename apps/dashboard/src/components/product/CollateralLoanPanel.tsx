"use client";

import React, { useState } from "react";
import { MissionCard, CommandButton, IntegrationStatusBadge } from "@/components/mission";

interface CollateralLoanPanelProps {
  availableTokens: number;
  lockedTokens: number;
  availableUsd?: number;
  onLoanUpdated?: () => void;
}

export function CollateralLoanPanel({
  availableTokens = 100,
  lockedTokens = 0,
  onLoanUpdated,
}: CollateralLoanPanelProps) {
  const [pachaToLock, setPachaToLock] = useState<number>(Math.min(50, availableTokens));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const TOKEN_PRICE_USD = 8.40;
  const LTV_RATIO = 0.60;
  const INTEREST_RATE = 0.08;

  const totalValueUsd = pachaToLock * TOKEN_PRICE_USD;
  const maxBorrowUsd = totalValueUsd * LTV_RATIO;
  const monthlyInterestUsd = (maxBorrowUsd * INTEREST_RATE) / 12;

  const handleBorrow = async () => {
    if (pachaToLock <= 0 || pachaToLock > availableTokens) {
      setMessage({ type: "error", text: "Cantidad de tokens inválida o saldo insuficiente." });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/collateral/borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pachaAmount: pachaToLock,
          borrowUsd: Number(maxBorrowUsd.toFixed(2)),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al solicitar el préstamo");

      setMessage({
        type: "success",
        text: `¡Préstamo aprobado! Has recibido $${maxBorrowUsd.toFixed(2)} USD en tu saldo disponible. Tus ${pachaToLock} fracciones PACHA quedan custodiadas en garantía.`,
      });

      if (onLoanUpdated) onLoanUpdated();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Error al solicitar el préstamo";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MissionCard className="space-y-6 border-pn-gold/30 bg-gradient-to-br from-pn-surface/90 via-pn-surface to-pn-surface/95">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pn-border/50 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-pn-text-primary tracking-wide">
              Hipotecar Tokens / Préstamos con Garantía Real
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pn-gold/20 text-pn-gold border border-pn-gold/40">
              LTV Máx: 60%
            </span>
          </div>
          <p className="text-xs text-pn-text-muted mt-1">
            Obtén liquidez inmediata en USD dejando tus m² en custodia fiduciaria sin vender tu propiedad ni perder la plusvalía futura.
          </p>
        </div>
        <IntegrationStatusBadge
          status="SIMULATED"
        />
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg text-sm border flex items-start gap-3 ${
            message.type === "success"
              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
              : "bg-red-950/40 border-red-500/40 text-red-300"
          }`}
        >
          <span>{message.type === "success" ? "✓" : "⚠"}</span>
          <p>{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-pn-surface-variant/40 border border-pn-border/40 space-y-1">
          <span className="text-xs text-pn-text-muted">PACHA Disponibles para Hipotecar</span>
          <div className="text-2xl font-bold text-pn-text-primary">
            {availableTokens} <span className="text-xs font-normal text-pn-text-muted">({(availableTokens * 0.1).toFixed(1)} m²)</span>
          </div>
          <span className="text-[11px] text-pn-gold">Valorizado a $8.40 USD / token</span>
        </div>

        <div className="p-4 rounded-xl bg-pn-surface-variant/40 border border-pn-border/40 space-y-1">
          <span className="text-xs text-pn-text-muted">Tokens Actualmente en Garantía</span>
          <div className="text-2xl font-bold text-amber-400">
            {lockedTokens} <span className="text-xs font-normal text-pn-text-muted">({(lockedTokens * 0.1).toFixed(1)} m²)</span>
          </div>
          <span className="text-[11px] text-pn-text-muted">Custodia activa en Smart Contract</span>
        </div>

        <div className="p-4 rounded-xl bg-pn-surface-variant/40 border border-pn-border/40 space-y-1">
          <span className="text-xs text-pn-text-muted">Tasa de Interés Anual (APY)</span>
          <div className="text-2xl font-bold text-emerald-400">8.00%</div>
          <span className="text-[11px] text-emerald-400/80">Amortización libre sin penalidad</span>
        </div>
      </div>

      {availableTokens > 0 ? (
        <div className="p-5 rounded-xl bg-pn-surface-variant/30 border border-pn-border/60 space-y-5">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-pn-text-primary">Cantidad de Fracciones a Bloquear en Garantía:</span>
            <span className="text-pn-gold font-mono font-bold text-base">
              {pachaToLock} PACHA ({ (pachaToLock * 0.1).toFixed(1) } m²)
            </span>
          </div>

          <input
            type="range"
            min={1}
            max={availableTokens}
            value={pachaToLock}
            onChange={(e) => setPachaToLock(Number(e.target.value))}
            className="w-full h-2 bg-pn-surface-variant rounded-lg appearance-none cursor-pointer accent-pn-gold"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-center text-xs">
            <div className="p-2.5 rounded-lg bg-pn-surface border border-pn-border/30">
              <span className="text-pn-text-muted block">Valor del Colateral</span>
              <strong className="text-pn-text-primary text-sm">${totalValueUsd.toFixed(2)} USD</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
              <span className="text-emerald-400/90 block">Préstamo Máx. (60% LTV)</span>
              <strong className="text-emerald-400 text-sm font-mono">${maxBorrowUsd.toFixed(2)} USD</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-pn-surface border border-pn-border/30">
              <span className="text-pn-text-muted block">Interés Mensual Estimado</span>
              <strong className="text-pn-text-primary text-sm">${monthlyInterestUsd.toFixed(2)} USD</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-pn-surface border border-pn-border/30">
              <span className="text-pn-text-muted block">Plazo Sugerido</span>
              <strong className="text-pn-text-primary text-sm">6 Meses (Renovable)</strong>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <CommandButton
              variant="primary"
              onClick={handleBorrow}
              disabled={isSubmitting || pachaToLock <= 0}
              isLoading={isSubmitting}
              className="w-full sm:w-auto px-8"
            >
              {isSubmitting ? "Procesando Contrato Fiduciario..." : `Hipotecar y Recibir $${maxBorrowUsd.toFixed(2)} USD`}
            </CommandButton>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-xl bg-pn-surface-variant/20 border border-dashed border-pn-border text-center text-sm text-pn-text-muted">
          No tienes tokens PACHA disponibles para hipotecar. Adquiere fracciones en la venta Genesis o en el Mercado P2P para solicitar liquidez.
        </div>
      )}
    </MissionCard>
  );
}
