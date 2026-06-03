import { RouteBreadcrumbs } from "@/components/mission";

export default function PartnerSuccessPage() {
  return (
    <div className="space-y-6">
      <RouteBreadcrumbs items={[
        { label: 'Portal de Socios' }, 
        { label: 'Propuesta Recibida' }
      ]} />
      
      <div className="bg-[#0a111f] min-h-[50vh] text-white rounded-2xl border border-white/10 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-[#c5a46d]/20 rounded-full flex items-center justify-center mb-6">
          <span className="text-3xl">✅</span>
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-white mb-4">¡Propuesta Recibida Exitosamente!</h2>
        <p className="text-white/60 max-w-md mx-auto mb-8">
          Tu terreno ha sido registrado en el pool de revisión de PachaNova Landbanking. Nuestro equipo maestro lo evaluará y se pondrá en contacto contigo.
        </p>
        <a href="/dashboard/investor" className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors">
          Volver al Inicio
        </a>
      </div>
    </div>
  );
}
