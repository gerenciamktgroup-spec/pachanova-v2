'use client';

import React, { useState } from 'react';

interface Proposal {
  id: string;
  title: string;
  description: string | null;
  status: string;
  relatedPropertyId: string | null;
  startAt: string | Date;
  endAt: string | Date | null;
  quorumRequired: string | null;
  vertexPrediction: string | null;
}

interface MyVote {
  proposalId: string;
  choice: string;
  votingPower: string;
  createdAt: string | Date;
}

interface Tally {
  for: number;
  against: number;
  abstain: number;
  powerFor: number;
  powerAgainst: number;
  powerAbstain: number;
}

interface Props {
  proposals: Proposal[];
  totalPachaHoldings: number;
  stakedPacha?: number;
  baseHoldings?: number;
  myVotes: MyVote[];
  tallies: Record<string, Tally>;
  investorId?: string;
}

export default function GovernanceVotingClient({ proposals, totalPachaHoldings, stakedPacha: initialStaked = 0, baseHoldings: initialBase = 0, myVotes: initialMyVotes, tallies: initialTallies }: Props) {
  const [myVotes, setMyVotes] = useState<Record<string, MyVote>>(() => {
    const map: Record<string, MyVote> = {};
    initialMyVotes.forEach(v => { map[v.proposalId] = v; });
    return map;
  });
  const [tallies, setTallies] = useState<Record<string, Tally>>(initialTallies);
  const [loading, setLoading] = useState<Record<string, string | null>>({}); // proposalId -> choice or null
  const [messages, setMessages] = useState<Record<string, string>>({});

  // Fase42: live staked + total power (updated on stake/unstake without full reload)
  const [stakedAmount, setStakedAmount] = useState<number>(initialStaked);
  const [totalPower, setTotalPower] = useState<number>(totalPachaHoldings);
  const [stakeInput, setStakeInput] = useState<string>('');
  const [stakeLoading, setStakeLoading] = useState<boolean>(false);

  // Fase36: simple create proposal form state (demo, posts to API, creates active for PNC)
  const [createTitle, setCreateTitle] = useState('');
  const [createPNC, setCreatePNC] = useState('PNC-PAR-001');
  const [creating, setCreating] = useState(false);

  const getMyVoteFor = (pid: string) => myVotes[pid];
  const getTally = (pid: string): Tally => tallies[pid] || { for: 0, against: 0, abstain: 0, powerFor: 0, powerAgainst: 0, powerAbstain: 0 };

  async function submitVote(proposalId: string, choice: 'for' | 'against' | 'abstain') {
    if (loading[proposalId]) return;
    if (getMyVoteFor(proposalId)) {
      setMessages(m => ({ ...m, [proposalId]: 'Ya votaste en esta propuesta.' }));
      return;
    }

    setLoading(l => ({ ...l, [proposalId]: choice }));
    setMessages(m => ({ ...m, [proposalId]: '' }));

    try {
      const res = await fetch('/api/governance/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId, choice }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        const err = json.error || 'Error al votar';
        setMessages(m => ({ ...m, [proposalId]: err }));
        if (json.existingVote) {
          // sync state
          setMyVotes(v => ({ ...v, [proposalId]: { proposalId, choice: json.existingVote.choice, votingPower: json.existingVote.power, createdAt: json.existingVote.at } }));
        }
        return;
      }

      // Success: record local vote + update tally optimistic
      const newVote: MyVote = {
        proposalId,
        choice,
        votingPower: (json.yourPower || totalPower).toString(),
        createdAt: new Date().toISOString(),
      };
      setMyVotes(v => ({ ...v, [proposalId]: newVote }));

      // Fase35: store onchain from response
      if (json.onchain) {
        setMyVotes(v => ({
          ...v,
          [proposalId]: {
            ...newVote,
            onchain: json.onchain
          } as any
        }));
      }

      // Refresh tally from server (GET summary)
      try {
        const refresh = await fetch(`/api/governance/vote?proposalId=${proposalId}`);
        const rj = await refresh.json();
        if (rj.success && rj.summary) {
          const s = rj.summary;
          setTallies(t => ({
            ...t,
            [proposalId]: {
              for: s.for?.count || 0,
              against: s.against?.count || 0,
              abstain: s.abstain?.count || 0,
              powerFor: s.for?.power || 0,
              powerAgainst: s.against?.power || 0,
              powerAbstain: s.abstain?.power || 0,
            }
          }));
        }
      } catch {}

      setMessages(m => ({ ...m, [proposalId]: json.message || `Voto "${choice}" registrado con ${totalPower.toLocaleString()} PACHA.` }));
    } catch (e: any) {
      setMessages(m => ({ ...m, [proposalId]: e.message || 'Fallo de red al votar' }));
    } finally {
      setLoading(l => ({ ...l, [proposalId]: null }));
    }
  }

  async function handleStakeAction(action: 'stake' | 'unstake') {
    if (stakeLoading || !stakeInput) return;
    const amount = parseFloat(stakeInput);
    if (isNaN(amount) || amount <= 0) {
      setMessages(m => ({ ...m, stake: 'Por favor ingresa un monto válido mayor a 0.' }));
      return;
    }
    setStakeLoading(true);
    setMessages(m => ({ ...m, stake: '' }));
    try {
      const res = await fetch('/api/governance/stake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, amount })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setMessages(m => ({ ...m, stake: json.error || 'Error al procesar staking' }));
        return;
      }
      setStakedAmount(json.newStakedAmount);
      setTotalPower(json.totalPower);
      setStakeInput('');
      setMessages(m => ({ ...m, stake: json.message }));
    } catch (e: any) {
      setMessages(m => ({ ...m, stake: e.message || 'Error de red' }));
    } finally {
      setStakeLoading(false);
    }
  }

  async function createProposal() {
    if (!createTitle) return;
    setCreating(true);
    try {
      const res = await fetch('/api/governance/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: createTitle, relatedPNC: createPNC, description: `Propuesta Fase36 para ${createPNC}` })
      });
      const j = await res.json();
      if (j.success) {
        setMessages(m => ({ ...m, create: `Propuesta creada: ${j.proposal?.title}. Recarga para votar.` }));
        setCreateTitle('');
      } else {
        setMessages(m => ({ ...m, create: j.error || 'Error creando' }));
      }
    } catch (e: any) {
      setMessages(m => ({ ...m, create: e.message }));
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Fase42: DeFi Staking Panel */}
      <div className="p-4 border border-violet-850/40 rounded bg-pn-surface/50 space-y-3">
        <div className="flex justify-between items-center border-b border-pn-border pb-2">
          <div className="text-xs text-violet-400 font-mono font-bold tracking-[1px] uppercase">
            Fase 42: DeFi Staking & Pacha Power Accrual
          </div>
          <div className="text-[10px] text-pn-text-soft/70">
            Poder normal: {initialBase.toLocaleString()} PACHA | Staked: {stakedAmount.toLocaleString()} PACHA
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex-1 text-xs text-pn-text-soft">
            Bloquea tus tokens PACHA para aumentar tu poder de voto en la gobernanza. El staking es instantáneo y se suma a tus holdings.
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="number"
              value={stakeInput}
              onChange={e => setStakeInput(e.target.value)}
              placeholder="Monto PACHA"
              className="w-28 bg-pn-bg border border-pn-border rounded px-2 text-sm text-white"
              disabled={stakeLoading}
            />
            <button
              onClick={() => handleStakeAction('stake')}
              disabled={stakeLoading || !stakeInput}
              className="px-3 py-1.5 text-xs bg-violet-700 hover:bg-violet-650 disabled:opacity-60 text-white rounded font-medium transition"
            >
              {stakeLoading ? 'Procesando...' : 'Stake'}
            </button>
            <button
              onClick={() => handleStakeAction('unstake')}
              disabled={stakeLoading || !stakeInput || stakedAmount <= 0}
              className="px-3 py-1.5 text-xs border border-violet-700 text-violet-300 hover:bg-violet-950/20 disabled:opacity-60 rounded font-medium transition"
            >
              {stakeLoading ? 'Procesando...' : 'Unstake'}
            </button>
          </div>
        </div>
        {messages.stake && <div className="text-xs text-pn-gold">{messages.stake}</div>}
      </div>

      {/* Fase36: Create proposal (demo for admin/land/orq auto) */}
      <div className="p-3 border border-pn-gold/30 rounded bg-pn-surface/50">
        <div className="text-xs text-pn-gold mb-1">FASE36: CREAR PROPUESTA (demo - orq/landbank auto en futuro)</div>
        <div className="flex gap-2">
          <input value={createTitle} onChange={e=>setCreateTitle(e.target.value)} placeholder="Título de propuesta (ej: Lanzamiento PNC-XXX Fase3)" className="flex-1 bg-pn-bg border border-pn-border rounded px-2 text-sm" />
          <select value={createPNC} onChange={e=>setCreatePNC(e.target.value)} className="bg-pn-bg border border-pn-border rounded px-2 text-xs">
            <option>PNC-PAR-001</option><option>PNC-SB-003</option><option>PNC-CHI-004</option>
          </select>
          <button onClick={createProposal} disabled={creating || !createTitle} className="px-3 py-1 text-xs border border-pn-gold text-pn-gold rounded hover:bg-pn-gold/10">Crear + Activar</button>
        </div>
        {messages.create && <div className="text-[10px] text-pn-gold mt-1">{messages.create}</div>}
      </div>

      {proposals.map((p, idx) => {
        const t = getTally(p.id);
        const my = getMyVoteFor(p.id);
        const totalVotes = t.for + t.against + t.abstain;
        const totalPower = t.powerFor + t.powerAgainst + t.powerAbstain;
        const pctFor = totalPower > 0 ? Math.round((t.powerFor / totalPower) * 100) : 0;
        const pctAgainst = totalPower > 0 ? Math.round((t.powerAgainst / totalPower) * 100) : 0;
        const pctAbstain = totalPower > 0 ? Math.round((t.powerAbstain / totalPower) * 100) : 0;
        const isLoading = loading[p.id];
        const msg = messages[p.id];

        return (
          <div key={p.id} className="bg-pn-surface border border-pn-border rounded-2xl p-6 hover:border-pn-gold/30 transition-colors">
            <div className="flex flex-col md:flex-row md:items-start gap-4 justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xs px-2 py-0.5 bg-pn-gold/10 text-pn-gold border border-pn-gold/40 rounded">PNC-GOV-{String(idx+1).padStart(3,'0')}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${p.status === 'active' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                    {p.status.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white leading-tight">{p.title}</h3>
                {p.description && <p className="mt-1.5 text-sm text-pn-text-soft line-clamp-3">{p.description}</p>}
                <div className="mt-2 text-[10px] text-pn-text-soft/70">
                  Quórum requerido: {p.quorumRequired || '10'}% • Peso total emitido: {totalPower.toLocaleString()} PACHA
                </div>
                {p.vertexPrediction && (() => {
                  try {
                    const pred = JSON.parse(p.vertexPrediction);
                    return (
                      <div className="mt-3 p-3 bg-violet-950/30 border border-violet-800/40 rounded-xl text-xs space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] px-1.5 py-0.5 bg-violet-800/30 text-violet-300 border border-violet-700/50 rounded uppercase tracking-[1px] font-bold">
                            Vertex AI Predict
                          </span>
                          <span className="text-[10px] text-violet-400 font-medium">
                            {Math.round((pred.outcomeProb || 0.75) * 100)}% prob. de aprobación
                          </span>
                          {pred.impactNetYieldDelta && (
                            <span className="text-[10px] text-emerald-400 font-semibold">
                              ({pred.impactNetYieldDelta} impacto neto)
                            </span>
                          )}
                        </div>
                        <p className="text-pn-text-soft text-xs italic leading-relaxed">
                          "{pred.rationale || 'Sin justificación disponible'}"
                        </p>
                        <div className="text-[9px] text-pn-text-soft/50 font-mono">
                          Modelo: {pred.vertex_gcp?.based_on || 'gcloud_vertex_fallback'} • Confianza: {pred.vertex_gcp?.conf || '0.73'}
                        </div>
                      </div>
                    );
                  } catch (e) {
                    return null;
                  }
                })()}
              </div>

              <div className="md:w-56 shrink-0 text-xs md:text-right">
                <div className="text-pn-text-soft">Tu poder en esta votación</div>
                <div className="font-semibold text-xl tabular-nums text-white">{totalPower.toLocaleString()} PACHA</div>
                {my && (
                  <div className="mt-1 inline-block text-[10px] px-2 py-0.5 bg-blue-950/60 border border-blue-800 text-blue-400 rounded">
                    Votaste: <strong>{my.choice.toUpperCase()}</strong> ({parseFloat(my.votingPower).toLocaleString()} PACHA)
                    {(my as any).onchain && (
                      <div className="mt-1 text-emerald-300 font-mono">
                        ONCHAIN ATTEST tx={(my as any).onchain.txHash?.slice(0,12)}... @{(my as any).onchain.blockNum} (PACHA power real + PNC + 23125)
                      </div>
                    )}
                  </div>
                )}
                {my && (my as any).onchain && ! (my as any).onchainVerified && (
                  <button
                    onClick={async () => {
                      const res = await fetch('/api/governance/vote', { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ voteId: (my as any).id || 'latest' }) });
                      const j = await res.json();
                      if (j.success) {
                        setMessages(m => ({ ...m, [p.id]: j.message }));
                        setMyVotes(v => ({ ...v, [p.id]: { ...(v[p.id] as any), onchainVerified: j.verified } as any }));
                      }
                    }}
                    className="ml-2 text-[9px] px-1 py-0.5 border border-emerald-600 text-emerald-300 rounded hover:bg-emerald-900/20"
                  >
                    ✓ VERIFY ONCHAIN
                  </button>
                )}
              </div>
            </div>

            {/* Results bar */}
            <div className="mt-5">
              <div className="flex justify-between text-xs mb-1.5 text-pn-text-soft">
                <span className="text-emerald-400">A FAVOR • {t.for} votos • {t.powerFor.toLocaleString()} PACHA ({pctFor}%)</span>
                <span className="text-red-400">EN CONTRA • {t.against} votos • {t.powerAgainst.toLocaleString()} PACHA ({pctAgainst}%)</span>
                <span className="text-amber-400">ABSTENCIÓN • {t.abstain} • {t.powerAbstain.toLocaleString()} ({pctAbstain}%)</span>
              </div>
              <div className="h-2.5 w-full bg-pn-bg rounded-full overflow-hidden flex border border-pn-border">
                <div className="bg-emerald-500 h-full transition-all" style={{ width: `${pctFor}%` }} />
                <div className="bg-red-500 h-full transition-all" style={{ width: `${pctAgainst}%` }} />
                <div className="bg-amber-500 h-full transition-all" style={{ width: `${pctAbstain}%` }} />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {!my ? (
                <>
                  <button
                    onClick={() => submitVote(p.id, 'for')}
                    disabled={!!isLoading}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-sm font-medium transition active:scale-[0.985]"
                  >
                    {isLoading === 'for' ? 'Registrando...' : '✓ A FAVOR'}
                  </button>
                  <button
                    onClick={() => submitVote(p.id, 'against')}
                    disabled={!!isLoading}
                    className="px-5 py-2 rounded-xl bg-red-600/90 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-medium transition active:scale-[0.985]"
                  >
                    {isLoading === 'against' ? 'Registrando...' : '✗ EN CONTRA'}
                  </button>
                  <button
                    onClick={() => submitVote(p.id, 'abstain')}
                    disabled={!!isLoading}
                    className="px-5 py-2 rounded-xl bg-amber-600/90 hover:bg-amber-600 disabled:opacity-60 text-white text-sm font-medium transition active:scale-[0.985]"
                  >
                    {isLoading === 'abstain' ? 'Registrando...' : '– ABSTENERSE'}
                  </button>
                </>
              ) : (
                <div className="text-sm px-4 py-2 rounded-xl bg-pn-bg border border-pn-border text-pn-text-soft">
                  Voto emitido • Gracias por participar en la gobernanza RWA.
                </div>
              )}

              {msg && <span className="text-xs text-pn-gold ml-2">{msg}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
