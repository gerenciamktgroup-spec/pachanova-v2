import { PublicHeader, PublicFooter } from "@/components/public/LandingComponents";
import { MissionCard, IntegrationStatusBadge, SafeActionButton } from "@/components/mission";
import { Activity, ShieldCheck, Database, LayoutDashboard, Eye, CheckCircle2, CircleDashed, Link as LinkIcon, LandPlot, Coins, UserCheck, Wallet, ArrowRightLeft } from "lucide-react";
import Link from "next/link";
import { InfoHint } from "@/components/product/InfoHint";
import { NextStepCard } from "@/components/product/NextStepCard";
import { JourneyProgressRail } from "@/components/product/JourneyProgressRail";
import { visitorJourney } from "@/lib/navigation/userJourneys";

import { createServerClient } from '@/utils/supabase/server';

export default async function LandingPage() {
  const supabase = await createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  const isAuth = !!session?.user;
  const investorHref = isAuth ? "/dashboard/investor" : "/signup";
  return (
    <div className="min-h-screen bg-pn-bg text-pn-text selection:bg-pn-gold/30" data-testid="landing-page">
      <PublicHeader />

      <main className="w-full">
        {/* Rail de Progreso Visitante */}
        <JourneyProgressRail journey={visitorJourney} currentStepId="v1" />

        {/* 1. Hero Institucional */}
        <section className="relative py-16 md:py-24 overflow-hidden border-b border-pn-border">
          <div className="absolute inset-0 pn-grid-bg opacity-30 pointer-events-none"></div>
          <div className="absolute inset-0 pn-gradient-radial pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-pn-surface-strong border border-pn-border text-pn-text-muted">Demo local</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-pn-text max-w-4xl mx-auto mb-6">
              PachaNova: infraestructura para tokenizar activos inmobiliarios
            </h1>
            <p className="text-lg text-pn-text-soft max-w-2xl mx-auto mb-10">
              Una plataforma RWA para estructurar, adquirir y transferir participaciones digitales sobre activos inmobiliarios bajo trazabilidad fiduciaria.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/demo/start" className="inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pn-gold bg-pn-gold text-pn-bg hover:bg-pn-gold/90">
                Empezar demo guiada
              </Link>
              <Link href="/demo/showcase" className="inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pn-gold bg-pn-text text-pn-bg hover:bg-pn-text/90">
                Entrar al simulador libre
              </Link>
              <Link href={investorHref} className="inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pn-gold bg-pn-surface-strong text-pn-text hover:bg-pn-surface-strong/80 border border-pn-border">
                {isAuth ? "Explorar panel inversor" : "Simular como Inversor"}
              </Link>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
          
          {/* Proyecto San Bartolo */}
          <section id="activo" className="bg-pn-surface-strong border border-pn-border rounded-xl p-8 pn-glow-soft">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-pn-bg border border-pn-border rounded-lg">
                <LandPlot className="w-8 h-8 text-pn-gold" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-pn-gold uppercase tracking-widest">Activo Subyacente</h2>
                <h3 className="text-2xl font-light text-pn-text">Proyecto San Bartolo</h3>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-pn-text-muted mb-1">Superficie</p>
                <p className="text-xl font-medium">5 Hectáreas</p>
                <p className="text-xs text-pn-text-muted">50,000 m²</p>
              </div>
              <div>
                <p className="text-sm text-pn-text-muted mb-1">Unidades</p>
                <p className="text-xl font-medium">500,000 PACHA</p>
              </div>
              <div>
                <p className="text-sm text-pn-text-muted mb-1">Equivalencia</p>
                <p className="text-xl font-medium">1 PACHA</p>
                <p className="text-xs text-pn-text-muted">= 0.1 m²</p>
              </div>
              <div>
                <p className="text-sm text-pn-text-muted mb-1">Respaldo</p>
                <p className="text-xl font-medium">Fideicomiso</p>
                <p className="text-xs text-pn-text-muted">Quórum 2/3 simulado</p>
              </div>
            </div>
          </section>

          {/* Modelo en 4 pasos */}
          <section id="modelo">
            <div className="text-center mb-12">
              <h2 className="text-sm font-semibold text-pn-gold uppercase tracking-widest mb-3">Modelo Operativo</h2>
              <h3 className="text-3xl font-light">Flujo de participación en 4 pasos</h3>
              <p className="text-pn-text-muted mt-4 max-w-2xl mx-auto">Explora el ciclo de vida de la tokenización a través de nuestra demostración simulada.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-pn-border/50 -z-10 hidden md:block"></div>
              
              <MissionCard className="p-6 bg-pn-bg">
                <div className="w-12 h-12 bg-pn-surface-strong border border-pn-border rounded-full flex items-center justify-center mb-4 mx-auto text-xl font-bold">1</div>
                <h4 className="text-center font-medium mb-2">Verifica tu perfil</h4>
                <p className="text-sm text-pn-text-muted text-center">Cumplimiento normativo simulado (KYC).</p>
                <UserCheck className="w-8 h-8 mx-auto mt-4 text-pn-text-soft" />
              </MissionCard>

              <MissionCard className="p-6 bg-pn-bg">
                <div className="w-12 h-12 bg-pn-surface-strong border border-pn-border rounded-full flex items-center justify-center mb-4 mx-auto text-xl font-bold">2</div>
                <h4 className="text-center font-medium mb-2">Deposita fondos</h4>
                <p className="text-sm text-pn-text-muted text-center">Carga saldo virtual para operar simuladamente.</p>
                <Wallet className="w-8 h-8 mx-auto mt-4 text-pn-text-soft" />
              </MissionCard>

              <MissionCard className="p-6 bg-pn-bg border-pn-gold/30 shadow-[0_0_15px_rgba(255,215,0,0.05)]">
                <div className="w-12 h-12 bg-pn-gold/10 border border-pn-gold/30 text-pn-gold rounded-full flex items-center justify-center mb-4 mx-auto text-xl font-bold">3</div>
                <h4 className="text-center font-medium mb-2">Adquiere PACHA</h4>
                <p className="text-sm text-pn-text-muted text-center">Compra tokens en la ronda Genesis demo.</p>
                <Coins className="w-8 h-8 mx-auto mt-4 text-pn-gold" />
              </MissionCard>

              <MissionCard className="p-6 bg-pn-bg">
                <div className="w-12 h-12 bg-pn-surface-strong border border-pn-border rounded-full flex items-center justify-center mb-4 mx-auto text-xl font-bold">4</div>
                <h4 className="text-center font-medium mb-2">Opera P2P</h4>
                <p className="text-sm text-pn-text-muted text-center">Compra y vende tokens en mercado secundario demo.</p>
                <ArrowRightLeft className="w-8 h-8 mx-auto mt-4 text-pn-text-soft" />
              </MissionCard>
            </div>
            
            <div className="mt-12 text-center">
              <SafeActionButton label="Iniciar Business Flow Stepper" href="/demo/business-flow" variant="primary" />
            </div>
          </section>

          {/* Generación de Valor & Roles */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-light mb-6">Generación de valor operativo</h3>
              <ul className="space-y-4">
                <li className="flex gap-3"><ShieldCheck className="w-5 h-5 text-pn-gold shrink-0" /> <div><strong>Estructuración fiduciaria</strong><p className="text-sm text-pn-text-muted">Respaldo legal de los activos subyacentes.</p></div></li>
                <li className="flex gap-3"><Database className="w-5 h-5 text-pn-gold shrink-0" /> <div><strong>Trazabilidad inmutable</strong><p className="text-sm text-pn-text-muted">Auditoría completa a través del Ledger local.</p></div></li>
                <li className="flex gap-3"><ArrowRightLeft className="w-5 h-5 text-pn-gold shrink-0" /> <div><strong>Liquidez P2P futura</strong><p className="text-sm text-pn-text-muted">Mercado secundario para transferencia de valor.</p></div></li>
              </ul>
            </div>
            <div className="bg-pn-surface-strong p-8 rounded-xl border border-pn-border">
              <h3 className="text-2xl font-light mb-6">Roles en la plataforma</h3>
              <ul className="space-y-4">
                <li className="border-b border-pn-border pb-4">
                  <div className="flex items-center justify-between mb-1"><strong>Inversor</strong> <Link href="/dashboard/investor" className="text-xs text-pn-gold hover:underline">Ver panel</Link></div>
                  <p className="text-sm text-pn-text-muted">Adquiere y transfiere participaciones PACHA en entorno simulado.</p>
                </li>
                <li className="border-b border-pn-border pb-4">
                  <div className="flex items-center justify-between mb-1"><strong>Administrador</strong> <Link href="/dashboard/admin" className="text-xs text-pn-gold hover:underline">Ver panel</Link></div>
                  <p className="text-sm text-pn-text-muted">Audita transacciones, gestiona liquidez y aprueba perfiles KYC demo.</p>
                </li>
                <li>
                  <div className="flex items-center justify-between mb-1"><strong>Fideicomiso</strong> <Link href="/dashboard/fideicomiso" className="text-xs text-pn-gold hover:underline">Ver panel</Link></div>
                  <p className="text-sm text-pn-text-muted">Entidad jurídica que custodia el activo y autoriza la emisión de tokens.</p>
                </li>
              </ul>
            </div>
          </section>

          {/* Qué está simulado vs Qué se conectará después */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8" data-testid="landing-how-to-read-demo">
            <MissionCard className="p-8 border-pn-border">
              <CircleDashed className="w-8 h-8 text-pn-text-muted mb-6" />
              <h3 className="text-xl font-medium mb-4" data-testid="landing-what-is-simulated">Qué puedes probar ahora <InfoHint termKey="Simulated" inline /></h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-pn-text-muted"><CheckCircle2 className="w-4 h-4 text-pn-text-soft" /> <span>Aprobar KYC demo</span></li>
                <li className="flex items-center gap-3 text-sm text-pn-text-muted"><CheckCircle2 className="w-4 h-4 text-pn-text-soft" /> <span>Simular depósito de fondos</span></li>
                <li className="flex items-center gap-3 text-sm text-pn-text-muted"><CheckCircle2 className="w-4 h-4 text-pn-text-soft" /> <span>Simular compra Genesis y ver tokens</span></li>
                <li className="flex items-center gap-3 text-sm text-pn-text-muted"><CheckCircle2 className="w-4 h-4 text-pn-text-soft" /> <span>Crear órdenes y operar P2P demo</span></li>
                <li className="flex items-center gap-3 text-sm text-pn-text-muted"><CheckCircle2 className="w-4 h-4 text-pn-text-soft" /> <span>Revisar Ledger y auditoría</span></li>
              </ul>
            </MissionCard>

            <MissionCard className="p-8 border-pn-blue/20 bg-pn-blue/5">
              <LinkIcon className="w-8 h-8 text-pn-blue mb-6" />
              <h3 className="text-xl font-medium mb-4" data-testid="landing-what-connects-later">Qué se conectará después <InfoHint termKey="External-ready" inline /></h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-pn-text-muted"><div className="w-4 h-4 rounded-full border border-pn-blue/50" /> <span>MercadoPago Sandbox (Pagos externos)</span></li>
                <li className="flex items-center gap-3 text-sm text-pn-text-muted"><div className="w-4 h-4 rounded-full border border-pn-blue/50" /> <span>Foundry / Anvil (Blockchain Local)</span></li>
                <li className="flex items-center gap-3 text-sm text-pn-text-muted"><div className="w-4 h-4 rounded-full border border-pn-blue/50" /> <span>Proveedor KYC Real</span></li>
                <li className="flex items-center gap-3 text-sm text-pn-text-muted"><div className="w-4 h-4 rounded-full border border-pn-blue/50" /> <span>Oráculo Dinámico</span></li>
                <li className="flex items-center gap-3 text-sm text-pn-text-muted"><div className="w-4 h-4 rounded-full border border-pn-blue/50" /> <span>Cloud Demo Privado</span></li>
              </ul>
            </MissionCard>
          </section>

        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
