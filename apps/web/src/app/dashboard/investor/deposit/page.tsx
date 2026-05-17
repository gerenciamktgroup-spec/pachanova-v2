export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import { RouteBreadcrumbs } from "@/components/mission/RouteBreadcrumbs";
import { SectionHeader } from "@/components/mission/SectionHeader";
import { MissionCard } from "@/components/mission/MissionCard";
import { CommandButton } from "@/components/mission/CommandButton";
import { LoadingState } from "@/components/mission/StateComponents";
import { NextStepCard } from "@/components/product/NextStepCard";
import { JourneyProgressRail } from "@/components/product/JourneyProgressRail";
import { investorJourney } from "@/lib/navigation/userJourneys";
import Link from "next/link";

function DepositContent() {
  const simulatedBalance = {
    availableUsd: "15,000.00",
    depositedToday: "5,000.00",
  };

  return (
    <div className="space-y-8 pb-24 max-w-3xl mx-auto">
      <RouteBreadcrumbs items={[
        { label: "Dashboard" },
        { label: "Inversor", href: "/dashboard/investor" },
        { label: "Depósito" },
      ]} />

      <SectionHeader
        eyebrow="Paso 3 — Fondeo"
        title="Depositar fondos simulados"
        description="Acá simularías una transferencia bancaria o un pago con MercadoPago. En el demo, los fondos se acreditan automáticamente."
      />

      <JourneyProgressRail journey={investorJourney} currentStepId="i3" />

      <NextStepCard
        dataTestId="next-step-deposit"
        contextLabel="Depósito Simulado"
        title="Fondeo instantáneo para demo"
        explanation="En producción, el inversor haría una transferencia bancaria o usaría MercadoPago Checkout Pro. El monto se acredita al balance después de confirmación del webhook. En este demo, el fondeo es instantáneo."
        nextStep="Después de fondear, podés ir a la ronda Genesis para comprar tokens PACHA."
        primaryAction={{ label: "Ir a Genesis", href: "/dashboard/investor/genesis", intent: "navigate" }}
        secondaryAction={{ label: "Ver mi balance", href: "/dashboard/investor", intent: "navigate" }}
        status="GO"
      />

      <MissionCard title="Simulación de depósito">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-pn-surface-strong border border-pn-border">
              <p className="text-xs text-pn-text-muted mb-1">Balance disponible</p>
              <p className="text-xl font-bold text-pn-success">USD {simulatedBalance.availableUsd}</p>
            </div>
            <div className="p-4 rounded-lg bg-pn-surface-strong border border-pn-border">
              <p className="text-xs text-pn-text-muted mb-1">Depositado hoy</p>
              <p className="text-xl font-bold text-pn-gold">USD {simulatedBalance.depositedToday}</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-pn-success/5 border border-pn-success/20">
            <p className="text-sm text-pn-success font-medium">✅ Fondos simulados acreditados</p>
            <p className="text-xs text-pn-text-muted mt-1">
              En producción, este paso requiere confirmación de MercadoPago vía webhook.
              En el demo, los fondos ya están disponibles en tu balance.
            </p>
          </div>

          <div className="flex gap-3">
            <Link href="/dashboard/investor/genesis" className="flex-1">
              <CommandButton variant="primary" fullWidth>Comprar tokens PACHA →</CommandButton>
            </Link>
            <Link href="/dashboard/investor" className="flex-1">
              <CommandButton variant="outline" fullWidth>Ver portafolio</CommandButton>
            </Link>
          </div>
        </div>
      </MissionCard>
    </div>
  );
}

export default function DepositPage() {
  return (
    <Suspense fallback={<LoadingState message="Cargando simulador de depósito..." />}>
      <DepositContent />
    </Suspense>
  );
}
