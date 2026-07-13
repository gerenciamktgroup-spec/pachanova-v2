import { PrecisionNavbar } from "../../components/PrecisionNavbar";
import { PrecisionFooter } from "../../components/PrecisionFooter";

export default function ComoFuncionaPage() {
  return (
    <div className="min-h-screen bg-[#0a111f] text-white" data-testid="how-it-works-page">
      <PrecisionNavbar />

      <main className="max-w-4xl mx-auto px-8 pt-28 pb-20">
        <div className="max-w-2xl mb-14">
          <div className="text-[#c5a46d] text-xs tracking-[2.5px] mb-2">ARQUITECTURA</div>
          <h1 className="text-6xl tracking-[-2.2px] font-semibold leading-none mb-6">
            Cómo funciona<br />PachaNova
          </h1>
          <p className="text-lg text-white/65">
            El ciclo completo de un activo inmobiliario tokenizado: desde el respaldo legal hasta la participación del inversor.
          </p>
        </div>

        <div className="space-y-10 text-[15px] text-white/70 max-w-3xl" data-testid="how-it-works-steps">
          <div>
            <div className="font-semibold text-white mb-2 tracking-tight">1. Constitución del Fideicomiso</div>
            <p>Se formaliza un fideicomiso inmobiliario ante notario público sobre el predio de San Bartolo (inscrito en SUNARP). Tres fiduciarios profesionales son designados con poderes específicos.</p>
          </div>
          <div>
            <div className="font-semibold text-white mb-2 tracking-tight">2. Emisión de Tokens</div>
            <p>El terreno se fraccionaliza en 5.000.000 de tokens (cada uno = 0.1 m²). Los tokens representan derechos económicos y de gobernanza proporcionales dentro del fideicomiso.</p>
          </div>
          <div>
            <div className="font-semibold text-white mb-2 tracking-tight">3. Adquisición</div>
            <p>El inversor adquiere tokens a través de la plataforma (demo con Mercado Pago simulado). El pago se registra, se emite comprobante y el movimiento queda en el ledger del fideicomiso.</p>
          </div>
          <div>
            <div className="font-semibold text-white mb-2 tracking-tight">4. Gobernanza y Distribución</div>
            <p>Decisiones importantes requieren 2/3 de los fiduciarios. Los token holders tienen voz proporcional. Cualquier distribución de valor (venta futura, rentas) se reparte según participación.</p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-sm text-white/50">
          Este flujo está completamente reproducible en el entorno de demostración.
        </div>
      </main>

      <PrecisionFooter />
    </div>
  );
}
