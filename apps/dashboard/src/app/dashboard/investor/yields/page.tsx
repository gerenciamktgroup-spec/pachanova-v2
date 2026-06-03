import { Suspense } from "react";
import { RouteBreadcrumbs, LoadingState } from "@/components/mission";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { schema } from "@pachanova/database";
import { createServerClient } from "@/utils/supabase/server";
import YieldDistributionsClient from "./YieldDistributionsClient";

export const dynamic = "force-dynamic";

async function YieldsContent() {
  let investorId = "";
  
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userEmail = user?.email || "investor@pachanova.local";

    const investor = await db.query.investors.findFirst({
      where: eq(schema.investors.email, userEmail),
    });

    investorId = investor?.id || "";
  } catch (e) {
    console.error("[yields page]", e);
  }

  return (
    <div className="space-y-6">
      <div className="p-4 bg-gradient-to-r from-emerald-950/40 to-[#0a111f] border border-emerald-500/20 rounded-xl">
        <div className="text-xs text-emerald-400/70 uppercase tracking-wider mb-1">
          Sistema de Distribución de Rendimientos — Pachanova Land Banking
        </div>
        <div className="text-sm text-white/60">
          Aquí puedes reclamar tus rendimientos acumulados de los activos en tu portafolio 
          o reinvertirlos directamente para componer tu posición. Cada distribución está 
          respaldada por una prueba on-chain.
        </div>
      </div>
      
      {!investorId ? (
        <div className="text-center py-12 text-white/40">
          <div className="text-3xl mb-3">🔐</div>
          <div>Debes iniciar sesión para ver tus rendimientos.</div>
          <a
            href="/login"
            className="inline-block mt-4 px-4 py-2 bg-[#c5a46d]/10 border border-[#c5a46d]/30 text-[#c5a46d] text-sm rounded-lg"
          >
            Iniciar sesión
          </a>
        </div>
      ) : (
        <YieldDistributionsClient investorId={investorId} />
      )}
    </div>
  );
}

export default function InvestorYieldsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <RouteBreadcrumbs
          items={[
            { label: "Dashboard" },
            { label: "Panel Inversor", href: "/dashboard/investor" },
            { label: "Mis Rendimientos" },
          ]}
        />
        <div className="flex gap-2">
          <a
            href="/dashboard/investor"
            className="text-xs border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg text-white/50 hover:text-white transition-colors"
          >
            ← Mi Portafolio
          </a>
          <a
            href="/dashboard/investor/marketplace"
            className="text-xs bg-[#c5a46d]/10 border border-[#c5a46d]/30 text-[#c5a46d] px-3 py-1.5 rounded-lg hover:bg-[#c5a46d]/20 transition-colors"
          >
            Ver Marketplace →
          </a>
        </div>
      </div>

      <div className="bg-[#0a111f] min-h-screen text-white rounded-2xl border border-white/10 p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            💎 Mis Rendimientos
          </h1>
          <p className="text-white/50">
            Historial completo de distribuciones de yield por activo tokenizado.
            Reclama o reinvierte tus ganancias con un solo click.
          </p>
        </div>

        <Suspense fallback={<LoadingState message="Cargando rendimientos..." />}>
          <YieldsContent />
        </Suspense>
      </div>
    </div>
  );
}
