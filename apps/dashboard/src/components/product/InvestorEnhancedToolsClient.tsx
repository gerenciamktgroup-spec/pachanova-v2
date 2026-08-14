"use client";

import React, { useState } from "react";
import { CollateralLoanPanel } from "./CollateralLoanPanel";
import { ProjectBreakdownCard } from "./ProjectBreakdownCard";
import { DigitalDeedModal } from "./DigitalDeedModal";
import { CommandButton } from "@/components/mission";

interface InvestorEnhancedToolsClientProps {
  availableTokens: number;
  lockedTokens: number;
  availableUsd: number;
  investorEmail: string;
}

export function InvestorEnhancedToolsClient({
  availableTokens,
  lockedTokens,
  availableUsd,
  investorEmail,
}: InvestorEnhancedToolsClientProps) {
  const [isDeedModalOpen, setIsDeedModalOpen] = useState(false);
  const [tokens, setTokens] = useState(availableTokens);
  const [locked, setLocked] = useState(lockedTokens);
  const [usd, setUsd] = useState(availableUsd);

  const handleRefresh = () => {
    // Optimistically adjust or refresh
    setTokens((prev) => Math.max(0, prev - 25));
    setLocked((prev) => prev + 25);
    setUsd((prev) => prev + 126);
  };

  return (
    <div className="space-y-8">
      {/* Banner de Título de Co-Propiedad Oficial */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-pn-gold/20 via-pn-surface to-pn-surface-variant/40 border border-pn-gold/40 shadow-lg">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span className="text-pn-gold text-lg">📜</span>
            <h4 className="font-bold text-pn-text-primary text-base">
              Certificado Digital de Título y Co-Propiedad SUNARP
            </h4>
          </div>
          <p className="text-xs text-pn-text-muted">
            Partida Registral N° PROV-2025-08-11742 • Respaldo Fiduciario SBS • Sello Criptográfico Inmutable
          </p>
        </div>

        <CommandButton
          variant="primary"
          onClick={() => setIsDeedModalOpen(true)}
          className="w-full sm:w-auto px-6 whitespace-nowrap"
        >
          Ver Certificado Oficial
        </CommandButton>
      </div>

      {/* Estructura Económica y Desglose de Costes del Edificio/Terreno */}
      <ProjectBreakdownCard />

      {/* Módulo de Préstamos e Hipoteca de Tokens */}
      <CollateralLoanPanel
        availableTokens={tokens}
        lockedTokens={locked}
        availableUsd={usd}
        onLoanUpdated={handleRefresh}
      />

      {/* Modal Oficial de Título Fiduciario */}
      <DigitalDeedModal
        isOpen={isDeedModalOpen}
        onClose={() => setIsDeedModalOpen(false)}
        investorEmail={investorEmail}
      />
    </div>
  );
}
