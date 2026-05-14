"use client";

import React, { useState } from 'react';
import { ChevronDown, FileText, Database, Shield, Hexagon, ArrowRight, Activity, Wallet } from 'lucide-react';
import { InfoHint } from '@/components/product/InfoHint';
import { MissionCard } from '@/components/mission';

// --- FAQ Accordion ---
interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4" data-testid="faq-accordion">
      {items.map((item, index) => (
        <div key={index} className="border border-pn-border rounded-lg bg-pn-surface-strong overflow-hidden">
          <button
            className="w-full px-6 py-4 flex items-center justify-between focus:outline-none hover:bg-pn-text/5 transition-colors"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <span className="font-medium text-left">{item.question}</span>
            <ChevronDown className={`w-5 h-5 text-pn-text-muted transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`} />
          </button>
          {openIndex === index && (
            <div className="px-6 pb-4 pt-2 text-pn-text-muted text-sm border-t border-pn-border/50">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// --- How It Works Steps ---
export function HowItWorksSteps() {
  const steps = [
    {
      icon: <Hexagon className="w-6 h-6 text-pn-gold" />,
      title: "1. El Activo San Bartolo",
      desc: "Un terreno físico de 5 hectáreas (50,000 m²) sirve como base de la simulación. En el entorno real, este activo estaría protegido legalmente por el fideicomiso."
    },
    {
      icon: <Database className="w-6 h-6 text-pn-blue" />,
      title: "2. División en Tokens (PACHA)",
      desc: "El activo se divide matemáticamente en 500,000 unidades simuladas llamadas PACHA. Cada token representa el valor equivalente a 0.1 m² del terreno base."
    },
    {
      icon: <Shield className="w-6 h-6 text-pn-text" />,
      title: "3. Simulación de Fideicomiso",
      desc: "Antes de cualquier movimiento o 'emisión', el sistema requiere firmas institucionales simuladas (quórum 2/3), garantizando transparencia y respaldo legal auditado."
    },
    {
      icon: <Wallet className="w-6 h-6 text-pn-warning" />,
      title: "4. Flujo Genesis (Demo)",
      desc: "Los usuarios simulan la adquisición de estos tokens. El registro se guarda inmutablemente en nuestro Ledger Local, sin conectar aún pasarelas financieras reales."
    }
  ];

  return (
    <div className="space-y-8 relative" data-testid="how-it-works-steps">
      <div className="absolute left-6 top-8 bottom-8 w-px bg-pn-border hidden md:block"></div>
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col md:flex-row gap-6 relative z-10">
          <div className="w-12 h-12 rounded-full bg-pn-bg border border-pn-border flex items-center justify-center shrink-0 shadow-lg">
            {step.icon}
          </div>
          <MissionCard className="flex-grow p-6">
            <h4 className="text-lg font-medium mb-2">{step.title}</h4>
            <p className="text-sm text-pn-text-muted">{step.desc}</p>
          </MissionCard>
        </div>
      ))}
    </div>
  );
}

// --- Token Math Explainer ---
export function TokenMathExplainer({ quantity = 10 }: { quantity?: number }) {
  const PRICE_PER_PACHA = 8.40;
  const area = (quantity * 0.1).toFixed(2);
  const total = (quantity * PRICE_PER_PACHA).toFixed(2);

  return (
    <div className="bg-pn-surface-strong border border-pn-border rounded-xl p-6 relative overflow-hidden" data-testid="genesis-step-token-math">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Hexagon className="w-32 h-32" />
      </div>
      <h4 className="text-sm font-semibold text-pn-gold uppercase tracking-widest mb-4">Lógica de Conversión</h4>
      
      <div className="grid grid-cols-3 gap-4 relative z-10 items-center">
        <div className="text-center p-4 bg-pn-bg rounded-lg border border-pn-border/50">
          <div className="text-3xl font-light mb-1">{quantity}</div>
          <div className="text-xs text-pn-text-muted">PACHA</div>
        </div>
        
        <div className="flex flex-col items-center justify-center text-pn-text-muted">
          <ArrowRight className="w-5 h-5 mb-1" />
          <span className="text-[10px] uppercase tracking-wider">equivale a</span>
        </div>
        
        <div className="text-center p-4 bg-pn-bg rounded-lg border border-pn-border/50">
          <div className="text-3xl font-light mb-1">{area}</div>
          <div className="text-xs text-pn-text-muted">m² de San Bartolo</div>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-pn-border/50 flex justify-between items-center relative z-10">
        <div>
          <div className="text-xs text-pn-text-muted mb-1">Precio Simulado Unitario</div>
          <div className="font-medium">US$ {PRICE_PER_PACHA.toFixed(2)} <InfoHint termKey="Simulated" /></div>
        </div>
        <div className="text-right">
          <div className="text-xs text-pn-text-muted mb-1">Total Simulado</div>
          <div className="text-xl font-medium text-pn-gold">US$ {total}</div>
        </div>
      </div>
    </div>
  );
}

// --- Genesis Explainer ---
export function GenesisExplainer() {
  return (
    <MissionCard className="p-6 border-pn-blue/30 bg-pn-blue/5">
      <div className="flex items-start gap-4">
        <Activity className="w-6 h-6 text-pn-blue shrink-0 mt-1" />
        <div>
          <h4 className="text-lg font-medium mb-2">Acerca del Flujo Genesis</h4>
          <p className="text-sm text-pn-text-muted mb-4">
            El <strong>Flujo Genesis</strong> representa la primera fase de adquisición de tokens. En un entorno de producción, este paso conectaría con MercadoPago para procesar la orden y luego con la red blockchain para la acuñación y entrega segura de los PACHA en tu billetera.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-pn-surface-strong border border-pn-border text-xs text-pn-text-soft">
            <Database className="w-3 h-3" /> En este Demo Mirror, el intento se registra localmente por seguridad.
          </div>
        </div>
      </div>
    </MissionCard>
  );
}
