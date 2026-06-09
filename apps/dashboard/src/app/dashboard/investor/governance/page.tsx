export const dynamic = "force-dynamic";

export default function GovernancePage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 relative overflow-hidden text-white">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-md w-full text-center relative z-10 p-8 rounded-3xl border border-white/10 bg-[#0f172a]/80 backdrop-blur-xl shadow-2xl">
        <div className="text-4xl mb-4">⚖️</div>
        <h2 className="text-2xl font-bold text-[#c5a46d] tracking-tight mb-2">Gobernanza & Votaciones</h2>
        <p className="text-sm text-white/60 mb-6 leading-relaxed">
          Este módulo está siendo preparado para la versión definitiva de PachaNova V2.0.
          Permitirá a los inversores votar sobre propuestas de desarrollo inmobiliario reales con respaldo fiduciario.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#c5a46d]">
          <span className="w-2 h-2 rounded-full bg-[#c5a46d] animate-pulse"></span>
          MODO CONSULTA • PRÓXIMAMENTE
        </div>
      </div>
    </div>
  );
}
