import { MissionCard } from "@/components/mission/MissionCard";
import { SectionHeader } from "@/components/mission/SectionHeader";
import { ReportLinkCard } from "@/components/mission/ReportLinkCard";

export default function ReportsPage() {
  const reports = [
    {
      title: "PROJECT INVENTORY & GAP ANALYSIS",
      path: "PROJECT_INVENTORY_AND_GAP_ANALYSIS.md",
      status: "GENERATED" as const,
      description: "Inventario exhaustivo de aplicaciones, paquetes y módulos pendientes de PachaNova V2.0.",
    },
    {
      title: "DEMO ACCEPTANCE REPORT",
      path: "DEMO_ACCEPTANCE_REPORT.md",
      status: "GENERATED" as const,
      description: "Reporte E2E y pruebas de integración para la validación funcional del Sandbox.",
    },
    {
      title: "INTEGRATION READINESS REPORT",
      path: "INTEGRATION_READINESS_REPORT.md",
      status: "GENERATED" as const,
      description: "Auditoría de preparación y credenciales faltantes para conectar con servicios externos.",
    },
    {
      title: "RELEASE CANDIDATE STATUS",
      path: "RELEASE_CANDIDATE_STATUS.md",
      status: "GENERATED" as const,
      description: "Declaración final del entorno Demo Local sin dependencias externas.",
    },
    {
      title: "FRONTEND MISSION CONTROL AUDIT",
      path: "FRONTEND_MISSION_CONTROL_AUDIT.md",
      status: "GENERATED" as const,
      description: "Inventario de diseño previo al refactor de Mission Control.",
    },
    {
      title: "FRONTEND APPSHELL IMPLEMENTATION",
      path: "FRONTEND_APPSHELL_IMPLEMENTATION_REPORT.md",
      status: "GENERATED" as const,
      description: "Reporte de la creación de la carcasa global para dashboards institucionales.",
    },
    {
      title: "DEMO OPERATOR RUNBOOK",
      path: "docs/DEMO_OPERATOR_RUNBOOK.md",
      status: "PLANNED" as const,
      description: "Manual de operador paso a paso para encender los servicios de PachaNova Demo.",
    }
  ];

  return (
    <div className="space-y-8" data-testid="demo-reports-page">
      <SectionHeader 
        title="Centro de Reportes y Evidencia" 
        description="Documentación auditada del Release Candidate actual. Todos los archivos se encuentran ubicados en el Workspace Local."
      />

      <MissionCard title="Índice de Artefactos" data-testid="reports-index">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {reports.map((report) => (
            <ReportLinkCard
              key={report.path}
              title={report.title}
              href={`#${report.path}`}
              desc={report.description}
            />
          ))}
        </div>
      </MissionCard>
    </div>
  );
}
