import Link from "next/link";
import { MapPin, Coins, TrendingUp, Vote, Check, ArrowRight, Mountain, CheckCircle, Info } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";
import { FAQAccordion, faqData } from "@/components/ui/FAQAccordion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* ═══ NAV ═══ */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-xl tracking-tight text-slate-900">
              PACHA<span className="text-blue-700">NOVA</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm text-slate-600">
              <a href="#como-funciona" className="hover:text-blue-700 transition-colors">Cómo funciona</a>
              <a href="#activo" className="hover:text-blue-700 transition-colors">El activo</a>
              <a href="#faq" className="hover:text-blue-700 transition-colors">FAQ</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-600 hover:text-blue-700 transition-colors hidden sm:block">
              Iniciar sesión
            </Link>
            <Link href="/demo/start" className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
              Explorar Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ SECCIÓN 1: HERO ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 via-white to-white pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
          {/* Badge */}
          <div className="pn-animate-fade-up inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            <Mountain className="w-4 h-4" />
            RWA · Tierra Real Tokenizada · Perú 2024
          </div>

          {/* H1 — CAMBIO 4A */}
          <h1 className="pn-animate-fade-up delay-100 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 max-w-3xl mx-auto leading-tight">
            Tu primer metro cuadrado en Perú.
            <br />
            <span className="text-blue-700">Por $10.</span>
          </h1>

          {/* Sub — CAMBIO 4A */}
          <p className="pn-animate-fade-up delay-200 text-lg text-slate-600 max-w-xl mx-auto mb-10 leading-relaxed">
            Comprás una participación real sobre tierra verificada. Sin banco. Sin mínimos. Con respaldo legal notarial.
          </p>

          {/* CTAs */}
          <div className="pn-animate-fade-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link href="/demo/start" className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-colors flex items-center gap-2 shadow-lg shadow-blue-700/20">
              Explorar el Demo <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/demo/showcase" className="bg-white border-2 border-slate-300 hover:border-blue-400 text-slate-700 hover:text-blue-700 font-semibold px-8 py-3.5 rounded-xl text-base transition-all">
              Ver Showcase
            </Link>
          </div>

          {/* CAMBIO 4B — Trust badges */}
          <div className="pn-animate-fade-up delay-400 flex flex-wrap items-center justify-center gap-6 mb-16">
            <span className="flex items-center gap-1.5 text-sm text-slate-500">
              <CheckCircle className="w-4 h-4 text-green-500" /> Sin comisiones de entrada
            </span>
            <span className="flex items-center gap-1.5 text-sm text-slate-500">
              <CheckCircle className="w-4 h-4 text-green-500" /> Datos reales en la demo
            </span>
            <span className="flex items-center gap-1.5 text-sm text-slate-500">
              <CheckCircle className="w-4 h-4 text-green-500" /> No requiere registro
            </span>
          </div>

          {/* Stat cards — CAMBIO 4D con Tooltips */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <StatCard value="500,000 m²" label="Superficie tokenizada" tooltip="Total de metros cuadrados del Proyecto San Bartolo representados en tokens verificados." />
            <StatCard value="USD $10" label="Precio por token" tooltip="Precio fijo en la ronda Génesis. Cada token representa una fracción proporcional del fideicomiso." />
            <StatCard value="8.5% APY" label="Rendimiento estimado" tooltip="Proyección anual basada en valorización del activo. No garantizado. Ver disclaimer legal." />
            <StatCard value="2/3 Quórum" label="Gobernanza fiduciaria" tooltip="Toda operación mayor requiere firma de 2 de 3 fideicomisarios. Tu voto tiene peso legal real." />
          </div>
        </div>
      </section>

      {/* ═══ SECCIÓN SOCIAL PROOF — CAMBIO 4C ═══ */}
      <section className="bg-white border-y border-slate-100 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <ProofStat value="$5,000,000 USD" label="Valoración del activo San Bartolo" />
            <ProofStat value="47 inversores" label="En la ronda Génesis" />
            <ProofStat value="100%" label="Transacciones auditadas on-chain" />
            <ProofStat value="SUNARP" label="Registro público verificable" />
          </div>
          <p className="text-xs text-slate-400 text-center mt-8">
            Datos del Proyecto San Bartolo · Mayo 2026 · Simulación de demo
          </p>
        </div>
      </section>

      {/* ═══ SECCIÓN 2: CÓMO FUNCIONA — CAMBIO 4E ═══ */}
      <section id="como-funciona" className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-4">4 pasos. Sin tecnicismos.</h2>
          <p className="text-slate-500 text-center mb-16 max-w-lg mx-auto">Desde tu primera visita hasta el cobro de rendimientos, todo pasa en un solo lugar.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <StepCard num={1} icon={<MapPin className="w-6 h-6" />} title="Revisás antes de invertir un peso" desc="Revisás el dossier legal y la ubicación verificada." />
            <StepCard num={2} icon={<Coins className="w-6 h-6" />} title="Tu participación, en tokens" desc="Desde $10 USD por token. Sin montos mínimos prohibitivos." />
            <StepCard num={3} icon={<TrendingUp className="w-6 h-6" />} title="El activo trabaja por vos" desc="8.5% APY estimado sobre el valor del activo." />
            <StepCard num={4} icon={<Vote className="w-6 h-6" />} title="Tu voz tiene peso legal" desc="Quórum 2/3 en el fideicomiso. Liquidez P2P." />
          </div>
        </div>
      </section>

      {/* ═══ SECCIÓN EDUCACIONAL SANDBOX — CAMBIO 4H ═══ */}
      <section className="bg-slate-900 text-white py-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">Guía de Entorno: Modo Demo Sandbox</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Esta plataforma es un entorno de demostración interactivo diseñado para simular el ecosistema completo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div data-testid="landing-how-to-read-demo" className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 bg-blue-900/50 text-blue-400 rounded-xl flex items-center justify-center mb-6">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Cómo interpretar la Demo</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Todas las operaciones, saldos y tokens que ves son simulaciones aisladas que operan localmente en tiempo real sobre una base de datos segura y auditada.
              </p>
            </div>

            <div data-testid="landing-what-is-simulated" className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 bg-blue-900/50 text-blue-400 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Elementos Simulados</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                La adquisición de tokens Genesis, la carga de identidad (KYC), el saldo en USD y las transferencias P2P se guardan en el historial local para auditoría.
              </p>
            </div>

            <div data-testid="landing-what-connects-later" className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 bg-blue-900/50 text-blue-400 rounded-xl flex items-center justify-center mb-6">
                <Vote className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Conexiones Futuras</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Una vez activada la producción, esta infraestructura se conectará de manera transparente con las credenciales de MercadoPago y contratos inteligentes de Foundry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECCIÓN 3: EL ACTIVO ═══ */}
      <section id="activo" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            {/* Left — Info */}
            <div className="lg:col-span-3 space-y-8">
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
                <Check className="w-4 h-4" /> Proyecto verificado
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Proyecto San Bartolo</h2>
              <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                5 hectáreas de tierra en San Bartolo, Perú. Registro SUNARP activo, fideicomiso notarial constituido y auditoría de tokens en cadena.
              </p>
              {/* CAMBIO 4F */}
              <h3 className="text-xl font-semibold text-slate-800">Tu dinero protegido por ley, no por promesas.</h3>
              <div className="space-y-4">
                <FeatureRow text="Registro SUNARP activo" />
                <FeatureRow text="Fideicomiso notarial constituido" />
                <FeatureRow text="Auditoría de tokens en cadena" />
              </div>
            </div>

            {/* Right — Premium Card */}
            <div className="lg:col-span-2">
              <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-bold text-lg tracking-tight">PACHA</span>
                  <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">Genesis Round</span>
                </div>
                <div className="mb-6">
                  <p className="text-slate-400 text-sm mb-1">Precio por token</p>
                  <p className="text-4xl font-bold">$10.00 <span className="text-lg font-normal text-slate-400">USD</span></p>
                </div>
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Genesis: 45% vendido</span>
                    <span className="text-blue-400 font-medium">225,000 / 500,000</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{width: '45%'}} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                  <div>
                    <p className="text-xl font-bold">100K</p>
                    <p className="text-xs text-slate-400">Disponibles</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">8.5%</p>
                    <p className="text-xs text-slate-400">APY est.</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">PE</p>
                    <p className="text-xs text-slate-400">Perú</p>
                  </div>
                </div>
                <Link href="/demo/start" className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-3.5 rounded-xl transition-colors">
                  Comprar tokens <ArrowRight className="inline w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECCIÓN 4: ROLES ═══ */}
      <section className="bg-blue-950 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Cuál es tu rol?</h2>
          <p className="text-blue-300 mb-16 max-w-lg mx-auto">Cada participante tiene un panel dedicado con herramientas específicas para su función.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <RoleCard emoji="🏦" title="Inversor" desc="Comprá tokens y cobrá rendimientos sobre activos reales verificados." href="/demo/start" badge="Principal" />
            <RoleCard emoji="⚙️" title="Administrador" desc="Gestioná el activo, los inversores y la auditoría de la plataforma." href="/dashboard/admin" badge="Staff" />
            <RoleCard emoji="📜" title="Fideicomiso" desc="Firmá operaciones con quórum legal y controlá la emisión de tokens." href="/dashboard/fideicomiso" badge="Legal" />
          </div>
        </div>
      </section>

      {/* ═══ SECCIÓN FAQ — CAMBIO 4G ═══ */}
      <section id="faq" className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-4">Preguntas frecuentes</h2>
          <p className="text-slate-500 text-center mb-12">Las que más nos hacen antes de invertir.</p>
          <FAQAccordion items={faqData} />
        </div>
      </section>

      {/* ═══ SECCIÓN 5: CTA FINAL ═══ */}
      <section className="py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-3xl p-12 text-center shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-4">Probá el sistema completo hoy</h2>
            <p className="text-slate-400 mb-8">Demo interactivo, sin registro obligatorio, datos simulados en entorno seguro.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/demo/start" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors flex items-center gap-2">
                Iniciar Demo <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/demo/showcase" className="border-2 border-slate-600 hover:border-slate-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors">
                Ver documentación
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-1">
              <Link href="/" className="font-bold text-lg tracking-tight text-slate-900 block mb-3">
                PACHA<span className="text-blue-700">NOVA</span>
              </Link>
              <p className="text-sm text-slate-500">Infraestructura para tokenizar activos inmobiliarios con respaldo fiduciario.</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-widest mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link href="/demo/start" className="hover:text-blue-700 transition-colors">Demo Guiada</Link></li>
                <li><Link href="/demo/showcase" className="hover:text-blue-700 transition-colors">Showcase</Link></li>
                <li><Link href="/dashboard/investor" className="hover:text-blue-700 transition-colors">Panel Inversor</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-widest mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link href="/demo/legal" className="hover:text-blue-700 transition-colors">Disclaimers</Link></li>
                <li><Link href="/dashboard/investor/disclosures" className="hover:text-blue-700 transition-colors">Términos</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-widest mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>info@pachanova.io</li>
                <li>Lima, Perú</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 text-xs text-slate-400 text-center">
            © {new Date().getFullYear()} PachaNova Labs. Simulación de software — no constituye oferta pública. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Sub-components ─── */

function StatCard({ value, label, tooltip }: { value: string; label: string; tooltip: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm relative">
      <Tooltip content={tooltip} position="top">
        <div className="flex items-center justify-center gap-1 cursor-help">
          <p className="text-xl font-bold text-slate-900 border-b border-dashed border-slate-300">{value}</p>
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
        </div>
      </Tooltip>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  );
}

function ProofStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl md:text-3xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500 mt-1">{label}</p>
    </div>
  );
}

function StepCard({ num, icon, title, desc }: { num: number; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center font-bold text-lg mb-5">
        {String(num).padStart(2, '0')}
      </div>
      <div className="text-blue-700 mb-3">{icon}</div>
      <h3 className="font-bold text-lg text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function FeatureRow({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0">
        <Check className="w-4 h-4 text-green-600" />
      </div>
      <span className="text-slate-700">{text}</span>
    </div>
  );
}

function RoleCard({ emoji, title, desc, href, badge }: { emoji: string; title: string; desc: string; href: string; badge: string }) {
  return (
    <Link href={href} className="group block">
      <div className="bg-blue-900/80 border border-blue-800 rounded-2xl p-8 text-left hover:bg-blue-800 transition-colors h-full">
        <div className="flex items-center justify-between mb-5">
          <span className="text-3xl">{emoji}</span>
          <span className="bg-blue-700/50 text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded-full">{badge}</span>
        </div>
        <h3 className="font-bold text-xl text-white mb-2">{title}</h3>
        <p className="text-sm text-blue-300 leading-relaxed mb-4">{desc}</p>
        <span className="text-blue-400 group-hover:text-white text-sm font-medium flex items-center gap-1 transition-colors">
          Acceder <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}
