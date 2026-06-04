"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, Database, ArrowRightLeft, CheckCircle2, ChevronRight, Activity, Wallet, Coins, LandPlot, Globe } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-white/5">
      {/* Grok-style background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse duration-[10s]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-cyan-600/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none"></div>
      
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium text-pn-text-muted tracking-wide uppercase">PachaNova v2.0 Live Engine</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-extralight tracking-tighter text-white max-w-5xl mx-auto mb-6 leading-tight"
        >
          Infraestructura institucional para <br className="hidden md:block" />
          <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-400">
            Tokenización de RWA
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-lg md:text-xl text-pn-text-muted max-w-2xl mx-auto mb-10 font-light"
        >
          Estructura, adquiere y transfiere participaciones digitales sobre activos inmobiliarios reales con liquidación instantánea y trazabilidad fiduciaria on-chain.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <Link href="/demo/business-flow" className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-sm font-semibold text-black bg-white overflow-hidden transition-all hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative z-10 flex items-center gap-2">Ver cómo funciona <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
          </Link>
          <Link href="/dashboard/investor" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-sm font-medium text-white bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md transition-all">
            Explorar panel inversor
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export function BentoGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="mb-16">
        <h2 className="text-3xl font-light text-white tracking-tight">El ecosistema de capital líquido</h2>
        <p className="text-pn-text-muted mt-2">Combinando respaldo jurídico con ejecución algorítmica.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
        {/* Celda Grande 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="md:col-span-2 md:row-span-2 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 p-8 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
            <Globe className="w-48 h-48 text-cyan-500" strokeWidth={0.5} />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-end">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6">
              <Database className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-medium text-white mb-2">Trazabilidad Inmutable</h3>
            <p className="text-pn-text-muted max-w-md">Cada transacción, desde la emisión hasta el cobro de dividendos (yields), queda registrada de forma auditable y transparente bajo un esquema de Ledger local y pruebas on-chain.</p>
          </div>
        </motion.div>

        {/* Celda Pequeña 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-3xl bg-white/[0.02] border border-white/5 p-6 relative overflow-hidden group hover:bg-white/[0.04] transition-colors"
        >
          <div className="h-full flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-1">Estructura Fiduciaria</h3>
              <p className="text-sm text-pn-text-muted">Tus activos están respaldados por un fideicomiso regulado.</p>
            </div>
          </div>
        </motion.div>

        {/* Celda Pequeña 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-3xl bg-white/[0.02] border border-white/5 p-6 relative overflow-hidden group hover:bg-white/[0.04] transition-colors"
        >
          <div className="h-full flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-1">Yields Automáticos</h3>
              <p className="text-sm text-pn-text-muted">Orquestación continua para distribución pro-rata de rentas.</p>
            </div>
          </div>
        </motion.div>

        {/* Celda Ancha (Filas completas en mobile) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="md:col-span-3 rounded-3xl bg-gradient-to-r from-indigo-900/20 via-transparent to-transparent border border-white/5 p-8 relative overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 h-full items-center">
            <div className="md:col-span-1">
              <h3 className="text-xl font-medium text-white mb-2">Simulador de Mercado</h3>
              <p className="text-sm text-pn-text-muted">Experimenta la liquidez instantánea sin riesgo real.</p>
            </div>
            <div className="md:col-span-3 grid grid-cols-3 gap-4">
               <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                 <Wallet className="w-6 h-6 text-gray-400 mb-2" />
                 <span className="text-xs text-gray-400">Fondea</span>
               </div>
               <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative">
                 <div className="absolute top-1/2 -left-3 w-6 h-px bg-white/10 hidden md:block"></div>
                 <Coins className="w-6 h-6 text-pn-gold mb-2" />
                 <span className="text-xs text-gray-400">Adquiere PACHA</span>
                 <div className="absolute top-1/2 -right-3 w-6 h-px bg-white/10 hidden md:block"></div>
               </div>
               <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                 <ArrowRightLeft className="w-6 h-6 text-indigo-400 mb-2" />
                 <span className="text-xs text-gray-400">Opera P2P</span>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function DarkFooter() {
  return (
    <footer className="w-full border-t border-white/5 bg-black py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <Link href="/" className="font-mono text-xl font-bold tracking-tighter text-white">
            PACHANOVA
          </Link>
          <div className="flex gap-6 text-sm text-pn-text-muted">
            <Link href="/dashboard/investor" className="hover:text-white transition-colors">Panel Inversor</Link>
            <Link href="/dashboard/admin" className="hover:text-white transition-colors">Consola Admin</Link>
            <Link href="/dashboard/fideicomiso" className="hover:text-white transition-colors">Fideicomiso</Link>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 text-xs text-pn-text-soft/60 space-y-2 font-mono">
          <p>1. Simulación de Software: PachaNova V2.0 es una demostración. No constituye oferta pública.</p>
          <p>2. Cero Conexión Productiva: Operaciones simuladas, sin impacto financiero real.</p>
          <p>&copy; {new Date().getFullYear()} PachaNova Labs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
