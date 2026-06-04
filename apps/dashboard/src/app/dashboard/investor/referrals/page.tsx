import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq } from 'drizzle-orm';
import { createServerClient } from '@/utils/supabase/server';
import { Users, TrendingUp, Trophy, Share2, Crown, ChevronRight } from 'lucide-react';
import ApplyReferralClient from './ApplyReferralClient';

export const dynamic = 'force-dynamic';

export default async function ReferralsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userEmail = user?.email || 'investor@pachanova.local';

  const investor = await db.query.investors.findFirst({
    where: eq(schema.investors.email, userEmail),
  });

  if (!investor) return <div>Investor not found</div>;

  let profile = await db.query.gamification.findFirst({
    where: eq(schema.gamification.investorId, investor.id),
  });

  if (!profile) {
    const randomCode = `PACHA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const [newProf] = await db.insert(schema.gamification).values({
      investorId: investor.id,
      referralCode: randomCode,
    }).returning();
    profile = newProf;
  }

  const yieldBoost = parseFloat(profile.yieldBoostPct) * 100;
  const votingBoost = parseFloat(profile.votingBoostPct) * 100;
  
  const getTierColor = (tier: string) => {
    switch(tier) {
      case 'PLATINUM': return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.2)]';
      case 'GOLD': return 'text-amber-400 border-amber-500/30 bg-amber-500/10 shadow-[0_0_15px_rgba(251,191,36,0.2)]';
      case 'SILVER': return 'text-zinc-300 border-zinc-400/30 bg-zinc-400/10 shadow-[0_0_15px_rgba(161,161,170,0.2)]';
      default: return 'text-orange-700 border-orange-700/30 bg-orange-700/10';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="pn-card bg-[#0a111f] text-white p-6 md:p-8 relative overflow-hidden">
        <div className="pn-gradient-radial absolute inset-0 opacity-40"></div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-pn-gold/15 text-pn-gold border border-pn-gold/20">
            <Trophy className="w-3.5 h-3.5" />
            Gamification Engine
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Referidos y Recompensas (Fase 54)</h2>
          <p className="text-sm text-pn-text-muted max-w-xl">
            Invita a otros inversores a unirse a PachaNova. Gana puntos, aumenta tu nivel (Tier) y obtén aceleradores de rentabilidad (Yield Boosts) y poder de voto en la gobernanza descentralizada.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5 flex flex-col justify-center">
          <div className="text-[10px] uppercase text-pn-text-soft flex justify-between items-center mb-1">
            Nivel Actual
            <Crown className="w-4 h-4 text-white/50" />
          </div>
          <div className={`text-2xl font-black italic tracking-wide uppercase mt-1 px-3 py-1 rounded-lg border w-fit ${getTierColor(profile.currentTier)}`}>
            {profile.currentTier}
          </div>
          <div className="text-xs text-pn-text-muted mt-2">Puntos Totales: <strong className="text-white">{parseInt(profile.points).toLocaleString()}</strong></div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="text-[10px] uppercase text-pn-text-soft flex justify-between items-center mb-1">
            Red de Referidos
            <Users className="w-4 h-4 text-white/50" />
          </div>
          <div className="text-3xl font-bold text-white mt-1 tabular-nums">
            {profile.totalReferrals}
          </div>
          <div className="text-xs text-pn-text-muted mt-1">Inversores invitados exitosamente</div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="text-[10px] uppercase text-pn-text-soft flex justify-between items-center mb-1">
            Yield Boost Activo
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-emerald-400 mt-1 tabular-nums">
            +{yieldBoost.toFixed(2)}%
          </div>
          <div className="text-xs text-pn-text-muted mt-1">Rentabilidad adicional sobre tus rentas</div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="text-[10px] uppercase text-pn-text-soft flex justify-between items-center mb-1">
            Voting Power Boost
            <Trophy className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-3xl font-bold text-violet-400 mt-1 tabular-nums">
            +{votingBoost.toFixed(0)}%
          </div>
          <div className="text-xs text-pn-text-muted mt-1">Poder de voto extra en la gobernanza</div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-pn-gold" />
            Tu Código de Referido
          </h3>
          <p className="text-sm text-pn-text-muted mb-4">
            Comparte este código con tus conocidos. Por cada inversor que se registre e invierta usando tu código, ganarás 1,000 puntos y un aumento del +5% en tu poder de voto de gobernanza. Ellos recibirán un +0.5% en Yield Boost.
          </p>
          <div className="flex flex-col gap-3">
            <div className="bg-black/40 border border-white/10 rounded-xl p-4 flex justify-between items-center">
              <span className="font-mono text-2xl font-bold tracking-widest text-emerald-300 select-all">
                {profile.referralCode}
              </span>
            </div>
          </div>
        </GlassCard>

        <ApplyReferralClient currentReferredBy={profile.referredById} />
      </div>

    </div>
  );
}
