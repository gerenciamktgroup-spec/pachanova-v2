"use client";

import React from "react";
import Link from "next/link";
import { CommandButton, DemoStatusRibbon } from "@/components/mission";

export function PublicHeader() {
  return (
    <div className="w-full">
      <DemoStatusRibbon />
      <header className="w-full border-b border-pn-border bg-pn-bg/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="font-mono text-lg font-bold text-pn-gold tracking-tighter">
                PACHANOVA<span className="text-pn-text-muted font-normal text-xs ml-2 tracking-widest">V2.0</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6 text-sm">
                <a href="#concepto" className="text-pn-text-muted hover:text-pn-gold transition-colors">Concepto</a>
                <a href="#activo" className="text-pn-text-muted hover:text-pn-gold transition-colors">Activo</a>
                <a href="#arquitectura" className="text-pn-text-muted hover:text-pn-gold transition-colors">Arquitectura</a>
                <a href="#accesos" className="text-pn-text-muted hover:text-pn-gold transition-colors">Accesos</a>
                <a href="#reportes" className="text-pn-text-muted hover:text-pn-gold transition-colors">Reportes</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/demo/showcase">
                <CommandButton variant="primary">Entrar al Demo Mirror</CommandButton>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export function PublicFooter() {
  return (
    <footer className="w-full border-t border-pn-border bg-pn-bg py-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="font-mono text-lg font-bold text-pn-gold tracking-tighter mb-4 block">
              PACHANOVA<span className="text-pn-text-muted font-normal text-xs ml-2 tracking-widest">V2.0</span>
            </Link>
            <p className="text-sm text-pn-text-soft max-w-md">
              Demostración tecnológica institucional de fraccionalización de activos RWA.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-pn-text uppercase tracking-widest mb-4">Módulos</h4>
            <ul className="space-y-2 text-sm text-pn-text-muted">
              <li><Link href="/dashboard/investor" className="hover:text-pn-gold transition-colors">Panel Inversor</Link></li>
              <li><Link href="/dashboard/admin" className="hover:text-pn-gold transition-colors">Consola Admin</Link></li>
              <li><Link href="/dashboard/fideicomiso" className="hover:text-pn-gold transition-colors">Fideicomiso Demo</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-pn-text uppercase tracking-widest mb-4">Recursos</h4>
            <ul className="space-y-2 text-sm text-pn-text-muted">
              <li><Link href="/demo/showcase" className="hover:text-pn-gold transition-colors">Demo Showcase</Link></li>
              <li><Link href="/demo/reports" className="hover:text-pn-gold transition-colors">Data Room</Link></li>
              <li><Link href="/demo/walkthrough" className="hover:text-pn-gold transition-colors">Walkthrough</Link></li>
            </ul>
          </div>
        </div>
        
        <div id="disclaimers" className="pt-8 border-t border-pn-border/50 text-xs text-pn-text-soft space-y-4">
          <p className="font-semibold text-pn-text-muted">DISCLAIMER LEGAL Y TÉCNICO</p>
          <p>
            1. <strong>Simulación de Software:</strong> PachaNova V2.0 Demo Mirror es una demostración de software. No constituye oferta pública ni recomendación de inversión.
          </p>
          <p>
            2. <strong>Cero Conexión Productiva:</strong> Las operaciones son simuladas. No hay conexiones productivas activas. Las operaciones no generan impacto on-chain.
          </p>
          <p>
            3. <strong>Integraciones en Sandbox:</strong> Las integraciones externas están preparadas pero deshabilitadas (Pending credentials / Pending Foundry).
          </p>
          <p>
            &copy; {new Date().getFullYear()} PachaNova Labs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
