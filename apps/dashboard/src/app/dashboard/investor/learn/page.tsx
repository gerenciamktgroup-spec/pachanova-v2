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
            Descubre cómo funciona la tokenización de activos del mundo real (RWA) y cómo PachaNova asegura tu capital con propiedades inmobiliarias.
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
              <h2 className="text-2xl font-semibold text-pn-text">¿Qué es el Landbanking Tokenizado?</h2>
              <p className="text-pn-text-muted leading-relaxed">
                El Landbanking tradicional es el negocio de adquirir terrenos en zonas de alto crecimiento urbano para venderlos a desarrolladores inmobiliarios en el futuro, capturando la plusvalía. 
                PachaNova tokeniza estas reservas de tierra, permitiéndote ser copropietario desde fracciones accesibles y garantizando tu inversión con un Fideicomiso.
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
            A diferencia del crypto tradicional que fluctúa por especulación, los tokens RWA de PachaNova aprecian su valor basados en el desarrollo real de las zonas urbanas de Lima y el avance de obras.
          </p>
        </div>

        <div className="bg-pn-surface/50 border border-pn-border rounded-xl p-6 hover:border-pn-gold/30 transition-colors">
          <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-6">
            <Landmark className="w-6 h-6 text-purple-500" />
          </div>
          <h3 className="text-lg font-medium text-pn-text mb-2">Liquidez Secundaria (P2P)</h3>
          <p className="text-sm text-pn-text-soft leading-relaxed">
            No tienes que esperar 5 años para salir del proyecto. El Marketplace P2P te permite vender tus fracciones de terreno a otros inversores en cualquier momento de forma atómica y segura.
          </p>
        </div>

        {/* Pasos */}
        <div className="col-span-full border-t border-pn-border pt-8 mt-4">
          <h2 className="text-xl font-medium text-pn-text mb-6">Tu camino en PachaNova</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-3">
              <div className="text-2xl font-bold text-pn-border-strong">01</div>
              <h4 className="font-medium text-pn-text">Fondeo USD</h4>
              <p className="text-sm text-pn-text-soft">Inyecta capital a tu Billetera PachaNova usando métodos de pago locales y regulados.</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-2xl font-bold text-pn-border-strong">02</div>
              <h4 className="font-medium text-pn-text">Adquisición</h4>
              <p className="text-sm text-pn-text-soft">Compra tokens en emisiones primarias (Bóvedas) o en el mercado secundario P2P.</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-2xl font-bold text-pn-border-strong">03</div>
              <h4 className="font-medium text-pn-text">Custodia</h4>
              <p className="text-sm text-pn-text-soft">Visualiza el crecimiento de tu portafolio respaldado por el Fideicomiso en tiempo real.</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-2xl font-bold text-pn-border-strong">04</div>
              <h4 className="font-medium text-pn-text">Liquidación</h4>
              <p className="text-sm text-pn-text-soft">Al venderse la propiedad a un desarrollador, recibes el capital y las ganancias directo en dólares.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
