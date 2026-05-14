"use client";

import React from "react";
import { MissionCard, SafeActionButton } from "@/components/mission";
import { MapPin, ArrowRight, ShieldAlert } from "lucide-react";
import { SystemStatus, getStatusBadgeVariant, getStatusCopy } from "@/lib/product/statusModel";
import { ActionIntent } from "@/lib/product/actionIntent";

export type NextStepCardProps = {
  contextLabel: string;
  title: string;
  explanation: string;
  nextStep: string;
  primaryAction: {
    label: string;
    href?: string;
    onClick?: () => void;
    intent?: ActionIntent;
    disabledReason?: string;
    plannedReason?: string;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    intent?: ActionIntent;
    disabledReason?: string;
  };
  status?: SystemStatus;
  dataTestId?: string;
};

export function NextStepCard({
  contextLabel,
  title,
  explanation,
  nextStep,
  primaryAction,
  secondaryAction,
  status,
  dataTestId
}: NextStepCardProps) {
  return (
    <div data-testid={dataTestId || "next-step-card"}>
      <MissionCard className="border-pn-gold/30 bg-gradient-to-r from-pn-surface-strong to-transparent mb-8">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-pn-gold" />
          <span className="text-xs font-mono text-pn-gold tracking-widest uppercase">{contextLabel}</span>
          {status && (
            <span className={`ml-auto text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${getStatusBadgeVariant(status)}`}>
              {getStatusCopy(status)}
            </span>
          )}
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-medium text-pn-text mb-2">{title}</h2>
          <p className="text-sm text-pn-text-muted">{explanation}</p>
        </div>

        <div className="bg-pn-bg/50 rounded-lg p-4 mb-6 border border-pn-border flex items-start gap-3">
          <ArrowRight className="w-5 h-5 text-pn-blue shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-pn-text mb-1">Siguiente paso recomendado</p>
            <p className="text-xs text-pn-text-muted">{nextStep}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <SafeActionButton 
            label={primaryAction.label}
            href={primaryAction.href}
            onClick={primaryAction.onClick}
            intent={primaryAction.intent}
            variant="primary"
            disabledReason={primaryAction.disabledReason}
            plannedReason={primaryAction.plannedReason}
            status={primaryAction.disabledReason ? "disabled" : (primaryAction.plannedReason ? "planned" : "active")}
          />
          {secondaryAction && (
            <SafeActionButton 
              label={secondaryAction.label}
              href={secondaryAction.href}
              intent={secondaryAction.intent}
              variant="outline"
              disabledReason={secondaryAction.disabledReason}
              status={secondaryAction.disabledReason ? "disabled" : "active"}
            />
          )}
        </div>
      </div>
      </MissionCard>
    </div>
  );
}
