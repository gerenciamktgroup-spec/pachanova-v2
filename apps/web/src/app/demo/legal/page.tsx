import { RouteBreadcrumbs, SectionHeader, MissionCard } from "@/components/mission";

export default function DemoLegalPage() {
  return (
    <div className="space-y-8 pb-24">
      <div>
        <RouteBreadcrumbs items={[
          { label: "Demo" },
          { label: "Portal Legal" }
        ]} className="mb-4" />
        <SectionHeader 
          eyebrow="Compliance"
          title="Portal Legal Demo"
          description="Reglas y Disclaimers del Sandbox."
        />
      </div>

      <MissionCard title="Términos del Entorno Simulado">
        <div className="prose prose-invert prose-sm max-w-none space-y-4 text-pn-text-muted">
          <p>
            PachaNova V2.0 en su versión <strong>Demo Mirror</strong> opera estrictamente bajo las siguientes directivas:
          </p>
          <ul className="list-disc pl-4 space-y-2">
            <li><strong>Cero Conexión Externa:</strong> Ninguna mutación ejecutada en esta interfaz tendrá impacto sobre bases de datos de producción (Neon, Cloud SQL, Supabase).</li>
            <li><strong>No Intermediación Financiera:</strong> Todas las visualizaciones referentes a USD, pagos o balances son puramente simulativas.</li>
            <li><strong>Activos RWA (Real World Assets):</strong> La conexión on-chain al TrustAnchor está bloqueada y operando bajo el supuesto de &quot;Pending Foundry&quot;.</li>
            <li><strong>Prohibición de Rentabilidad:</strong> Este software es una maqueta operativa. No garantiza, promueve ni asegura ninguna tasa de rentabilidad o &quot;ausencia de riesgo&quot;.</li>
          </ul>
        </div>
      </MissionCard>
    </div>
  );
}
