'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Minus, Clock, CheckCircle2, ChevronRight, FileText } from 'lucide-react';
import { toast } from 'sonner';

const mockProposals = [
  {
    id: 'prop_1',
    title: 'Aprobación de Venta: Lote "Valle Sagrado #4"',
    description: 'Se ha recibido una oferta de compra por el lote completo por $120,000 USD (20% por encima de la valuación actual). Si se aprueba, se liquidará la bóveda y se distribuirán los fondos a los tokenholders.',
    status: 'active',
    endDate: '2023-12-15T23:59:59Z',
    votesFor: 45000,
    votesAgainst: 12000,
    votesAbstain: 5000,
    totalEligible: 100000,
  },
  {
    id: 'prop_2',
    title: 'Cambio de Proveedor de Auditoría KYC',
    description: 'Propuesta para migrar el proveedor de validación de identidad de Sumsub a Onfido para reducir costos operativos del fideicomiso en un 15%.',
    status: 'active',
    endDate: '2023-12-10T23:59:59Z',
    votesFor: 30000,
    votesAgainst: 40000,
    votesAbstain: 10000,
    totalEligible: 100000,
  },
  {
    id: 'prop_3',
    title: 'Distribución de Dividendos Q3 2023',
    description: 'Aprobar la distribución de $45,000 USD generados por rentas agrícolas en el Lote Ica-Sur a las billeteras de los inversores.',
    status: 'executed',
    endDate: '2023-10-01T23:59:59Z',
    votesFor: 85000,
    votesAgainst: 2000,
    votesAbstain: 1000,
    totalEligible: 100000,
  }
];

export default function GovernanceClient() {
  const [proposals, setProposals] = useState(mockProposals);
  const [votedProps, setVotedProps] = useState<Record<string, 'for' | 'against' | 'abstain'>>({});
  const [isVoting, setIsVoting] = useState<string | null>(null);

  const handleVote = (propId: string, voteType: 'for' | 'against' | 'abstain') => {
    setIsVoting(propId);
    
    // Simular delay de blockchain/BD
    setTimeout(() => {
      setVotedProps(prev => ({ ...prev, [propId]: voteType }));
      setIsVoting(null);
      
      toast.success('Voto Registrado Exitosamente', {
        description: `Has votado ${voteType === 'for' ? 'A FAVOR' : voteType === 'against' ? 'EN CONTRA' : 'ABSTENCIÓN'} con un peso de 1,250 PACHA.`
      });
    }, 1500);
  };

  const calculatePercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  return (
    <div className="space-y-6">
      
      {/* Active Proposals */}
      <div className="space-y-4">
        <h3 className="text-xl font-medium text-white mb-4">Votaciones Activas</h3>
        
        {proposals.filter(p => p.status === 'active').map(prop => {
          const totalVotes = prop.votesFor + prop.votesAgainst + prop.votesAbstain;
          const forPct = calculatePercentage(prop.votesFor, totalVotes);
          const againstPct = calculatePercentage(prop.votesAgainst, totalVotes);
          const abstainPct = calculatePercentage(prop.votesAbstain, totalVotes);
          const hasVoted = votedProps[prop.id];

          return (
            <div key={prop.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 transition-all hover:border-purple-500/30">
              <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2.5 py-1 rounded text-xs font-medium uppercase flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> Activa
                    </span>
                    <span className="text-xs text-white/50">Cierra en 5 días</span>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">{prop.title}</h4>
                    <p className="text-sm text-white/60 leading-relaxed">{prop.description}</p>
                  </div>

                  <button className="text-[#c5a46d] text-sm font-medium flex items-center gap-1 hover:text-[#b09260] transition-colors">
                    <FileText className="w-4 h-4" /> Leer documento completo de propuesta
                  </button>
                </div>

                {/* Voting Area */}
                <div className="w-full lg:w-80 bg-black/20 rounded-xl p-5 border border-white/5 flex flex-col justify-between">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-400 font-medium">A Favor ({forPct}%)</span>
                      <span className="text-white/50">{prop.votesFor.toLocaleString()} PACHA</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400" style={{ width: `${forPct}%` }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-red-400 font-medium">En Contra ({againstPct}%)</span>
                      <span className="text-white/50">{prop.votesAgainst.toLocaleString()} PACHA</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-red-400" style={{ width: `${againstPct}%` }}></div>
                    </div>
                  </div>

                  {hasVoted ? (
                    <div className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-medium ${
                      hasVoted === 'for' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                      hasVoted === 'against' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                      'bg-white/5 border-white/10 text-white/60'
                    }`}>
                      <CheckCircle2 className="w-5 h-5" />
                      Has votado {hasVoted === 'for' ? 'A Favor' : hasVoted === 'against' ? 'En Contra' : 'Abstención'}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => handleVote(prop.id, 'for')}
                        disabled={isVoting !== null}
                        className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 py-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all disabled:opacity-50"
                      >
                        {isVoting === prop.id ? <div className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin"/> : <ThumbsUp className="w-4 h-4" />}
                        <span className="text-xs font-medium">A Favor</span>
                      </button>
                      <button 
                        onClick={() => handleVote(prop.id, 'against')}
                        disabled={isVoting !== null}
                        className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 py-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all disabled:opacity-50"
                      >
                        {isVoting === prop.id ? <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-400 rounded-full animate-spin"/> : <ThumbsDown className="w-4 h-4" />}
                        <span className="text-xs font-medium">En Contra</span>
                      </button>
                      <button 
                        onClick={() => handleVote(prop.id, 'abstain')}
                        disabled={isVoting !== null}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 py-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all disabled:opacity-50"
                      >
                        {isVoting === prop.id ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Minus className="w-4 h-4" />}
                        <span className="text-xs font-medium">Abstenerse</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Past Proposals */}
      <div className="pt-8 space-y-4">
        <h3 className="text-xl font-medium text-white mb-4">Votaciones Pasadas</h3>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          {proposals.filter(p => p.status !== 'active').map((prop, idx) => (
            <div key={prop.id} className={`p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${idx !== 0 ? 'border-t border-white/10' : ''} hover:bg-white/5 transition-colors cursor-pointer group`}>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                    Ejecutada
                  </span>
                  <span className="text-xs text-white/50">{new Date(prop.endDate).toLocaleDateString()}</span>
                </div>
                <h4 className="text-base font-medium text-white group-hover:text-[#c5a46d] transition-colors">{prop.title}</h4>
              </div>
              <div className="flex items-center gap-2 text-white/50 group-hover:text-white transition-colors">
                <span className="text-sm font-medium">Ver Resultados</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
