"use client";

import { useState } from "react";
import { RouteBreadcrumbs } from "@/components/mission";
import { CheckCircle2, XCircle, Clock, ShieldAlert, ArrowUpRight, ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { approveTransaction } from "@/app/actions/banking";
import { approveP2PTrade } from "@/app/actions/p2p";

type ApprovalItem = {
  id: string;
  type: string;
  user: string;
  email: string;
  amount: string;
  fee: string;
  date: string;
  status: string;
};

export function ApprovalsClient({ initialApprovals }: { initialApprovals: ApprovalItem[] }) {
  const [approvals, setApprovals] = useState(initialApprovals);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleAction = async (id: string, type: string, action: "APPROVED" | "REJECTED") => {
    setIsProcessing(id);
    try {
      if (type === "DEPOSIT" || type === "WITHDRAWAL") {
        const res = await approveTransaction(id, action);
        if (!res.success) throw new Error(res.error);
      } else if (type === "P2P_TRADE") {
        const res = await approveP2PTrade(id, action);
        if (!res.success) throw new Error(res.error);
      }

      setApprovals(prev => prev.map(item => 
        item.id === id ? { ...item, status: action } : item
      ));
    } catch (error: any) {
      alert("Error processing approval: " + error.message);
    } finally {
      setIsProcessing(null);
    }
  };

  const pendingCount = approvals.filter(a => a.status === "PENDING").length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <RouteBreadcrumbs />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-pn-text">
              Consola de <span className="font-semibold text-pn-gold">Aprobaciones</span>
            </h1>
            <p className="text-pn-text-muted mt-1">
              Bandeja de entrada del flujo Maker-Checker (Principio de 4 Ojos).
            </p>
          </div>
          <div className="flex items-center gap-2 bg-pn-surface-strong px-4 py-2 rounded-lg border border-pn-border">
            <ShieldAlert className="w-5 h-5 text-pn-warning" />
            <span className="font-medium text-pn-text">{pendingCount} Pendientes</span>
          </div>
        </div>
      </div>

      <div className="bg-pn-surface/50 border border-pn-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-pn-surface-strong/50 border-b border-pn-border text-pn-text-soft">
              <tr>
                <th className="px-6 py-4 font-medium">Tipo / ID</th>
                <th className="px-6 py-4 font-medium">Usuario (Maker)</th>
                <th className="px-6 py-4 font-medium">Operación</th>
                <th className="px-6 py-4 font-medium">Fee (PachaNova)</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium text-right">Acción (Checker)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pn-border/50">
              {approvals.map((item) => (
                <tr key={item.id} className="hover:bg-pn-surface-strong/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "p-1.5 rounded-md",
                        item.type === "DEPOSIT" ? "bg-emerald-500/10 text-emerald-500" :
                        item.type === "P2P_TRADE" ? "bg-purple-500/10 text-purple-500" :
                        item.type === "WITHDRAWAL" ? "bg-orange-500/10 text-orange-500" :
                        "bg-blue-500/10 text-blue-500"
                      )}>
                        {item.type === "DEPOSIT" && <ArrowUpRight className="w-4 h-4" />}
                        {item.type === "P2P_TRADE" && <ArrowRightLeft className="w-4 h-4" />}
                        {item.type === "WITHDRAWAL" && <ArrowUpRight className="w-4 h-4 rotate-180" />}
                        {item.type === "KYC" && <ShieldAlert className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-pn-text">{item.type}</p>
                        <p className="text-xs text-pn-text-soft">{item.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-pn-text">{item.user}</p>
                    <p className="text-xs text-pn-text-soft">{item.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-pn-gold">{item.amount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "font-mono text-sm",
                      item.fee !== "-" ? "text-pn-success font-medium" : "text-pn-text-soft"
                    )}>
                      {item.fee}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                      item.status === "PENDING" && "bg-pn-warning/10 text-pn-warning border-pn-warning/20",
                      item.status === "APPROVED" && "bg-pn-success/10 text-pn-success border-pn-success/20",
                      item.status === "REJECTED" && "bg-pn-danger/10 text-pn-danger border-pn-danger/20"
                    )}>
                      {item.status === "PENDING" && <Clock className="w-3 h-3" />}
                      {item.status === "APPROVED" && <CheckCircle2 className="w-3 h-3" />}
                      {item.status === "REJECTED" && <XCircle className="w-3 h-3" />}
                      {item.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {item.status === "PENDING" ? (
                      <div className="flex items-center justify-end gap-2">
                        {isProcessing === item.id ? (
                          <span className="text-sm text-pn-text-soft animate-pulse">Procesando...</span>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleAction(item.id, item.type, "REJECTED")}
                              className="p-2 text-pn-text-soft hover:text-pn-danger hover:bg-pn-danger/10 rounded-md transition-colors"
                              title="Rechazar"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleAction(item.id, item.type, "APPROVED")}
                              className="p-2 text-pn-text-soft hover:text-pn-success hover:bg-pn-success/10 rounded-md transition-colors"
                              title="Aprobar"
                            >
                              <CheckCircle2 className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-pn-text-soft italic">Resuelto</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {approvals.length === 0 && (
            <div className="p-8 text-center text-pn-text-soft">
              No hay solicitudes pendientes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
