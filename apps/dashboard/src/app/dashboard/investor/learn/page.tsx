"use client";

import { RouteBreadcrumbs } from "@/components/mission";
import { BookOpen, Shield, TrendingUp, Landmark } from "lucide-react";
import Image from "next/image";

export default function LearnPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <RouteBreadcrumbs />
        <div>
          <h1 className="text-3xl font-light tracking-tight text-pn-text">
            Centro de <span className="font-semibold text-pn-gold">Aprendizaje</span>
          </h1>
          <p className="text-pn-text-muted mt-1 max-w-2xl">
            Cómo funciona el cofinanciamiento: landbanking, edificios en venta y edificios en alquiler, con trazabilidad documental. La tokenización queda para después.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-full bg-gradient-to-br from-pn-surface-strong to-pn-surface border border-pn-border rounded-xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pn-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-pn-gold/10 text-pn-gold border border-pn-gold/20">
                Modelo Fundamental
              </span>
              <h2 className="text-2xl font-semibold text-pn-text">¿Qué es el landbanking?</h2>
              <p className="text-pn-text-muted leading-relaxed">
                Comprar tierra con tesis de plusvalía, cofinanciar la tenencia y vender más adelante.
                En PachaNova el inversor aporta capital al proyecto; el cliente es quien compra el lote o la unidad al final.
                El respaldo es documental y fiduciario, no un token.
              </p>
            </div>
            <div className="w-full md:w-1/3 aspect-video bg-black/40 border border-pn-border/50 rounded-lg flex items-center justify-center relative group overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Terrenos RWA" fill className="absolute inset-0 object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-700" unoptimized />
              <div className="w-16 h-16 rounded-full bg-pn-bg/80 backdrop-blur-sm border border-pn-border flex items-center justify-center shadow-2xl relative z-10 hover:bg-pn-gold hover:text-pn-bg transition-colors cursor-pointer">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Conceptos */}
        <div className="bg-pn-surface/50 border border-pn-border rounded-xl p-6 hover:border-pn-gold/30 transition-colors">
          <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-6">
            <Shield className="w-6 h-6 text-emerald-500" />
          </div>
          <h3 className="text-lg font-medium text-pn-text mb-2">Respaldo Fiduciario</h3>
          <p className="text-sm text-pn-text-soft leading-relaxed">
            Cada token está respaldado 1 a 1 por metros cuadrados reales. Un Fideicomiso independiente custodia los títulos de propiedad, asegurando que tus tokens tengan un valor tangible e inmutable ante la ley.
          </p>
        </div>

        <div className="bg-pn-surface/50 border border-pn-border rounded-xl p-6 hover:border-pn-gold/30 transition-colors">
          <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6">
            <TrendingUp className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-pn-text mb-2">Plusvalía Compuesta</h3>
          <p className="text-sm text-pn-text-soft leading-relaxed">
            El resultado depende del activo: plusvalía de la tierra, venta de unidades o renta cobrada. No hay rendimiento prometido ni token que “aprecie solo”.
          </p>
        </div>

        <div className="bg-pn-surface/50 border border-pn-border rounded-xl p-6 hover:border-pn-gold/30 transition-colors">
          <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-6">
            <Landmark className="w-6 h-6 text-purple-500" />
          </div>
          <h3 className="text-lg font-medium text-pn-text mb-2">Salida del proyecto</h3>
          <p className="text-sm text-pn-text-soft leading-relaxed">
            La salida la define el contrato del proyecto: venta del terreno, venta de unidades o flujo de renta. No hay mercado P2P de fracciones en esta etapa.
          </p>
        </div>

        {/* Pasos */}
        <div className="col-span-full border-t border-pn-border pt-8 mt-4">
          <h2 className="text-xl font-medium text-pn-text mb-6">Tu camino en PachaNova</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-3">
              <div className="text-2xl font-bold text-pn-border-strong">01</div>
              <h4 className="font-medium text-pn-text">Onboarding y KYC</h4>
              <p className="text-sm text-pn-text-soft">Identidad verificada antes de aportar capital a un proyecto.</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-2xl font-bold text-pn-border-strong">02</div>
              <h4 className="font-medium text-pn-text">Aporte</h4>
              <p className="text-sm text-pn-text-soft">Cofinanciás un proyecto de landbanking, venta o renta. No comprás tokens.</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-2xl font-bold text-pn-border-strong">03</div>
              <h4 className="font-medium text-pn-text">Seguimiento</h4>
              <p className="text-sm text-pn-text-soft">Hitos, documentos y trazabilidad de tu participación.</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-2xl font-bold text-pn-border-strong">04</div>
              <h4 className="font-medium text-pn-text">Resultado</h4>
              <p className="text-sm text-pn-text-soft">Distribución según el contrato: venta de tierra, venta de unidades o rentas cobradas. Sujeto al desempeño del activo.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
