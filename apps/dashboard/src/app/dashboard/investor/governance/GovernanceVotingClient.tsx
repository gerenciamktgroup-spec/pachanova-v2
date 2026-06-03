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
  myVotes: MyVote[];
  tallies: Record<string, Tally>;
  investorId?: string;
}

export default function GovernanceVotingClient({ proposals, totalPachaHoldings, myVotes: initialMyVotes, tallies: initialTallies }: Props) {
  const [myVotes, setMyVotes] = useState<Record<string, MyVote>>(() => {
    const map: Record<string, MyVote> = {};
    initialMyVotes.forEach(v => { map[v.proposalId] = v; });
    return map;
  });
  const [tallies, setTallies] = useState<Record<string, Tally>>(initialTallies);
  const [loading, setLoading] = useState<Record<string, string | null>>({}); // proposalId -> choice or null
  const [messages, setMessages] = useState<Record<string, string>>({});

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
        votingPower: (json.yourPower || totalPachaHoldings).toString(),
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

      setMessages(m => ({ ...m, [proposalId]: json.message || `Voto "${choice}" registrado con ${totalPachaHoldings.toLocaleString()} PACHA.` }));
    } catch (e: any) {
      setMessages(m => ({ ...m, [proposalId]: e.message || 'Fallo de red al votar' }));
    } finally {
      setLoading(l => ({ ...l, [proposalId]: null }));
    }
  }

  return (
    <div className="space-y-4">
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
              </div>

              <div className="md:w-56 shrink-0 text-xs md:text-right">
                <div className="text-pn-text-soft">Tu poder en esta votación</div>
                <div className="font-semibold text-xl tabular-nums text-white">{totalPachaHoldings.toLocaleString()} PACHA</div>
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
                        setMessages(m => ({ ...m, [proposalId]: j.message }));
                        setMyVotes(v => ({ ...v, [proposalId]: { ...(v[proposalId] as any), onchainVerified: j.verified } as any }));
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
