"use client";

import React, { useState, useEffect } from "react";
import { CommandButton } from "@/components/mission";
import type { DigitalDeedCertificate } from "@/lib/deeds/certificateEngine";

interface DigitalDeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  investorEmail?: string;
}

export function DigitalDeedModal({ isOpen, onClose, investorEmail }: DigitalDeedModalProps) {
  const [cert, setCert] = useState<DigitalDeedCertificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch(`/api/certificates/generate?email=${encodeURIComponent(investorEmail || "demo.investor.holder@pachanova.local")}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.certificate) setCert(data.certificate);
        })
        .catch((err) => console.error("Error loading certificate:", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, investorEmail]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-pn-surface border-2 border-pn-gold/50 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 text-pn-text-primary">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-pn-text-muted hover:text-pn-text-primary text-xl font-bold p-1"
        >
          ✕
        </button>

        <div className="text-center space-y-1 border-b border-pn-border/60 pb-4">
          <span className="text-[11px] font-mono tracking-widest text-pn-gold uppercase block">
            República del Perú • Registro Fiduciario RWA
          </span>
          <h2 className="text-2xl font-serif font-bold text-pn-text-primary">
            Certificado de Participación Fiduciaria
          </h2>
          <p className="text-xs text-pn-text-muted">
            Acreditación Digital Inmutable de Co-Propiedad sobre el Patrimonio Autónomo
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-pn-text-muted animate-pulse">
            Generando sello criptográfico con anclaje SUNARP...
          </div>
        ) : cert ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-pn-surface-variant/40 border border-pn-border/40">
                <span className="text-pn-text-muted block text-[10px]">Titular Registrado</span>
                <strong className="text-pn-text-primary text-sm">{cert.investorName}</strong>
                <span className="text-[10px] text-pn-text-muted block">DNI: {cert.investorDniMasked}</span>
              </div>
              <div className="p-3 rounded-lg bg-pn-surface-variant/40 border border-pn-border/40">
                <span className="text-pn-text-muted block text-[10px]">Fracciones & Área</span>
                <strong className="text-pn-gold text-sm font-mono">{cert.tokenCount} PACHA</strong>
                <span className="text-[10px] text-emerald-400 block font-semibold">{cert.squareMetersEquivalent} m² Físicos</span>
              </div>
              <div className="p-3 rounded-lg bg-pn-surface-variant/40 border border-pn-border/40 col-span-2 sm:col-span-1">
                <span className="text-pn-text-muted block text-[10px]">Partida Registral SUNARP</span>
                <strong className="text-pn-text-primary text-sm font-mono">{cert.sunarpPartida}</strong>
                <span className="text-[10px] text-pn-text-muted block">SBS: {cert.fideicomisoSbsId}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-pn-surface-variant/20 border border-pn-gold/30 text-xs space-y-2">
              <div className="flex justify-between items-center text-[11px] text-pn-text-muted">
                <span>Inmueble: <strong>{cert.landbankLocation}</strong></span>
                <span>Fecha Emisión: <strong>{cert.issuanceDate}</strong></span>
              </div>
              <div className="text-[10px] text-pn-text-muted font-mono break-all pt-2 border-t border-pn-border/40">
                <span className="text-pn-gold font-semibold">Hash SHA-256 Ledger: </span>
                {cert.verificationHash}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-pn-border/50">
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Anclaje Registral Válido y Verificado</span>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <CommandButton
                  variant="primary"
                  onClick={() => alert("Descargando certificado oficial con firma criptográfica...")}
                  className="w-full sm:w-auto"
                >
                  Descargar Certificado PDF
                </CommandButton>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-pn-surface-variant text-pn-text-muted hover:text-pn-text-primary transition-all"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-sm text-red-400 py-8">
            No se pudo generar el certificado.
          </div>
        )}
      </div>
    </div>
  );
}
