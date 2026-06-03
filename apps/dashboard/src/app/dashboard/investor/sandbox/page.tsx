import React from 'react';
import { RouteBreadcrumbs } from "@/components/mission";
import { InteractiveYieldSandbox } from "./InteractiveYieldSandbox";

export const dynamic = 'force-dynamic';

export default function SandboxPage() {
  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Panel Inversor" },
          { label: "Yield Reinvestment Sandbox" }
        ]} />
      </div>
      
      <div className="p-4 border border-violet-900/50 rounded-xl bg-[#0a0b0f] text-sm">
        <div className="text-[#8a8f9a] tracking-widest font-bold text-xs mb-4">INTERACTIVE YIELD REINVESTMENT SANDBOX</div>
        <p className="text-zinc-400 mb-6 text-xs">
          Simula diferentes escenarios de apreciación de terrenos y tasas de préstamos para proyectar el flujo de caja dinámico de tu portafolio.
        </p>
        <InteractiveYieldSandbox />
      </div>
    </div>
  );
}
