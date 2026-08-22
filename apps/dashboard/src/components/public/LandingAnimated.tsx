"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, Building2, HardHat, TrendingUp, ChevronRight, Lock, MapPin, Search, CheckCircle2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden border-b border-white/5">
      {/* Premium Dark Background */}
      <div className="absolute inset-0 bg-black"></div>
      
      {/* Subtle glowing accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#c5a46d]/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] pointer-events-none mix-blend-overlay"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
        >
          <ShieldCheck className="w-4 h-4 text-[#c5a46d]" />
          <span className="text-xs font-medium text-white/80 tracking-wide uppercase">Respaldo por Fideicomiso Regulado</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-extralight tracking-tighter text-white max-w-5xl mx-auto mb-6 leading-tight"
        >
          Tu capital respaldado en <br className="hidden md:block" />
          <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#e6c98f] via-[#c5a46d] to-[#967946]">
            Metros Cuadrados Reales
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
        >
          PachaNova es la plataforma tecnológica que te permite co-invertir en proyectos inmobiliarios. La construcción, auditorías y rentas anuales están garantizadas y distribuidas por un Fideicomiso.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <Link href="/auth/register" className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-sm font-semibold text-black bg-[#c5a46d] overflow-hidden transition-all hover:scale-[1.02]">
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative z-10 flex items-center gap-2">Comenzar a Invertir <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
          </Link>
          <Link href="/dashboard/investor" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-sm font-medium text-white bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md transition-all">
            Ver Proyectos Disponibles
          </Link>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-8 md:gap-16 text-white/40 grayscale"
        >
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wider">Custodia Institucional</span>
          </div>
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wider">Auditorías 360°</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wider">Legal Framework</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function BentoGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-light text-white tracking-tight">Cómo funciona PachaNova</h2>
        <p className="text-white/60 mt-4 text-lg">
          Un ecosistema diseñado para brindar total transparencia, seguridad jurídica y rentabilidad atada al desarrollo físico de las propiedades.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
        {/* Celda Grande 1: Modelo */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="md:col-span-2 md:row-span-2 rounded-3xl bg-gradient-to-br from-[#c5a46d]/10 to-transparent border border-[#c5a46d]/20 p-8 relative overflow-hidden group"
        >
          <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none translate-x-1/4 translate-y-1/4">
            <Building2 className="w-96 h-96 text-[#c5a46d]" strokeWidth={0.5} />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-end max-w-md">
            <div className="w-14 h-14 rounded-2xl bg-[#c5a46d]/20 border border-[#c5a46d]/30 flex items-center justify-center mb-6">
              <HardHat className="w-7 h-7 text-[#c5a46d]" />
            </div>
            <h3 className="text-3xl font-medium text-white mb-4">Del Capital a la Obra</h3>
            <p className="text-white/70 text-lg leading-relaxed">
              Realizamos crowdfunding para financiar desarrollos inmobiliarios. Nuestro panel tecnológico te permite verificar el avance de las obras en tiempo real, validado por certificaciones independientes.
            </p>
          </div>
        </motion.div>

        {/* Celda Pequeña 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-3xl bg-white/[0.02] border border-white/5 p-8 relative overflow-hidden group hover:bg-white/[0.04] transition-colors"
        >
          <div className="h-full flex flex-col justify-between">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-white mb-2">Plusvalía Auditada</h3>
              <p className="text-white/60">El valor de tu fracción sube respaldado por tasaciones oficiales del metro cuadrado construido.</p>
            </div>
          </div>
        </motion.div>

        {/* Celda Pequeña 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-3xl bg-white/[0.02] border border-white/5 p-8 relative overflow-hidden group hover:bg-white/[0.04] transition-colors"
        >
          <div className="h-full flex flex-col justify-between">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-white mb-2">Fideicomiso Garante</h3>
              <p className="text-white/60">Los activos son administrados por una entidad regulada que se encarga del alquiler y reparto anual de utilidades.</p>
            </div>
          </div>
        </motion.div>

        {/* Celda Ancha: Transparencia */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="md:col-span-3 rounded-3xl bg-black border border-white/10 p-8 relative overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center h-full">
            <div>
              <h3 className="text-2xl font-medium text-white mb-4">¿Por qué invertir con nosotros?</h3>
              <p className="text-white/60 mb-6">
                A diferencia de los modelos especulativos, en PachaNova separas la tecnología de la custodia. Nosotros desarrollamos el mercado y la trazabilidad inmutable, pero <strong>tu dinero físico y las propiedades inmobiliarias están bajo el control estricto de un Fideicomiso Regulado.</strong>
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-[#c5a46d]" /> No tocamos tu dinero en transferencias secundarias.
                </li>
                <li className="flex items-center gap-3 text-sm text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-[#c5a46d]" /> Trazabilidad documental de cada aporte y operación.
                </li>
                <li className="flex items-center gap-3 text-sm text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-[#c5a46d]" /> Rentas generadas por alquileres reales de mercado.
                </li>
              </ul>
            </div>
            <div className="relative h-64 rounded-2xl border border-white/10 overflow-hidden bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="bg-black/50 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center gap-4">
                  <MapPin className="w-8 h-8 text-[#c5a46d]" />
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-widest font-bold mb-1">Proyecto Activo</p>
                    <p className="text-lg text-white font-medium">Torre PachaNova I</p>
                  </div>
                </div>
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
    <footer className="w-full border-t border-white/5 bg-[#050505] py-16 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          <div className="max-w-xs">
            <Link href="/" className="font-sans text-2xl font-bold tracking-tight text-white mb-4 block">
              PACHANOVA
            </Link>
            <p className="text-sm text-white/50 leading-relaxed">
              Plataforma tecnológica para la co-inversión en desarrollos inmobiliarios, con la seguridad y respaldo de un Fideicomiso.
            </p>
          </div>
          <div className="flex gap-16 text-sm">
            <div className="space-y-4">
              <h4 className="text-white font-medium mb-2">Plataforma</h4>
              <div className="flex flex-col gap-3 text-white/50">
                <Link href="/dashboard/investor" className="hover:text-[#c5a46d] transition-colors">Panel Inversor</Link>
                <Link href="/auth/register" className="hover:text-[#c5a46d] transition-colors">Crear Cuenta</Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-medium mb-2">Corporativo</h4>
              <div className="flex flex-col gap-3 text-white/50">
                <Link href="/dashboard/admin" className="hover:text-[#c5a46d] transition-colors">Administración</Link>
                <Link href="/dashboard/fideicomiso" className="hover:text-[#c5a46d] transition-colors">Portal Fideicomiso</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Descargo de Responsabilidad Legal / Institutional RWA Disclaimers */}
        <div className="mb-12 p-6 bg-white/[0.02] border border-white/10 rounded-xl text-[11px] text-white/40 leading-relaxed space-y-3">
          <p>
            <strong className="text-white/60">ADVERTENCIA DE RIESGO Y DESCARGO DE RESPONSABILIDAD LEGAL:</strong> La participación en proyectos inmobiliarios a través de esquemas de co-inversión o fideicomisos conlleva riesgos significativos, incluyendo la posible pérdida del capital aportado, la falta de liquidez inmediata y la fluctuación de los rendimientos proyectados. Los rendimientos históricos o estimados mostrados en esta plataforma no garantizan resultados futuros.
          </p>
          <p>
            PachaNova es una plataforma tecnológica para estructurar y seguir cofinanciamiento inmobiliario (landbanking, edificios en venta y en renta). El inversor aporta capital a un proyecto. El cliente compra o arrienda el inmueble. Eso no es propiedad inscrita por token ni una oferta pública de valores.
          </p>
          <p>
            Esta plataforma no realiza intermediación financiera, captación de ahorro público, ni asesoramiento financiero, legal o fiscal. Se recomienda a los participantes realizar su propio análisis de diligencia y consultar con asesores profesionales independientes antes de realizar cualquier aporte.
          </p>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} PachaNova LLC. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Términos Legales</a>
            <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Contacto Fideicomiso</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

