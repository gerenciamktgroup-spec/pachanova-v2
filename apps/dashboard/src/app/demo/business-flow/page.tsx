"use client";

import React, { useState } from 'react';
import { PublicHeader, PublicFooter } from "@/components/public/LandingComponents";
import { CheckCircle2, Circle, ArrowRight, UserCheck, Wallet, Coins, LayoutDashboard, ArrowRightLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { SafeActionButton } from "@/components/mission";

const steps = [
  {
    id: 'kyc',
    title: 'Validar Perfil (KYC)',
    description: 'Aprobación simulada de identidad por parte del Administrador para cumplir normativas.',
    icon: <UserCheck className="w-6 h-6" />,
    action: { label: 'Aprobar en Consola Admin', href: '/dashboard/admin/users' },
  },
  {
    id: 'deposit',
    title: 'Depósito Simulado',
    description: 'Carga saldo virtual en dólares a tu cuenta para poder operar en la plataforma.',
    icon: <Wallet className="w-6 h-6" />,
    action: { label: 'Ir a Billetera', href: '/dashboard/investor' },
  },
  {
    id: 'genesis',
    title: 'Compra Genesis Demo',
    description: 'Adquiere tokens PACHA en el mercado primario directamente de la tesorería.',
    icon: <Coins className="w-6 h-6" />,
    action: { label: 'Ir a Ronda Genesis', href: '/dashboard/investor/genesis' },
  },
  {
    id: 'portfolio',
    title: 'Portafolio y Ledger',
    description: 'Visualiza tus tokens acreditados, su equivalencia en m² y el registro inmutable.',
    icon: <LayoutDashboard className="w-6 h-6" />,
    action: { label: 'Ver Portafolio', href: '/dashboard/investor' },
  },
  {
    id: 'p2p',
    title: 'Mercado P2P Demo',
    description: 'Publica ofertas o compra tokens a otros usuarios en el mercado secundario simulado.',
    icon: <ArrowRightLeft className="w-6 h-6" />,
    action: { label: 'Explorar Mercado P2P', href: '/dashboard/investor/marketplace' },
  },
  {
    id: 'audit',
    title: 'Auditoría y Fideicomiso',
    description: 'Revisa la trazabilidad completa y el rol institucional en la operación.',
    icon: <ShieldCheck className="w-6 h-6" />,
    action: { label: 'Ver Consola Admin', href: '/dashboard/admin' },
  }
];

export default function BusinessFlowPage() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="min-h-screen bg-pn-bg text-pn-text">
      <PublicHeader />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-light mb-4">Business Model Flow</h1>
          <p className="text-pn-text-muted">Recorre el ciclo completo de tokenización simulado de manera local.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Stepper Navigation */}
          <div className="md:col-span-1 space-y-6">
            {steps.map((step, index) => (
              <button 
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${activeStep === index ? 'bg-pn-surface-strong border-pn-gold' : 'bg-pn-bg border-pn-border hover:border-pn-gold/50 opacity-70 hover:opacity-100'}`}
              >
                <div className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-full border ${activeStep === index ? 'bg-pn-gold/10 text-pn-gold border-pn-gold' : 'bg-pn-surface-strong text-pn-text-muted border-pn-border'}`}>
                  {index + 1}
                </div>
                <div className="font-medium text-sm">
                  {step.title}
                </div>
              </button>
            ))}
          </div>

          {/* Stepper Content */}
          <div className="md:col-span-2">
            <div className="bg-pn-surface-strong border border-pn-border rounded-xl p-8 min-h-[400px] flex flex-col">
              <div className="flex items-center gap-4 mb-6 text-pn-gold">
                {steps[activeStep].icon}
                <h2 className="text-2xl font-light">{steps[activeStep].title}</h2>
              </div>
              
              <div className="text-pn-text-muted space-y-4 mb-10 flex-grow">
                <p>{steps[activeStep].description}</p>
                <div className="p-4 bg-pn-bg border border-pn-border rounded-lg mt-6">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-pn-gold mb-2">Acción Requerida</h4>
                  <p className="text-sm">Para continuar la simulación, dirígete a la sección indicada y realiza la acción.</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-pn-border">
                <button 
                  onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                  disabled={activeStep === 0}
                  className="px-4 py-2 text-sm text-pn-text-muted hover:text-pn-text disabled:opacity-50"
                >
                  Anterior
                </button>
                <SafeActionButton 
                  label={steps[activeStep].action.label}
                  href={steps[activeStep].action.href}
                  variant="primary"
                />
                <button 
                  onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                  disabled={activeStep === steps.length - 1}
                  className="px-4 py-2 text-sm text-pn-text-muted hover:text-pn-text disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
