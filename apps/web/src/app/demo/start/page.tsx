import Link from "next/link";
import { CommandButton, MissionCard, RouteBreadcrumbs, SectionHeader } from "@/components/mission";
import { DemoOnboardingModal } from "@/components/ui/DemoOnboardingModal";

export default function DemoStartPage() {
  return (
    <div className="space-y-12 pb-24 max-w-3xl mx-auto mt-12">
      <DemoOnboardingModal />
      <div>
        <RouteBreadcrumbs items={[{ label: "Demo" }, { label: "Start" }]} className="mb-4" />
        <SectionHeader 
          eyebrow="Guided Flow"
          title="Prueba PachaNova en 5 minutos"
          description="Este entorno es 100% sandbox. No usa dinero real ni activos reales."
        />
      </div>

      <div className="flex gap-4">
        <Link href="/signup" className="flex-1">
          <CommandButton variant="primary" fullWidth>Empezar demo</CommandButton>
        </Link>
        <Link href="/login" className="flex-1">
          <CommandButton variant="outline" fullWidth>Ya tengo cuenta</CommandButton>
        </Link>
      </div>

      <MissionCard title="Recorrido de la Demo">
        <div className="space-y-6 mt-4">
          <Step num={1} title="Crear cuenta demo" path="/signup" />
          <Step num={2} title="Completar onboarding" path="/dashboard/investor/onboarding" />
          <Step num={3} title="Depositar fondos simulados" path="/dashboard/investor/onboarding" />
          <Step num={4} title="Comprar tokens PACHA en Genesis" path="/dashboard/investor/genesis" />
          <Step num={5} title="Ver mi portfolio" path="/dashboard/investor" />
          <Step num={6} title="Operar en Marketplace P2P" path="/dashboard/investor/marketplace" />
          <Step num={7} title="Ver consola Admin demo" path="/dashboard/admin" />
        </div>
      </MissionCard>
    </div>
  );
}

function Step({ num, title, path }: { num: number, title: string, path: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 rounded-full bg-pn-surface-strong border border-pn-border flex items-center justify-center text-sm font-bold text-pn-gold shrink-0">
        {num}
      </div>
      <div>
        <h4 className="font-medium text-pn-text">{title}</h4>
        <Link href={path} className="text-xs text-pn-text-muted hover:text-pn-gold transition-colors">{path}</Link>
      </div>
    </div>
  );
}
