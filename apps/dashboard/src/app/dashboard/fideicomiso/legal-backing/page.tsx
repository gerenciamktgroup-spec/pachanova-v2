import { RouteBreadcrumbs, SectionHeader, MissionCard } from "@/components/mission";

export default function FideicomisoLegalBackingPage() {
  return (
    <div className="space-y-8 pb-24">
      <div>
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Fideicomiso", href: "/dashboard/fideicomiso" },
          { label: "Respaldo Legal" }
        ]} className="mb-4" />
        <SectionHeader 
          eyebrow="Activo Subyacente"
          title="Detalle del Respaldo Fiduciario"
          description="Información detallada del fideicomiso estructurado para PachaNova V2.0."
        />
      </div>

      <MissionCard title="Propiedad San Bartolo">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-4">
            <div>
              <h4 className="text-pn-text-soft mb-1">Inmueble</h4>
              <p className="text-pn-text">Fundo San Bartolo Lote B</p>
            </div>
            <div>
              <h4 className="text-pn-text-soft mb-1">Superficie Total</h4>
              <p className="text-pn-text">50,000 m² (5 Hectáreas)</p>
            </div>
            <div>
              <h4 className="text-pn-text-soft mb-1">Entidad Fiduciaria</h4>
              <p className="text-pn-text">PachaNova Trust Demo Corp.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-pn-text-soft mb-1">Emisión Autorizada Genesis</h4>
              <p className="text-pn-text">500,000 PACHA</p>
            </div>
            <div>
              <h4 className="text-pn-text-soft mb-1">Pro-Rata</h4>
              <p className="text-pn-text">1 PACHA = 0.1 m²</p>
            </div>
            <div>
              <h4 className="text-pn-text-soft mb-1">Estado de Contratos</h4>
              <p className="text-pn-warning">Pending Foundry (Simulado Localmente)</p>
            </div>
          </div>
        </div>
      </MissionCard>
    </div>
  );
}
