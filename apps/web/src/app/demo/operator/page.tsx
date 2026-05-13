import { MissionCard } from "@/components/mission/MissionCard";
import { SectionHeader } from "@/components/mission/SectionHeader";
import { CommandButton } from "@/components/mission/CommandButton";
import { AlertTriangle, Terminal, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { NextStepCard } from "@/components/product/NextStepCard";

export default function OperatorPage() {
  return (
    <div className="space-y-8" data-testid="demo-operator-page">
      <SectionHeader 
        title="Operator Console" 
        description="Consola de herramientas locales. Comandos recomendados para mantener y auditar el entorno PachaNova V2.0 Demo Mirror."
      />

      <NextStepCard 
        contextLabel="Operador Demo"
        title="Control del Sandbox"
        explanation="Estás en la consola de operador. Aquí puedes revisar el estado técnico de los componentes o inyectar escenarios para facilitar la demostración de la plataforma."
        nextStep="Abre la página de Escenarios para inyectar datos simulados (como aprobación de KYC o saldos) antes de iniciar un flujo."
        primaryAction={{ label: "Abrir Escenarios", href: "/demo/scenarios", intent: "navigate" }}
        secondaryAction={{ label: "Volver al Showcase", href: "/demo/showcase", intent: "navigate" }}
        status="GO"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <MissionCard title="Comandos de Host Sugeridos" data-testid="operator-command-list">
            <div className="space-y-4 font-mono text-xs">
              <div className="flex justify-between items-center p-3 rounded bg-pn-surface-strong border border-pn-border">
                <span className="text-pn-text">pnpm demo:doctor</span>
                <span className="text-pn-text-soft">Valida dependencias y puertos</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded bg-pn-surface-strong border border-pn-border">
                <span className="text-pn-text">pnpm demo:up</span>
                <span className="text-pn-text-soft">Levanta Docker DB Local</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded bg-pn-surface-strong border border-pn-border">
                <span className="text-pn-text">pnpm demo:reset</span>
                <span className="text-pn-text-soft">Pushea Drizzle Schema y Seed</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded bg-pn-surface-strong border border-pn-border">
                <span className="text-pn-text">pnpm test:e2e:demo</span>
                <span className="text-pn-text-soft">Verifica Frontend (Playwright)</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded bg-pn-surface-strong border border-pn-border">
                <span className="text-pn-text">pnpm demo:export-report</span>
                <span className="text-pn-text-soft">Genera paquete en artifacts/</span>
              </div>
            </div>
          </MissionCard>

          <MissionCard title="Safety Checklist Local" data-testid="operator-safety-checklist">
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-pn-text-soft">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Docker local activo
              </li>
              <li className="flex items-center gap-3 text-sm text-pn-text-soft">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Database corriendo en 5433
              </li>
              <li className="flex items-center gap-3 text-sm text-pn-text-soft">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Entorno aislado de producción
              </li>
              <li className="flex items-center gap-3 text-sm text-pn-warning">
                <AlertTriangle className="w-4 h-4" /> Sin credenciales MercadoPago
              </li>
              <li className="flex items-center gap-3 text-sm text-pn-warning">
                <AlertTriangle className="w-4 h-4" /> Sin contrato subyacente en Foundry
              </li>
            </ul>
          </MissionCard>
        </div>

        <div className="space-y-8">
          <MissionCard title="Quick Terminal Actions" data-testid="operator-quick-actions">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Link href="/demo/showcase">
                <CommandButton variant="primary" className="w-full justify-center">Abrir Showcase</CommandButton>
              </Link>
              <Link href="/demo/reports">
                <CommandButton variant="outline" className="w-full justify-center">Auditar Reportes</CommandButton>
              </Link>
              <Link href="/demo/integrations">
                <CommandButton variant="outline" className="w-full justify-center">Auditar Integraciones</CommandButton>
              </Link>
              <Link href="/demo/control-room">
                <CommandButton variant="outline" className="w-full justify-center">Ir al Control Room</CommandButton>
              </Link>
            </div>
            
            <div className="p-4 rounded-lg bg-pn-warning/10 border border-pn-warning/20">
              <h4 className="text-sm font-semibold text-pn-warning flex items-center gap-2 mb-2">
                <Terminal className="w-4 h-4" /> Restablecimiento Crítico
              </h4>
              <p className="text-xs text-pn-text-soft mb-4">
                Si la base de datos se corrompe, usa el botón a continuación (requiere endpoint) o corre `pnpm demo:reset` en tu consola.
              </p>
              <CommandButton variant="danger" disabled fullWidth>Force Demo Reset</CommandButton>
            </div>
          </MissionCard>
        </div>
      </div>
    </div>
  );
}
