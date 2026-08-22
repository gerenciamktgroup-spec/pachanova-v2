import { RouteBreadcrumbs } from "@/components/mission";
import ProjectOps from "./ProjectOps";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return (
    <div className="space-y-6">
      <RouteBreadcrumbs items={[{ label: "Admin" }, { label: "Proyectos", href: "/dashboard/admin/landbank" }, { label: code }]} />
      <div className="bg-[#0a111f] text-white rounded-2xl border border-white/10 p-6 md:p-8">
        <Link href="/dashboard/admin/landbank" className="text-xs text-white/40 hover:text-white">← Todos los proyectos</Link>
        <h2 className="text-2xl font-bold tracking-tight mt-3 mb-1">{code}</h2>
        <p className="text-sm text-white/50 mb-6">Operación del proyecto: ronda, documentos, hitos, aportes y ofertas.</p>
        <ProjectOps code={code.toUpperCase()} />
      </div>
    </div>
  );
}
