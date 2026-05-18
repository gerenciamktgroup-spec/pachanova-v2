'use client';

import React, { useState, useTransition } from 'react';
import { Users, ShieldCheck, ShieldAlert, DollarSign, Coins, Bell, TrendingUp, RefreshCw, Check, X, Eye } from 'lucide-react';

type UserRow = {
  id: string;
  fullName: string;
  email: string;
  kycStatus: 'pending' | 'approved' | 'rejected';
  isVerified: boolean;
  createdAt: string;
  availableUsd: string;
  availableTokens: string;
};

type AdminData = {
  totalUsers: number;
  kycPending: number;
  kycApproved: number;
  totalUsdRaised: string;
  treasuryAvailable: string;
  treasurySold: string;
  recentAuditLogs: any[];
  users: UserRow[];
};

function MetricCard({ icon: Icon, label, value, sub, color = 'text-pn-gold' }: { icon: any, label: string, value: string | number, sub?: string, color?: string }) {
  return (
    <div className="bg-pn-surface border border-pn-border rounded-xl p-5 flex gap-4 items-start">
      <div className="p-2.5 bg-pn-surface-strong rounded-lg">
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <p className="text-xs text-pn-text-soft uppercase tracking-wide mb-0.5">{label}</p>
        <p className={`text-xl font-semibold ${color}`}>{value}</p>
        {sub && <p className="text-xs text-pn-text-muted mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function KycBadge({ status }: { status: 'pending' | 'approved' | 'rejected' }) {
  const styles = {
    pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    approved: 'bg-green-500/15 text-green-400 border-green-500/30',
    rejected: 'bg-red-500/15 text-red-400 border-red-500/30',
  };
  const labels = { pending: 'PENDIENTE', approved: 'APROBADO', rejected: 'RECHAZADO' };
  return (
    <span className={`px-2 py-0.5 rounded border text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export function AdminOverviewClient({ data }: { data: AdminData }) {
  const [users, setUsers] = useState<UserRow[]>(data.users);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [kycLoading, setKycLoading] = useState<string | null>(null);
  const [balanceModal, setBalanceModal] = useState<UserRow | null>(null);
  const [balanceDelta, setBalanceDelta] = useState({ usd: 0, tokens: 0 });
  const [balanceReason, setBalanceReason] = useState('');
  const [announcement, setAnnouncement] = useState({ title: '', body: '' });
  const [announcementSent, setAnnouncementSent] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);

  const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleKyc = async (investorId: string, status: 'approved' | 'rejected') => {
    setKycLoading(investorId);
    try {
      const endpoint = status === 'approved' ? '/api/demo/actions/approve-kyc' : '/api/demo/actions/kyc-status';
      const body = status === 'approved'
        ? { investorId }
        : { investorId, status: 'rejected' };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(prev => prev.map(u => u.id === investorId ? { ...u, kycStatus: status } : u));
        if (selectedUser?.id === investorId) setSelectedUser(prev => prev ? { ...prev, kycStatus: status } : null);
        showToast(`KYC ${status === 'approved' ? 'aprobado' : 'rechazado'} ✅`);
      } else {
        showToast(data.error || 'Error al actualizar KYC', 'err');
      }
    } catch (e: any) {
      showToast(e.message, 'err');
    } finally {
      setKycLoading(null);
    }
  };

  const handleAdjustBalance = async () => {
    if (!balanceModal) return;
    try {
      const res = await fetch('/api/admin/adjust-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investorId: balanceModal.id,
          deltaUsd: balanceDelta.usd,
          deltaTokens: balanceDelta.tokens,
          reason: balanceReason || 'Ajuste manual admin',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(prev => prev.map(u => u.id === balanceModal.id ? {
          ...u,
          availableUsd: data.newUsd || u.availableUsd,
          availableTokens: data.newTokens || u.availableTokens,
        } : u));
        setBalanceModal(null);
        setBalanceDelta({ usd: 0, tokens: 0 });
        setBalanceReason('');
        showToast('Saldo actualizado ✅');
      } else {
        showToast(data.error || 'Error al ajustar saldo', 'err');
      }
    } catch (e: any) {
      showToast(e.message, 'err');
    }
  };

  const handleAnnouncement = async () => {
    if (!announcement.title || !announcement.body) return;
    try {
      const res = await fetch('/api/admin/announcement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: announcement.title, body: announcement.body, target: 'all' }),
      });
      const data = await res.json();
      if (res.ok) {
        setAnnouncementSent(true);
        showToast('Aviso enviado a todos los usuarios ✅');
        setTimeout(() => { setAnnouncementSent(false); setAnnouncement({ title: '', body: '' }); }, 3000);
      } else {
        showToast(data.error || 'Error enviando aviso', 'err');
      }
    } catch (e: any) {
      showToast(e.message, 'err');
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[200] px-5 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${
          toast.type === 'ok' ? 'bg-green-900/90 text-green-300 border border-green-500/40' : 'bg-red-900/90 text-red-300 border border-red-500/40'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard icon={Users} label="Usuarios" value={data.totalUsers} />
        <MetricCard icon={ShieldAlert} label="KYC Pendientes" value={data.kycPending} color="text-yellow-400" />
        <MetricCard icon={ShieldCheck} label="KYC Aprobados" value={data.kycApproved} color="text-green-400" />
        <MetricCard icon={DollarSign} label="USD Depositado" value={data.totalUsdRaised} color="text-blue-400" />
        <MetricCard icon={Coins} label="PACHA Disponible" value={data.treasuryAvailable} sub="en bóveda" />
        <MetricCard icon={TrendingUp} label="PACHA Vendido" value={data.treasurySold} color="text-purple-400" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Tabla de usuarios */}
        <div className="xl:col-span-2">
          <div className="bg-pn-surface border border-pn-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-pn-border flex justify-between items-center">
              <h3 className="font-semibold text-pn-text">Usuarios registrados</h3>
              <span className="text-xs text-pn-text-soft">{users.length} en total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-pn-border bg-pn-surface-strong">
                    <th className="text-left p-3 text-xs text-pn-text-soft font-medium">Usuario</th>
                    <th className="text-left p-3 text-xs text-pn-text-soft font-medium">KYC</th>
                    <th className="text-right p-3 text-xs text-pn-text-soft font-medium">USD</th>
                    <th className="text-right p-3 text-xs text-pn-text-soft font-medium">PACHA</th>
                    <th className="text-center p-3 text-xs text-pn-text-soft font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-pn-text-soft text-sm">
                        Sin usuarios registrados aún
                      </td>
                    </tr>
                  ) : users.map(u => (
                    <tr key={u.id} className="border-b border-pn-border/50 hover:bg-pn-surface-strong/50 transition-colors">
                      <td className="p-3">
                        <div className="font-medium text-pn-text">{u.fullName}</div>
                        <div className="text-xs text-pn-text-soft">{u.email}</div>
                      </td>
                      <td className="p-3">
                        <KycBadge status={u.kycStatus} />
                      </td>
                      <td className="p-3 text-right text-pn-text font-mono text-xs">
                        ${Number(u.availableUsd).toLocaleString()}
                      </td>
                      <td className="p-3 text-right text-pn-gold font-mono text-xs">
                        {Number(u.availableTokens).toLocaleString()}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1 justify-center">
                          {u.kycStatus === 'pending' && (
                            <>
                              <button
                                onClick={() => handleKyc(u.id, 'approved')}
                                disabled={kycLoading === u.id}
                                title="Aprobar KYC"
                                className="p-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded border border-green-500/30 transition-colors disabled:opacity-50"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleKyc(u.id, 'rejected')}
                                disabled={kycLoading === u.id}
                                title="Rechazar KYC"
                                className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded border border-red-500/30 transition-colors disabled:opacity-50"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => { setBalanceModal(u); setBalanceDelta({ usd: 0, tokens: 0 }); setBalanceReason(''); }}
                            title="Ajustar saldo"
                            className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded border border-blue-500/30 transition-colors"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedUser(u)}
                            title="Ver detalles"
                            className="p-1.5 bg-pn-surface-strong hover:bg-pn-border text-pn-text-soft rounded border border-pn-border transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar: Avisos + Audit */}
        <div className="space-y-6">
          {/* Avisos */}
          <div className="bg-pn-surface border border-pn-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-4 h-4 text-pn-gold" />
              <h3 className="font-semibold text-pn-text text-sm">Enviar aviso a usuarios</h3>
            </div>
            {announcementSent ? (
              <div className="text-center py-4">
                <Check className="w-10 h-10 text-green-500 mx-auto mb-2" />
                <p className="text-green-400 text-sm">¡Aviso enviado!</p>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  value={announcement.title}
                  onChange={e => setAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Título del aviso"
                  className="w-full bg-pn-bg border border-pn-border text-pn-text p-2.5 rounded text-sm focus:outline-none focus:border-pn-gold"
                />
                <textarea
                  value={announcement.body}
                  onChange={e => setAnnouncement(prev => ({ ...prev, body: e.target.value }))}
                  placeholder="Mensaje para todos los inversores..."
                  rows={3}
                  className="w-full bg-pn-bg border border-pn-border text-pn-text p-2.5 rounded text-sm focus:outline-none focus:border-pn-gold resize-none"
                />
                <button
                  onClick={handleAnnouncement}
                  disabled={!announcement.title || !announcement.body}
                  className="w-full bg-pn-gold text-pn-bg text-sm font-medium py-2.5 rounded hover:bg-pn-gold/90 transition-colors disabled:opacity-40"
                >
                  Enviar a todos
                </button>
              </div>
            )}
          </div>

          {/* Audit Log */}
          <div className="bg-pn-surface border border-pn-border rounded-xl p-5">
            <h3 className="font-semibold text-pn-text text-sm mb-4">Últimas acciones</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {data.recentAuditLogs.length === 0 ? (
                <p className="text-xs text-pn-text-soft text-center py-4">Sin eventos aún</p>
              ) : data.recentAuditLogs.map((log: any, i) => (
                <div key={i} className="border-l-2 border-pn-gold/30 pl-3 py-1">
                  <p className="text-xs font-medium text-pn-text">{log.action}</p>
                  <p className="text-xs text-pn-text-soft truncate">{log.details}</p>
                  <p className="text-[10px] text-pn-text-muted">{new Date(log.created_at).toLocaleString('es')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Ajustar Saldo */}
      {balanceModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-pn-bg border border-pn-border rounded-xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-semibold text-pn-text mb-1">Ajustar saldo</h3>
            <p className="text-sm text-pn-text-soft mb-5">{balanceModal.fullName}</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-pn-text-soft">Delta USD (+ agregar / - quitar)</label>
                <input
                  type="number"
                  value={balanceDelta.usd}
                  onChange={e => setBalanceDelta(prev => ({ ...prev, usd: Number(e.target.value) }))}
                  className="w-full bg-pn-surface border border-pn-border text-pn-text p-2.5 rounded mt-1 focus:outline-none focus:border-pn-gold"
                />
              </div>
              <div>
                <label className="text-xs text-pn-text-soft">Delta PACHA (+ agregar / - quitar)</label>
                <input
                  type="number"
                  value={balanceDelta.tokens}
                  onChange={e => setBalanceDelta(prev => ({ ...prev, tokens: Number(e.target.value) }))}
                  className="w-full bg-pn-surface border border-pn-border text-pn-text p-2.5 rounded mt-1 focus:outline-none focus:border-pn-gold"
                />
              </div>
              <div>
                <label className="text-xs text-pn-text-soft">Motivo del ajuste</label>
                <input
                  value={balanceReason}
                  onChange={e => setBalanceReason(e.target.value)}
                  placeholder="Ej: Corrección manual demo"
                  className="w-full bg-pn-surface border border-pn-border text-pn-text p-2.5 rounded mt-1 focus:outline-none focus:border-pn-gold text-sm"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setBalanceModal(null)} className="flex-1 py-2.5 border border-pn-border text-pn-text rounded hover:bg-pn-surface transition-colors text-sm">Cancelar</button>
              <button onClick={handleAdjustBalance} className="flex-1 py-2.5 bg-pn-gold text-pn-bg rounded hover:bg-pn-gold/90 transition-colors text-sm font-medium">Aplicar</button>
            </div>
          </div>
        </div>
      )}

      {/* Panel lateral usuario */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-pn-bg border-l border-pn-border h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="p-5 border-b border-pn-border flex justify-between items-center">
              <h3 className="font-semibold text-pn-text">Detalle del inversor</h3>
              <button onClick={() => setSelectedUser(null)} className="text-pn-text-soft hover:text-pn-text">✕</button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-3">
                {[
                  { label: 'Nombre', value: selectedUser.fullName },
                  { label: 'Email', value: selectedUser.email },
                  { label: 'ID Inversor', value: selectedUser.id.slice(0, 8) + '...' },
                  { label: 'Registro', value: new Date(selectedUser.createdAt).toLocaleDateString('es') },
                ].map(item => (
                  <div key={item.label} className="flex justify-between border-b border-pn-border/50 pb-2">
                    <span className="text-xs text-pn-text-soft">{item.label}</span>
                    <span className="text-xs text-pn-text font-medium">{item.value}</span>
                  </div>
                ))}
                <div className="flex justify-between border-b border-pn-border/50 pb-2">
                  <span className="text-xs text-pn-text-soft">Estado KYC</span>
                  <KycBadge status={selectedUser.kycStatus} />
                </div>
                <div className="flex justify-between border-b border-pn-border/50 pb-2">
                  <span className="text-xs text-pn-text-soft">Balance USD</span>
                  <span className="text-pn-gold font-medium text-sm">${Number(selectedUser.availableUsd).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-pn-text-soft">Balance PACHA</span>
                  <span className="text-pn-gold font-medium text-sm">{Number(selectedUser.availableTokens).toLocaleString()}</span>
                </div>
              </div>
              {selectedUser.kycStatus === 'pending' && (
                <div className="space-y-2 pt-4 border-t border-pn-border">
                  <p className="text-xs text-pn-text-soft mb-3">Acciones KYC</p>
                  <button
                    onClick={() => { handleKyc(selectedUser.id, 'approved'); setSelectedUser(null); }}
                    className="w-full py-2.5 bg-green-600/20 border border-green-500/30 text-green-400 rounded hover:bg-green-600/30 transition-colors text-sm font-medium"
                  >
                    ✅ Aprobar KYC
                  </button>
                  <button
                    onClick={() => { handleKyc(selectedUser.id, 'rejected'); setSelectedUser(null); }}
                    className="w-full py-2.5 bg-red-600/20 border border-red-500/30 text-red-400 rounded hover:bg-red-600/30 transition-colors text-sm"
                  >
                    ✕ Rechazar KYC
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
