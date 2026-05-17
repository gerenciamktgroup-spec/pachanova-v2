import { RouteBreadcrumbs } from "@/components/mission/RouteBreadcrumbs";
import { SectionHeader } from "@/components/mission/SectionHeader";
import { MissionCard } from "@/components/mission/MissionCard";
import { SafeActionButton } from "@/components/mission/SafeActionButton";

export default function InvestorDisclosuresPage() {
  return (
    <div className="space-y-8 pb-24">
      <div>
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Panel Inversor", href: "/dashboard/investor" },
          { label: "Disclaimers" }
        ]} className="mb-4" />
        <SectionHeader 
          eyebrow="Legal & Compliance"
          title="Disclaimers del Entorno Demo"
          description="Términos, límites y estado simulado de PachaNova V2.0."
        />
      </div>

      <MissionCard title="Límites de la Simulación">
        <div className="prose prose-invert prose-sm max-w-none space-y-4 text-pn-text-muted">
          <p>
            El entorno en el que te encuentras es un <strong>Sandbox Local</strong> diseñado puramente para demostración de arquitectura tecnológica y flujos UI/UX institucionales.
          </p>
          <ul className="list-disc pl-4 space-y-2">
            <li><strong>No existen conexiones de producción:</strong> Todas las bases de datos (Neon, Cloud SQL, etc.) están desconectadas explícitamente mediante guards de seguridad.</li>
            <li><strong>No se transa con activos reales:</strong> Cualquier mención a &quot;US$&quot;, tokens, adquisiciones o saldos, corresponden a variables locales simuladas.</li>
            <li><strong>Cero riesgo:</strong> No se solicitan credenciales productivas de MercadoPago u oráculos reales.</li>
            <li><strong>Sin promesas financieras:</strong> Este producto no garantiza rentabilidades de ningún tipo. Es una demostración de software.</li>
          </ul>
        </div>
      </MissionCard>
      
      <div className="flex justify-end mt-4">
        <SafeActionButton label="Volver" href="/dashboard/investor" variant="ghost" />
      </div>
    </div>
  );
}
