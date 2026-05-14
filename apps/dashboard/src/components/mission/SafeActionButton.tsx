import React from "react";
import Link from "next/link";
import { CommandButton } from "./CommandButton";
import { Info, Lock } from "lucide-react";
import { ActionIntent, getActionIntentHint } from "@/lib/product/actionIntent";

export interface SafeActionButtonProps {
  label: string;
  href?: string;
  onClick?: () => void;
  disabledReason?: string;
  plannedReason?: string;
  status?: "active" | "planned" | "disabled";
  testId?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  isLoading?: boolean;
  intent?: ActionIntent;
  className?: string;
  dataTestId?: string;
}

export function SafeActionButton({
  label,
  href,
  onClick,
  disabledReason,
  plannedReason,
  status = "active",
  testId,
  variant = "primary",
  isLoading = false,
  intent,
  className,
  dataTestId
}: SafeActionButtonProps) {
  const isDisablingIntent = intent === "disabled" || intent === "planned" || intent === "pending_credentials" || intent === "pending_foundry";
  const isActuallyDisabled = status === "disabled" || status === "planned" || !!disabledReason || !!plannedReason || isDisablingIntent;
  const effectiveDisabledReason = disabledReason || (isDisablingIntent && intent ? getActionIntentHint(intent) : null) || plannedReason;
  const reasonText = effectiveDisabledReason;

  const content = (
    <div className={`flex flex-col items-center group ${className || ""}`}>
      <CommandButton
        variant={variant}
        onClick={isActuallyDisabled ? undefined : onClick}
        disabled={isActuallyDisabled}
        isLoading={isLoading}
        data-testid={dataTestId || testId || "safe-action-button"}
        className={isActuallyDisabled ? "opacity-60 cursor-not-allowed" : ""}
      >
        <span className="flex items-center gap-2">
          {status === "planned" && <Lock className="w-4 h-4 text-pn-text-muted" />}
          {label}
        </span>
      </CommandButton>
      {isActuallyDisabled && reasonText && (
        <span className="text-xs text-pn-text-muted mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Info className="w-3 h-3" />
          {status === "planned" ? "Planned: " : "Disabled: "} {reasonText}
        </span>
      )}
    </div>
  );

  if (href && !isActuallyDisabled) {
    return <Link href={href} className="inline-block">{content}</Link>;
  }

  return <div className="inline-block">{content}</div>;
}
