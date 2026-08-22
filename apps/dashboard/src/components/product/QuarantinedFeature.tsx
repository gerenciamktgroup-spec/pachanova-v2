import Link from "next/link";

type QuarantinedFeatureProps = {
  title: string;
  summary: string;
  backHref?: string;
  backLabel?: string;
};

export function QuarantinedFeature({
  title,
  summary,
  backHref = "/dashboard/investor",
  backLabel = "Volver al panel",
}: QuarantinedFeatureProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 relative overflow-hidden text-white">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-md w-full text-center relative z-10 p-8 rounded-3xl border border-white/10 bg-[#0f172a]/80 backdrop-blur-xl shadow-2xl">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#c5a46d] mb-3">Cuarentena de alcance</p>
        <h2 className="text-2xl font-bold text-[#c5a46d] tracking-tight mb-2">{title}</h2>
        <p className="text-sm text-white/60 mb-6 leading-relaxed">{summary}</p>
        <p className="text-xs text-white/40 mb-6 leading-relaxed">
          Tokenización, RWA on-chain, P2P de fracciones, staking, DeFi y gobernanza DAO están fuera de esta etapa.
          El producto activo es cofinanciamiento inmobiliario con trazabilidad.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#c5a46d] mb-6">
          <span className="w-2 h-2 rounded-full bg-[#c5a46d]" />
          POSPUESTO • NO BORRADO
        </div>
        <div>
          <Link
            href={backHref}
            className="text-sm text-white/70 hover:text-white underline underline-offset-4"
          >
            {backLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
