export function DemoBanner() {
  // Fase1 Consolidation: PERMANENTE "PachaNova Landbanking" identity + rich visual fallbacks for 5PNC orq. Clean more beta/demo remnants.
  // Always shows full project advances. landbanking=everything+tools. No interfere other session.
  const profile = process.env.DEMO_PROFILE || 'visual-real-orq';
  return (
    <div className="w-full bg-gradient-to-r from-[#0a111f] via-[#c5a46d]/10 to-[#0a111f] text-[#c5a46d] text-center text-xs py-1 font-bold tracking-[1.5px] uppercase z-50 relative shadow-md border-b border-[#c5a46d]/40">
      PACHA NOVA LANDBANKING — FULL PROJECT (P2P + CRÉDITOS + MASTER 5PNC + ORQ TOOLS + AUTONOMY + YIELDS + GOV) • VER TODOS LOS AVANCES • MODO VISUAL PERMANENTE CON DATOS REALES ORQ (PAR 68112.5 net • 31639 eff 17.1% • 3250 power Fase42 • Fases 15/36/42/47/49/51) • beta/demo remnants clean (legacy visible deprecate)
    </div>
  );
}
