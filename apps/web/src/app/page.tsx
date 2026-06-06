'use client';

import Link from "next/link";
import { PrecisionHero3D } from "./components/3d/PrecisionHero";
import { LandExplorer3D } from "./components/3d/LandExplorer3D";
import { TrustStructure3D } from "./components/3d/TrustStructure3D";
import { PrecisionNavbar } from "./components/PrecisionNavbar";
import { PrecisionFooter } from "./components/PrecisionFooter";

export default function PrecisionSpatialLanding() {
  return (
    <div className="min-h-screen bg-[#0a111f] text-white overflow-hidden selection:bg-[#c5a46d]/30">
      <PrecisionNavbar />

      {/* ==================== HERO ==================== */}
      <section className="relative h-[100dvh] flex items-center pt-20">
        <PrecisionHero3D />

        <div className="relative z-10 max-w-5xl mx-auto px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-xs tracking-[2px] mb-6">
              SAN BARTOLO · LIMA SUR · PERÚ
            </div>

            <h1 className="text-7xl md:text-[92px] leading-[0.90] font-semibold tracking-[-4.6px] mb-7">
              Tierra real.<br />
              Valor real.<br />
              <span className="text-[#c5a46d]">Acceso real.</span>
            </h1>

            <p className="text-[21px] text-white/70 max-w-md tracking-[-0.2px] mb-12">
              El primer fideicomiso inmobiliario tokenizado de Perú.<br />
              Desde $10. Respaldado por ley.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/demo/start" 
                className="inline-flex items-center justify-center bg-[#c5a46d] hover:bg-[#d4b47d] text-[#0a111f] font-semibold px-10 py-4 rounded-2xl text-[15px] tracking-[-0.2px] transition-all active:scale-[0.985]"
              >
                EXPLORAR DEMO 3D
              </Link>
              <a 
                href="#activo" 
                className="inline-flex items-center justify-center border border-white/25 hover:bg-white/5 font-medium px-9 py-4 rounded-2xl text-[15px] tracking-[-0.1px] transition-all"
              >
                Ver el activo
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[10px] tracking-[3px] text-white/35 font-mono">
          SCROLL TO BEGIN
        </div>
      </section>

      {/* ==================== EL ACTIVO CON 3D REAL ==================== */}
      <section id="activo" className="border-t border-white/10 pt-20 pb-24">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid lg:grid-cols-12 gap-x-12 items-end mb-10">
            <div className="lg:col-span-7">
              <div className="text-[#c5a46d] text-xs tracking-[2.5px] mb-2">EL ACTIVO</div>
              <h2 className="text-[56px] md:text-7xl leading-[0.92] tracking-[-3.2px] font-semibold">
                500.000 m² de tierra<br />real en San Bartolo.
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pb-3 text-[15px] text-white/65 max-w-lg mt-6 lg:mt-0">
              Predio inscrito en SUNARP con título de propiedad, zonificación urbana y acceso a servicios. 
              No es un activo sintético. Es suelo físico que puedes visitar.
            </div>
          </div>

          {/* 3D Experience - Land Explorer */}
          <div className="mt-10">
            <LandExplorer3D />
          </div>

          <div className="mt-6 text-[12px] tracking-widest text-white/40 text-center">
            INTERACTÚA • ROTACIÓN AUTOMÁTICA • ZOOM Y ÓRBITA
          </div>
        </div>
      </section>

      {/* ==================== TOKENIZACIÓN ==================== */}
      <section id="tokenizacion" className="bg-[#0d1524] border-y border-white/10 py-20">
        <div className="max-w-5xl mx-auto px-8">
          <div className="max-w-2xl">
            <div className="text-[#c5a46d] text-xs tracking-[2.5px] mb-3">TOKENIZACIÓN</div>
            <h3 className="text-6xl tracking-[-2.6px] font-semibold leading-none mb-8">
              Cada metro cuadrado,<br />convertido en valor accesible.
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8 text-lg text-white/70 max-w-4xl">
            <div>
              1 token = <span className="text-white font-medium">0.1 m²</span>.<br />
              500.000 m² = <span className="text-white font-medium">5.000.000 tokens</span>.
            </div>
            <div className="text-white/55">
              Liquidez fraccional. Transparencia en cadena. 
              Derechos proporcionales de gobernanza dentro del fideicomiso.
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ESTRUCTURA FIDUCIARIA (NUEVA + 3D) ==================== */}
      <section id="estructura" className="max-w-6xl mx-auto px-8 pt-20 pb-16 border-b border-white/10">
        <div className="grid lg:grid-cols-12 gap-x-16 items-center">
          <div className="lg:col-span-5 mb-10 lg:mb-0">
            <div className="text-[#c5a46d] text-xs tracking-[2.5px] mb-3">ARQUITECTURA LEGAL</div>
            <h3 className="text-6xl tracking-[-2.5px] font-semibold leading-none mb-7">
              Tres capas.<br />Una sola verdad.
            </h3>
            <p className="text-[15px] text-white/65 max-w-md">
              El valor no vive solo en blockchain. Vive en una estructura fiduciaria real, 
              con escritura pública, notario y fiduciarios profesionales.
            </p>
          </div>

          <div className="lg:col-span-7">
            <TrustStructure3D />
          </div>
        </div>
      </section>

      {/* ==================== GOBERNANZA ==================== */}
      <section id="gobernanza" className="max-w-5xl mx-auto px-8 py-20">
        <div className="max-w-3xl">
          <div className="text-[#c5a46d] text-xs tracking-[2.5px] mb-3">GOBERNANZA</div>
          <h3 className="text-[56px] tracking-[-2.4px] font-semibold leading-none mb-8">
            Decisiones que requieren<br />más que código.
          </h3>
          <div className="space-y-6 text-[15px] text-white/70 max-w-2xl">
            <p>
              Cualquier operación relevante del fideicomiso exige quórum de <span className="text-white">2 de 3 fiduciarios</span>. 
              Tus tokens otorgan derechos reales de voto y distribución dentro de la estructura legal.
            </p>
            <p>
              Esto no es un DAO sin consecuencias. Es una entidad regulada donde la tecnología 
              amplifica —no reemplaza— la responsabilidad fiduciaria.
            </p>
          </div>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-4 text-sm">
          {[
            { label: "Quórum reforzado", value: "2/3" },
            { label: "Fiduciarios profesionales", value: "3" },
            { label: "Respaldado por", value: "Ley 26702" }
          ].map((item, i) => (
            <div key={i} className="border border-white/10 rounded-2xl px-6 py-5">
              <div className="text-white/40 text-xs tracking-widest mb-1.5">{item.label.toUpperCase()}</div>
              <div className="text-3xl tracking-tighter font-semibold text-[#c5a46d]">{item.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== RESPALDOS REALES (NUEVA - Confianza Institucional) ==================== */}
      <section className="bg-[#0d1524] border-y border-white/10 py-20">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-12">
            <div className="text-[#c5a46d] text-xs tracking-[2.5px] mb-3">RESPALDOS INSTITUCIONALES</div>
            <h3 className="text-5xl tracking-[-2px] font-semibold">No es una promesa.<br />Es un expediente.</h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            {[
              { title: "Inscripción SUNARP", desc: "Predio inscrito en Registros Públicos con partida electrónica vigente." },
              { title: "Escritura Pública", desc: "Formalizada ante notario público. Título de propiedad individualizado." },
              { title: "Fideicomiso Regulado", desc: "Constitución bajo Ley 26702 y supervisión de la SBS en sus alcances." },
              { title: "Gobernanza Mixta", desc: "Combinación de control fiduciario profesional + derechos proporcionales de token holders." }
            ].map((item, index) => (
              <div key={index} className="glass border border-white/10 rounded-3xl p-7 hover:border-white/15 transition-colors">
                <div className="font-semibold tracking-tight text-lg mb-3 text-white/95">{item.title}</div>
                <p className="text-white/60 leading-relaxed text-[13.5px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CÓMO FUNCIONA (Refinado) ==================== */}
      <section className="max-w-6xl mx-auto px-8 py-20 border-b border-white/10">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="text-[#c5a46d] text-xs tracking-[2.5px] mb-3">PROCESO</div>
          <h3 className="text-6xl tracking-[-2.4px] font-semibold">Tres pasos.<br />Institucional y simple.</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            { 
              n: "01", 
              title: "Selecciona tu participación", 
              desc: "Elige cuántos tokens adquieres. Cada uno representa 0.1 m² del terreno de San Bartolo." 
            },
            { 
              n: "02", 
              title: "Paga con total trazabilidad", 
              desc: "Transacción vía Mercado Pago. Registro inmediato en el ledger del fideicomiso y confirmación legal." 
            },
            { 
              n: "03", 
              title: "Recibe derechos reales", 
              desc: "Tus tokens quedan registrados. Puedes consultarlos, seguir su valor y participar en decisiones según quórum." 
            }
          ].map((step, i) => (
            <div key={i} className="group border border-white/10 hover:border-white/20 transition-colors rounded-3xl px-8 pt-8 pb-9">
              <div className="font-mono text-6xl text-[#c5a46d]/70 font-light tracking-[-2px] mb-8 tabular-nums">{step.n}</div>
              <h4 className="text-2xl tracking-[-0.6px] font-semibold mb-4">{step.title}</h4>
              <p className="text-white/65 text-[14.5px] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== CTA FINAL ==================== */}
      <section className="py-20">
        <div className="max-w-xl mx-auto px-8 text-center">
          <h4 className="text-5xl tracking-[-1.8px] font-semibold mb-5 leading-none">
            Ve cómo opera realmente<br />un fideicomiso tokenizado.
          </h4>
          <p className="text-lg text-white/55 mb-9 max-w-md mx-auto">
            El demo contiene datos reales del proyecto San Bartolo, escenarios de pago, KYC y gobernanza.
          </p>

          <Link 
            href="/demo/start" 
            className="inline-flex bg-[#c5a46d] hover:bg-[#d4b47d] text-[#0a111f] font-semibold px-14 py-[17px] rounded-2xl text-base tracking-[-0.1px] transition-all active:scale-[0.985]"
          >
            ENTRAR AL DEMO INTERACTIVO
          </Link>

          <div className="mt-5 text-[10px] tracking-[2px] text-white/35">SIN REGISTRO • DATOS REALES • EXPLORACIÓN 3D</div>
        </div>
      </section>

      <PrecisionFooter />
    </div>
  );
}

