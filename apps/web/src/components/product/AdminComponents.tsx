"use client";

import React, { useState } from "react";
import { MissionCard } from "@/components/mission/MissionCard";
import { MetricTile } from "@/components/mission/MetricTile";
import { IntegrationStatusBadge } from "@/components/mission/IntegrationStatusBadge";
import { CommandButton } from "@/components/mission/CommandButton";
import { TimelineRail, TimelineItem } from "@/components/mission/TimelineRail";
import { TokenAmount, SquareMeterAmount, UserStatusPill, DataGrid, DataGridRow, DataGridCell, ProductEmptyState } from "./SharedComponents";
import { AdminDashboardView, UserAdminView } from "@/types/product";
import { tokensToSquareMeters } from "@/lib/product/math";
import Link from "next/link";
import { ShieldCheck, Settings } from "lucide-react";

export function AdminMissionOverview({ view }: { view: AdminDashboardView }) {
  return (
    <MissionCard className="bg-gradient-to-br from-pn-surface to-pn-surface-strong border-pn-border">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h2 className="text-xl font-light tracking-tighter text-pn-text">Platform Overview</h2>
          <p className="text-sm text-pn-text-muted">Resumen operativo del Sandbox Local.</p>
        </div>
        <IntegrationStatusBadge status="CONNECTED" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricTile label="Usuarios" value={view.overview.totalUsers.toString()} helper={`${view.overview.activeUsers} activos`} />
        <MetricTile label="System Health" value={view.overview.systemHealth} helper="No issues" trend="up" />
        <MetricTile label="PACHA Distribuido" value={view.overview.totalTokensDistributed} unit="PACHA" />
        <MetricTile label="Production Env" value="Disconnected" helper="Safe Demo" trend="up" />
      </div>
    </MissionCard>
  );
}

export function TreasuryMetricsPanel({ view }: { view: AdminDashboardView }) {
  return (
    <MissionCard title="Tesorería Demo (Sandbox)">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-pn-surface-strong rounded border border-pn-border">
          <p className="text-xs text-pn-text-soft uppercase mb-1">Total Supply PACHA</p>
          <TokenAmount amount={500000} />
        </div>
        <div className="p-4 bg-pn-surface-strong rounded border border-pn-border">
          <p className="text-xs text-pn-text-soft uppercase mb-1">Superficie Total</p>
          <SquareMeterAmount amount={50000} />
        </div>
      </div>
      <div className="space-y-3 border-t border-pn-border pt-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-pn-text-soft">Tokens Emitidos</span>
          <span className="text-pn-text font-medium">{view.treasury.totalTokensIssued}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-pn-text-soft">Tokens Disponibles</span>
          <span className="text-pn-text font-medium">{view.treasury.totalTokensAvailable}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-pn-text-soft">Recaudación (USD Demo)</span>
          <span className="text-pn-text font-medium">{view.treasury.totalUsdRaised}</span>
        </div>
      </div>
    </MissionCard>
  );
}

export function AdminUsersDataGrid({ users }: { users: UserAdminView[] }) {
  const [selectedUser, setSelectedUser] = useState<UserAdminView | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const handleReviewFlag = async () => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/demo/actions/admin-user-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser.id === "demo-investor-123" ? "00000000-0000-0000-0000-000000000000" : selectedUser.id, action: "FLAG_FOR_REVIEW" }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ ok: false, message: "Error de red local" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKycUpdate = async (status: 'approved' | 'pending' | 'rejected') => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/demo/actions/kyc-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ investorId: selectedUser.id === "demo-investor-123" ? "00000000-0000-0000-0000-000000000123" : selectedUser.id, status }),
      });
      const data = await res.json();
      if (data.success) {
        setResult({ ok: true, message: `KYC actualizado a ${status}` });
        // update local state
        selectedUser.kycStatus = status;
      } else {
        setResult({ ok: false, message: data.error || "Error al actualizar" });
      }
    } catch (e) {
      setResult({ ok: false, message: "Error de red local" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MissionCard title="Directorio de Usuarios Demo" data-testid="admin-users-grid">
      {users.length === 0 ? (
        <ProductEmptyState title="Sin usuarios" description="No se encontraron registros de usuario en el sandbox." />
      ) : (
        <>
          <DataGrid headers={["Usuario", "Email", "Role", "KYC", "PACHA", "m²", "Acciones"]}>
            {users.map(user => {
              const balance = Number(user.balance.availableTokens.replace(/,/g, ''));
              const sqm = tokensToSquareMeters(balance);
              
              return (
                <DataGridRow key={user.id}>
                  <DataGridCell><span className="text-pn-text font-medium">{user.fullName}</span></DataGridCell>
                  <DataGridCell>{user.email}</DataGridCell>
                  <DataGridCell><span className="text-xs">{user.role}</span></DataGridCell>
                  <DataGridCell><UserStatusPill status={user.kycStatus} /></DataGridCell>
                  <DataGridCell><TokenAmount amount={user.balance.availableTokens} /></DataGridCell>
                  <DataGridCell><SquareMeterAmount amount={sqm} /></DataGridCell>
                  <DataGridCell>
                    <CommandButton variant="ghost" className="h-8 px-2" onClick={() => setSelectedUser(user)}>Detalles</CommandButton>
                  </DataGridCell>
                </DataGridRow>
              );
            })}
          </DataGrid>

          {selectedUser && (
            <div className="fixed inset-0 z-[100] flex justify-end bg-pn-bg/80 backdrop-blur-sm">
              <div className="w-full max-w-md bg-pn-bg border-l border-pn-border shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-6 border-b border-pn-border flex justify-between items-center bg-pn-surface-strong/50">
                  <h2 className="text-lg font-semibold text-pn-text">Detalles del Usuario</h2>
                  <button onClick={() => { setSelectedUser(null); setResult(null); }} className="text-pn-text-muted hover:text-pn-text transition-colors">✕</button>
                </div>
                <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
                  
                  <div className="space-y-4 bg-pn-surface-strong p-4 rounded-lg border border-pn-border">
                    <div className="flex justify-between border-b border-pn-border/50 pb-2">
                      <span className="text-xs text-pn-text-soft">Nombre</span>
                      <span className="text-sm text-pn-text font-medium">{selectedUser.fullName}</span>
                    </div>
                    <div className="flex justify-between border-b border-pn-border/50 pb-2">
                      <span className="text-xs text-pn-text-soft">Email</span>
                      <span className="text-sm text-pn-text">{selectedUser.email}</span>
                    </div>
                    <div className="flex justify-between border-b border-pn-border/50 pb-2">
                      <span className="text-xs text-pn-text-soft">Rol</span>
                      <span className="text-sm text-pn-text">{selectedUser.role}</span>
                    </div>
                    <div className="flex justify-between border-b border-pn-border/50 pb-2">
                      <span className="text-xs text-pn-text-soft">Estado KYC (Demo)</span>
                      <UserStatusPill status={selectedUser.kycStatus} />
                    </div>
                    <div className="flex justify-between border-b border-pn-border/50 pb-2">
                      <span className="text-xs text-pn-text-soft">Token Balance</span>
                      <TokenAmount amount={selectedUser.balance.availableTokens} />
                    </div>
                  </div>

                  {result ? (
                    <div className={`p-4 rounded-lg border flex gap-3 ${result.ok ? "text-pn-success border-pn-success/30 bg-pn-success/10" : "text-pn-danger border-pn-danger/30 bg-pn-danger/10"}`}>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">{result.ok ? "Revisión Registrada" : "Error"}</h4>
                        <p className="text-xs opacity-90">{result.message}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-[10px] text-pn-warning text-center">
                        Controles de KYC Demo Local
                      </p>
                      <div className="flex gap-2">
                        <CommandButton variant="primary" fullWidth onClick={() => handleKycUpdate('approved')} disabled={isSubmitting || selectedUser.kycStatus === 'approved'}>
                          Aprobar KYC
                        </CommandButton>
                        <CommandButton variant="outline" fullWidth onClick={() => handleKycUpdate('rejected')} disabled={isSubmitting || selectedUser.kycStatus === 'rejected'}>
                          Rechazar
                        </CommandButton>
                      </div>
                      <CommandButton variant="ghost" fullWidth onClick={handleReviewFlag} disabled={isSubmitting} data-testid="admin-user-review-action">
                        {isSubmitting ? "Procesando..." : "Marcar para revisión general"}
                      </CommandButton>
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}
        </>
      )}
    </MissionCard>
  );
}

export function AuditLogTimeline({ view }: { view: AdminDashboardView }) {
  const items: TimelineItem[] = view.recentAuditLogs.map(log => ({
    id: log.id,
    title: log.action,
    description: <span className="text-pn-text-muted">{log.details} - por {log.actor}</span>,
    status: "completed",
    time: new Date(log.timestamp).toLocaleString(),
    icon: <ShieldCheck className="h-4 w-4 text-pn-success" />
  }));

  return (
    <MissionCard title="Audit Logs (Local)" data-testid="audit-log-timeline">
      {items.length === 0 ? (
        <ProductEmptyState title="Sin Eventos" description="No hay eventos de auditoría registrados." />
      ) : (
        <TimelineRail items={items} />
      )}
    </MissionCard>
  );
}

export function IntegrationEventsPanel({ view }: { view: AdminDashboardView }) {
  return (
    <MissionCard title="Integration Webhooks" data-testid="admin-integration-events">
      {view.recentIntegrationEvents.length === 0 ? (
        <ProductEmptyState title="Sin Webhooks" description="No se han recibido eventos externos (SIMULATED)." />
      ) : (
        <div className="space-y-3">
          {view.recentIntegrationEvents.map(ev => (
            <div key={ev.id} className="p-3 bg-pn-surface-strong rounded border border-pn-border flex justify-between items-center">
              <div>
                <div className="flex gap-2 items-center mb-1">
                  <span className="text-xs font-semibold text-pn-text uppercase">{ev.provider}</span>
                  <span className={`text-[10px] px-1.5 rounded uppercase ${ev.status === 'success' ? 'bg-pn-success/20 text-pn-success' : 'bg-pn-warning/20 text-pn-warning'}`}>
                    {ev.status}
                  </span>
                </div>
                <p className="text-xs text-pn-text-soft">{ev.event}</p>
              </div>
              <span className="text-[10px] font-mono text-pn-text-muted">{new Date(ev.timestamp).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 pt-4 border-t border-pn-border">
        <Link href="/demo/integrations">
          <CommandButton variant="outline" fullWidth icon={<Settings className="w-4 h-4"/>}>Administrar Proveedores</CommandButton>
        </Link>
      </div>
    </MissionCard>
  );
}
