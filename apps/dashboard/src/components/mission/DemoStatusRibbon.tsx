'use client';

import { AlertTriangle } from "lucide-react";

export function DemoStatusRibbon() {
  return (
    <div className="flex w-full items-center justify-center gap-2 bg-[#c5a46d]/10 border-b border-[#c5a46d]/20 px-4 py-1.5 text-xs font-medium text-[#c5a46d]" data-testid="demo-status-ribbon">
      <AlertTriangle className="h-3.5 w-3.5" />
      <span>PACHANOVA LANDBANKING — FULL PROJECT (everything + tools) • MODO VISUAL / DATOS REALES 5PNC ORQ (PAR net 68112.5 eff 31639 17.1% power 3250 Fases Master) • beta/demo remnants deprecate visible (legacy compat only)</span>
    </div>
  );
}
