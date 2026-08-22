import { RouteBreadcrumbs } from "@/components/mission";

export const dynamic = "force-dynamic";

export default async function ClientHomePage() {

  return (
    <div className="space-y-8 pb-16">
      <RouteBreadcrumbs items={[{ label: "Dashboard" }, { label: "Cliente" }]} />

      <div className="rounded-3xl border border-white/10 bg-[#0a111f] p-8 text-white">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#c5a46d] mb-3">
          Rol cliente · comprador o arrendatario
        </p>
        <h1 className="text-3xl font-light tracking-tight mb-3">
          Tu operación inmobiliaria
        </h1>
        <p className="text-white/60 max-w-2xl leading-relaxed">
          Este panel es para quien compra un lote o una unidad, o arrienda un inmueble
          del proyecto. No es el panel del inversor. El inversor cofinancia; vos
          reservás, contratás y pagás el producto final.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            title: "Ofertas",
            body: "Lotes de landbanking, departamentos en venta y unidades en alquiler publicados por el administrador.",
            phase: "Fase 5",
          },
          {
            title: "Reservas",
            body: "Separación de una unidad o lote, con plazo y estado.",
            phase: "Fase 5",
          },
          {
            title: "Contratos",
            body: "Minuta, compraventa o arrendamiento de tu operación. El cap table de inversores no se muestra aquí.",
            phase: "Fase 5",
          },
          {
            title: "Pagos y entrega",
            body: "Cuotas, iniciales, renta y estado de escrituración o entrega.",
            phase: "Fase 5",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-medium">{item.title}</h2>
              <span className="text-[10px] uppercase tracking-wider text-white/40 border border-white/10 rounded-full px-2 py-0.5">
                {item.phase}
              </span>
            </div>
            <p className="text-sm text-white/55 leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
