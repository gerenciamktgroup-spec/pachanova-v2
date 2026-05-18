import { Suspense } from 'react'
import { InvestorPortfolioCard } from '@/components/demo/InvestorPortfolioCard'
import { PropertyCard } from '@/components/demo/PropertyCard'
import { MissionCard } from '@/components/mission/MissionCard'
import { SectionHeader } from '@/components/mission/SectionHeader'

export default function BusinessFlowPage() {
  return (
    <div className="space-y-8" data-testid="demo-business-flow">
      {/* Hero */}
      <MissionCard className="border-pn-gold/20 bg-gradient-to-br from-pn-surface to-pn-surface-strong">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <span className="rounded bg-green-500/10 border border-green-500/30 px-2.5 py-1 text-xs font-semibold tracking-wider text-green-400 uppercase">🔴 LIVE — Supabase Real</span>
            <span className="rounded bg-pn-gold/10 border border-pn-gold/30 px-2.5 py-1 text-xs font-medium text-pn-gold">pachanova-demo.supabase.co</span>
          </div>
          <h1 className="text-3xl font-light tracking-tighter text-pn-text sm:text-4xl">
            Flujo de Negocio <span className="font-semibold text-pn-gold">Completo</span>
          </h1>
          <p className="text-pn-text-muted max-w-2xl">
            Compra tokens reales en Supabase, observa tu portafolio actualizarse en tiempo real.
            Cada transacción se registra con hash único en el token_ledger.
          </p>
        </div>
      </MissionCard>

      {/* Flujo principal: propiedad + portafolio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <SectionHeader
            title="Propiedad Disponible"
            description="Torre Miraflores — Genesis Round activa"
          />
          <Suspense fallback={<div className="h-80 rounded-2xl bg-pn-surface border border-pn-border animate-pulse" />}>
            <PropertyCard />
          </Suspense>
        </div>

        <div className="space-y-4">
          <SectionHeader
            title="Tu Portafolio"
            description="Carlos Mendoza — Inversor Demo Principal"
          />
          <Suspense fallback={<div className="h-80 rounded-2xl bg-pn-surface border border-pn-border animate-pulse" />}>
            <InvestorPortfolioCard />
          </Suspense>
        </div>
      </div>

      {/* Cómo funciona */}
      <MissionCard title="Cómo funciona el flujo">
        <ol className="space-y-3">
          {[
            { n: '01', title: 'Ver propiedad', desc: 'Torre Miraflores con datos reales de Supabase: precio, yield, tokens disponibles' },
            { n: '02', title: 'Elegir cantidad', desc: 'Selecciona cuántos tokens Genesis quieres comprar (mínimo 1, precio $10 USD/token)' },
            { n: '03', title: 'Confirmar compra', desc: 'Se ejecuta la RPC demo_buy_tokens en Supabase con validación de saldo' },
            { n: '04', title: 'TX Hash generado', desc: 'Registro inmutable en token_ledger con hash único tipo DEMO-XXXXXXXXXXXXXXXX' },
            { n: '05', title: 'Portafolio actualizado', desc: 'Saldo USD descontado, tokens acreditados, notificación insertada en DB' },
          ].map(step => (
            <li key={step.n} className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-pn-gold/10 border border-pn-gold/30 flex items-center justify-center text-xs font-bold text-pn-gold">{step.n}</span>
              <div>
                <p className="text-sm font-semibold text-pn-text">{step.title}</p>
                <p className="text-xs text-pn-text-muted mt-0.5">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </MissionCard>
    </div>
  )
}
