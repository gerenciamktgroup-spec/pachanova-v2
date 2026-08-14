"use client";

import React, { useState } from "react";
import { MissionCard } from "@/components/mission";

export function ProjectBreakdownCard() {
  const [activeTab, setActiveTab] = useState<"economics" | "milestones" | "yields">("economics");

  const milestones = [
    { name: "1. Adquisición del Terreno Matriz", cost: "$1,200,000 USD", status: "Completado & Custodiado", verified: true },
    { name: "2. Habilitación Urbana & Licencias", cost: "$450,000 USD", status: "Completado", verified: true },
    { name: "3. Cimentación & Estructura Principal", cost: "$1,800,000 USD", status: "En Ejecución (Fase Multi-sig)", verified: true },
    { name: "4. Preventa de Unidades & Mercado P2P", cost: "$3,600,000 USD", status: "Abierto al Público", verified: true },
    { name: "5. Entrega de Departamentos & Reparto de Rentas", cost: "Dividendos Continuos", status: "Proyectado Q4", verified: false },
  ];

  return (
    <MissionCard className="space-y-6 bg-pn-surface/95 border-pn-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pn-border/50 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-pn-text-primary tracking-wide">
              Estructura Económica & Modelo de Negocio del Proyecto
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              San Bartolo Matriz
            </span>
          </div>
          <p className="text-xs text-pn-text-muted mt-1">
            Transparencia total en costos de adquisición, presupuesto de obra, fraccionamiento unitario y reparto fiduciario de utilidades.
          </p>
        </div>

        <div className="flex gap-1.5 p-1 rounded-lg bg-pn-surface-variant/60 border border-pn-border/50">
          <button
            onClick={() => setActiveTab("economics")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === "economics" ? "bg-pn-gold text-pn-background shadow" : "text-pn-text-muted hover:text-pn-text-primary"
            }`}
          >
            Unit Economics
          </button>
          <button
            onClick={() => setActiveTab("milestones")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === "milestones" ? "bg-pn-gold text-pn-background shadow" : "text-pn-text-muted hover:text-pn-text-primary"
            }`}
          >
            Hitos Fiduciarios
          </button>
          <button
            onClick={() => setActiveTab("yields")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === "yields" ? "bg-pn-gold text-pn-background shadow" : "text-pn-text-muted hover:text-pn-text-primary"
            }`}
          >
            Vías de Retorno
          </button>
        </div>
      </div>

      {activeTab === "economics" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-pn-surface-variant/30 border border-pn-border/40">
              <span className="text-[11px] text-pn-text-muted block">Área Total del Suelo</span>
              <strong className="text-base text-pn-text-primary">50,000 m²</strong>
              <span className="text-[10px] text-pn-gold block">Lote Matriz Registrado</span>
            </div>
            <div className="p-3 rounded-xl bg-pn-surface-variant/30 border border-pn-border/40">
              <span className="text-[11px] text-pn-text-muted block">Fraccionamiento Total</span>
              <strong className="text-base text-pn-text-primary">500,000 PACHA</strong>
              <span className="text-[10px] text-pn-text-muted block">1 Token = 0.1 m²</span>
            </div>
            <div className="p-3 rounded-xl bg-pn-surface-variant/30 border border-pn-border/40">
              <span className="text-[11px] text-pn-text-muted block">Precio Ticket Entrada</span>
              <strong className="text-base text-emerald-400 font-mono">$8.40 USD</strong>
              <span className="text-[10px] text-emerald-400/80 block">Genesis Allocation</span>
            </div>
            <div className="p-3 rounded-xl bg-pn-surface-variant/30 border border-pn-border/40">
              <span className="text-[11px] text-pn-text-muted block">Valor Estimado en Entrega</span>
              <strong className="text-base text-pn-gold font-mono">$12.00 USD / token</strong>
              <span className="text-[10px] text-pn-gold/80 block">+42.8% Plusvalía Proyectada</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-pn-surface-variant/20 border border-pn-border/40 text-xs text-pn-text-muted space-y-2">
            <h4 className="font-bold text-pn-text-primary text-sm">¿Cómo se compone el valor?</h4>
            <p>
              El capital recaudado se deposita directamente en el <strong>Fideicomiso Bancario (SBS)</strong> y se libera únicamente conforme el Comité Técnico y la Fiduciaria verifican el avance real de la obra y saneamiento legal.
            </p>
          </div>
        </div>
      )}

      {activeTab === "milestones" && (
        <div className="space-y-3">
          {milestones.map((m, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-pn-surface-variant/30 border border-pn-border/40 text-xs">
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${m.verified ? "bg-emerald-400" : "bg-amber-400"}`} />
                <div>
                  <span className="font-semibold text-pn-text-primary block text-sm">{m.name}</span>
                  <span className="text-pn-text-muted">{m.status}</span>
                </div>
              </div>
              <div className="text-right">
                <strong className="font-mono text-pn-text-primary text-xs">{m.cost}</strong>
                <span className="text-[10px] text-emerald-400 block">{m.verified ? "Multi-sig Verificado" : "Pendiente"}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "yields" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-pn-surface-variant/30 border border-pn-border/40 space-y-2">
            <div className="text-pn-gold font-bold text-sm">1. Plusvalía por Venta</div>
            <p className="text-xs text-pn-text-muted">
              Al venderse las unidades o departamentos construidos, los fondos netos ingresan al fideicomiso y se liquidan proporcionalmente a cada titular de tokens PACHA.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-pn-surface-variant/30 border border-pn-border/40 space-y-2">
            <div className="text-emerald-400 font-bold text-sm">2. Dividendos por Alquiler</div>
            <p className="text-xs text-pn-text-muted">
              Las unidades conservadas para arrendamiento generan un flujo mensual recurrente en moneda estable distribuido automáticamente mediante el <em>Yield Engine</em>.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-pn-surface-variant/30 border border-pn-border/40 space-y-2">
            <div className="text-blue-400 font-bold text-sm">3. Liquidez Inmediata P2P</div>
            <p className="text-xs text-pn-text-muted">
              No necesitas esperar al final del proyecto: puedes transferir o vender tus fracciones en el mercado secundario o pedir un préstamo hipotecando tus tokens.
            </p>
          </div>
        </div>
      )}
    </MissionCard>
  );
}
