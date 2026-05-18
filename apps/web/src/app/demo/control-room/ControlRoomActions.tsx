"use client";

import { useState } from "react";
import { CommandButton } from "@/components/mission/CommandButton";
import { useRouter } from "next/navigation";

export function KycSimulationActions({ targetInvestorId }: { targetInvestorId: string }) {
  const router = useRouter();
  const [kycLoading, setKycLoading] = useState<string | null>(null);
  const [kycMessage, setKycMessage] = useState("");

  const handleKycChange = async (status: "approved" | "pending") => {
    setKycLoading(status);
    setKycMessage("");
    try {
      const res = await fetch("/api/demo/actions/kyc-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          investorId: targetInvestorId,
          status,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setKycMessage(`KYC actualizado a "${status}" exitosamente.`);
        router.refresh();
      } else {
        setKycMessage(data.error ?? "Error al actualizar KYC.");
      }
    } catch {
      setKycMessage("Error de red.");
    } finally {
      setKycLoading(null);
    }
  };

  const handleTokenInjection = async () => {
    setKycLoading("tokens");
    setKycMessage("");
    try {
      const res = await fetch("/api/demo/actions/inject-tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          investorId: targetInvestorId,
          amount: 500,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setKycMessage(`500 PACHA inyectados exitosamente.`);
        router.refresh();
      } else {
        setKycMessage(data.error ?? "Error al inyectar tokens.");
      }
    } catch {
      setKycMessage("Error de red.");
    } finally {
      setKycLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg border border-pn-border bg-pn-surface-strong">
        <h4 className="text-sm font-medium text-pn-text mb-2">Investor KYC: Approved</h4>
        <p className="text-xs text-pn-text-soft mb-4">Simula que el inversor predeterminado (tu cuenta actual) ha sido aprobado para participar en la Genesis.</p>
        <CommandButton
          variant="outline"
          onClick={() => handleKycChange("approved")}
          disabled={kycLoading !== null || !targetInvestorId}
        >
          {kycLoading === "approved" ? "..." : "Simular Approved"}
        </CommandButton>
      </div>

      <div className="p-4 rounded-lg border border-pn-border bg-pn-surface-strong">
        <h4 className="text-sm font-medium text-pn-text mb-2">Investor KYC: Pending</h4>
        <p className="text-xs text-pn-text-soft mb-4">Simula que el inversor predeterminado (tu cuenta actual) sigue en evaluación.</p>
        <CommandButton
          variant="outline"
          onClick={() => handleKycChange("pending")}
          disabled={kycLoading !== null || !targetInvestorId}
        >
          {kycLoading === "pending" ? "..." : "Simular Pending"}
        </CommandButton>
      </div>

      <div className="p-4 rounded-lg border border-pn-border bg-pn-surface-strong">
        <h4 className="text-sm font-medium text-pn-text mb-2">Token Holder (500 PACHA)</h4>
        <p className="text-xs text-pn-text-soft mb-4">Inyecta 500 tokens directamente al balance de tu cuenta actual para pruebas.</p>
        <CommandButton
          variant="outline"
          onClick={handleTokenInjection}
          disabled={kycLoading !== null || !targetInvestorId}
        >
          {kycLoading === "tokens" ? "..." : "Inyectar 500 PACHA"}
        </CommandButton>
      </div>

      {kycMessage && (
        <p className="text-xs text-pn-gold mt-2 font-medium">{kycMessage}</p>
      )}
    </div>
  );
}
