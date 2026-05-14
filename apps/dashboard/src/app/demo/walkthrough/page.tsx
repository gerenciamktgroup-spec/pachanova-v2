import { MissionCard } from "@/components/mission/MissionCard";
import { TimelineRail, TimelineItem } from "@/components/mission/TimelineRail";
import { SectionHeader } from "@/components/mission/SectionHeader";
import { CommandButton } from "@/components/mission/CommandButton";
import Link from "next/link";

export default function WalkthroughPage() {
  const steps: TimelineItem[] = [
    {
      id: "step-1",
      title: "1. Activo Subyacente",
      description: (
        <div className="mt-2 space-y-2">
          <p className="text-sm text-pn-text-soft">Propiedad real (San Bartolo) vinculada a 5 ha / 50,000 m².</p>
          <div className="text-sm text-pn-text-soft" data-testid="walkthrough-step-asset">Se asume la existencia del activo real como capa 0.</div>
        </div>
      ),
      status: "completed" as const,
      time: "Demo Initialization"
    },
    {
      id: "step-2",
      title: "2. Tokenización Demo",
      description: (
        <div className="mt-2 space-y-2">
          <p className="text-sm text-pn-text-soft">Modelado lógico: 500,000 PACHA. Regla 1 PACHA = 0.1 m².</p>
          <div className="text-sm text-pn-text-soft" data-testid="walkthrough-step-tokenization">La base de datos local pre-inicializa la oferta total genesis simulada.</div>
        </div>
      ),
      status: "completed" as const,
      time: "Demo Configuration"
    },
    {
      id: "step-3",
      title: "3. Fideicomiso Demo",
      description: (
        <div className="mt-2 space-y-3" data-testid="walkthrough-step-fideicomiso">
          <p className="text-sm text-pn-text-soft">El control y respaldo legal operan de forma simulada. Trust anchor pendiente Foundry. Las operaciones multi-firma están habilitadas visualmente pero no generan impacto on-chain.</p>
          <Link href="/dashboard/fideicomiso">
            <CommandButton variant="outline">Ver Fideicomiso</CommandButton>
          </Link>
        </div>
      ),
      status: "pending" as const,
      time: "Pending Foundry"
    },
    {
      id: "step-4",
      title: "4. Inversor Demo",
      description: (
        <div className="mt-2 space-y-2">
          <p className="text-sm text-pn-text-soft">El inversor cuenta con estado KYC simulado (aprobado o pendiente).</p>
          <div className="text-sm text-pn-text-soft">Para modificar el estatus de inversor, utilizar el Control Room local.</div>
        </div>
      ),
      status: "completed" as const,
      time: "Sandbox Data"
    },
    {
      id: "step-5",
      title: "5. Genesis Demo",
      description: (
        <div className="mt-2 space-y-3">
          <p className="text-sm text-pn-text-soft">Módulo de preventa simulada. Precio fijado en US$8.40. MercadoPago desactivado por falta de credenciales. Botón de compra inicia simulación local.</p>
          <Link href="/dashboard/investor">
            <CommandButton variant="outline">Probar Investor Panel</CommandButton>
          </Link>
        </div>
      ),
      status: "pending" as const,
      time: "Pending Credentials"
    },
    {
      id: "step-6",
      title: "6. Ledger Local",
      description: (
        <div className="mt-2 space-y-2">
          <p className="text-sm text-pn-text-soft">Audit Logs y token_ledger locales habilitados.</p>
          <div className="text-sm text-pn-text-soft" data-testid="walkthrough-step-ledger">Todas las transacciones se almacenan localmente sin conexiones externas.</div>
        </div>
      ),
      status: "completed" as const,
      time: "Database Active"
    },
    {
      id: "step-7",
      title: "7. Pro-Rata Visual",
      description: (
        <div className="mt-2 space-y-2">
          <p className="text-sm text-pn-text-soft">Las visualizaciones 3D y de métricas demuestran la conversión.</p>
          <div className="text-sm text-pn-text-soft">Motor UI listo y funcionando en todos los dashboards.</div>
        </div>
      ),
      status: "completed" as const,
      time: "UI Engine Active"
    },
    {
      id: "step-8",
      title: "8. Readiness Externo",
      description: (
        <div className="mt-2 space-y-3" data-testid="walkthrough-step-readiness">
          <p className="text-sm text-pn-text-soft">Matriz de preparación para integraciones futuras. El entorno es external-ready pero disabled por defecto por seguridad.</p>
          <Link href="/demo/integrations">
            <CommandButton variant="primary">Abrir Matriz de Integraciones</CommandButton>
          </Link>
        </div>
      ),
      status: "current" as const,
      time: "Awaiting Action"
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8" data-testid="demo-walkthrough-page">
      <SectionHeader 
        title="Walkthrough de Plataforma" 
        description="Paso a paso funcional del entorno de demostración de PachaNova V2.0."
      />

      <MissionCard>
        <TimelineRail items={steps} />
      </MissionCard>
    </div>
  );
}
