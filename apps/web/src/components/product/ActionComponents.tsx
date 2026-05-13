"use client";

import React, { ReactNode, useState } from "react";
import { CommandButton } from "@/components/mission/CommandButton";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// 1. DemoScenarioLauncher
export function DemoScenarioLauncher({ 
  title, 
  description, 
  actionLabel, 
  onLaunch, 
  disabled, 
  disabledReason 
}: { 
  title: string, 
  description: string, 
  actionLabel: string, 
  onLaunch?: () => void, 
  disabled?: boolean, 
  disabledReason?: string 
}) {
  return (
    <div className="p-4 rounded-lg border border-pn-border bg-pn-surface-strong">
      <h4 className="text-sm font-medium text-pn-text mb-2">{title}</h4>
      <p className="text-xs text-pn-text-soft mb-4">{description}</p>
      <CommandButton variant="outline" onClick={onLaunch} disabled={disabled} fullWidth>
        {actionLabel}
      </CommandButton>
      {disabled && disabledReason && (
        <p className="mt-2 text-[10px] text-pn-warning flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> {disabledReason}
        </p>
      )}
    </div>
  );
}

// 2. ActionDrawer
export function ActionDrawer({ 
  isOpen, 
  onClose, 
  title, 
  children 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  title: string, 
  children: ReactNode 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-pn-bg/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-pn-bg border-l border-pn-border shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-pn-border flex justify-between items-center bg-pn-surface-strong/50">
          <h2 className="text-lg font-semibold text-pn-text">{title}</h2>
          <button onClick={onClose} className="text-pn-text-muted hover:text-pn-text transition-colors">✕</button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// 3. TransactionReviewPanel
export function TransactionReviewPanel({
  items,
  totalLabel = "Total Simulativo",
  totalValue
}: {
  items: { label: string; value: ReactNode }[],
  totalLabel?: string,
  totalValue: ReactNode
}) {
  return (
    <div className="rounded-lg border border-pn-border bg-pn-bg p-4 space-y-4">
      <h4 className="text-xs font-semibold text-pn-text-muted uppercase tracking-wider mb-2">Resumen de Transacción</h4>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-sm">
            <span className="text-pn-text-soft">{item.label}</span>
            <span className="text-pn-text font-medium">{item.value}</span>
          </div>
        ))}
      </div>
      <div className="pt-3 border-t border-pn-border flex justify-between items-center">
        <span className="text-sm font-semibold text-pn-text">{totalLabel}</span>
        <span className="text-lg font-semibold text-pn-text">{totalValue}</span>
      </div>
    </div>
  );
}

// 4. WorkflowStepper
export function WorkflowStepper({ steps, currentStep }: { steps: string[], currentStep: number }) {
  return (
    <div className="flex items-center w-full gap-2 mb-6">
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isCurrent = idx === currentStep;
        return (
          <React.Fragment key={idx}>
            <div className={cn(
              "flex flex-col items-center gap-1",
              isCompleted ? "text-pn-success" : isCurrent ? "text-pn-blue" : "text-pn-text-muted"
            )}>
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2",
                isCompleted ? "bg-pn-success/20 border-pn-success" : 
                isCurrent ? "bg-pn-blue/20 border-pn-blue shadow-[0_0_8px_rgba(75,143,240,0.4)]" : 
                "border-pn-border bg-pn-surface"
              )}>
                {isCompleted ? <CheckCircle className="w-3 h-3" /> : (idx + 1)}
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5",
                isCompleted ? "bg-pn-success" : "bg-pn-border"
              )} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// 5. ConfirmationDialog
export function ConfirmationDialog({ 
  isOpen, onClose, onConfirm, title, description, confirmLabel = "Confirmar", cancelLabel = "Cancelar", isLoading
}: {
  isOpen: boolean, onClose: () => void, onConfirm: () => void, title: string, description: string, confirmLabel?: string, cancelLabel?: string, isLoading?: boolean
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-pn-bg/80 backdrop-blur-sm p-4">
      <div className="bg-pn-surface-strong border border-pn-border rounded-lg max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95">
        <h3 className="text-lg font-semibold text-pn-text mb-2">{title}</h3>
        <p className="text-sm text-pn-text-soft mb-6">{description}</p>
        <div className="flex justify-end gap-3">
          <CommandButton variant="outline" onClick={onClose} disabled={isLoading}>{cancelLabel}</CommandButton>
          <CommandButton variant="primary" onClick={onConfirm} disabled={isLoading}>{isLoading ? "Procesando..." : confirmLabel}</CommandButton>
        </div>
      </div>
    </div>
  );
}

// 6. WorkflowResultNotice
export function WorkflowResultNotice({ type, title, message }: { type: "success"|"error"|"info", title: string, message: string }) {
  const Icon = type === "success" ? CheckCircle : type === "error" ? XCircle : Info;
  const colorClass = type === "success" ? "text-pn-success border-pn-success/30 bg-pn-success/10" : 
                     type === "error" ? "text-pn-danger border-pn-danger/30 bg-pn-danger/10" : 
                     "text-pn-blue border-pn-blue/30 bg-pn-blue/10";
                     
  return (
    <div className={cn("p-4 rounded-lg border flex gap-3", colorClass)}>
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div>
        <h4 className="text-sm font-semibold mb-1">{title}</h4>
        <p className="text-xs opacity-90">{message}</p>
      </div>
    </div>
  );
}

// 7. ActionStatusToast (Simplified inline version for Demo)
export function ActionStatusToast({ show, message }: { show: boolean, message: string }) {
  if (!show) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-pn-surface-strong border border-pn-border text-pn-text px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
      <CheckCircle className="w-4 h-4 text-pn-success" />
      <span className="text-sm">{message}</span>
    </div>
  );
}

// 8. SafeDisabledAction
export function SafeDisabledAction({ label, reason }: { label: string, reason: string }) {
  return (
    <div className="relative group inline-block w-full">
      <CommandButton variant="outline" disabled fullWidth>{label}</CommandButton>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-max max-w-xs bg-pn-surface border border-pn-border text-pn-text-muted text-[10px] px-2 py-1 rounded shadow-lg z-10 text-center">
        {reason}
      </div>
    </div>
  );
}
