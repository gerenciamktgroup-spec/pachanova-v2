import { cn } from "@/lib/utils";
import { CircleDot } from "lucide-react";
import { simpleProductCopy } from "@/lib/copy/simpleProductCopy";

export type IntegrationStatus = "SIMULATED" | "READY-BUT-DISABLED" | "PENDING_CREDENTIALS" | "PENDING_FOUNDRY" | "CONNECTED" | "DISABLED" | "NO-GO";

export function IntegrationStatusBadge({ status, className, dataTestId }: { status: IntegrationStatus; className?: string; dataTestId?: string }) {
  const isPending = status.startsWith("PENDING");
  const isGood = status === "CONNECTED" || status === "SIMULATED";
  const isBad = status === "NO-GO" || status === "DISABLED";
  
  // Try to match copy definition
  let copyKey = "";
  if (status === "PENDING_CREDENTIALS") copyKey = "PendingCredentials";
  if (status === "PENDING_FOUNDRY") copyKey = "PendingFoundry";
  if (status === "READY-BUT-DISABLED") copyKey = "ExternalReady";
  
  let defaultTestId = `integration-badge-${status}`;
  if (status === "PENDING_CREDENTIALS") defaultTestId = "pending-credentials-badge";
  if (status === "PENDING_FOUNDRY") defaultTestId = "pending-foundry-badge";

  const tooltipText = copyKey ? simpleProductCopy[copyKey]?.tooltip : status;

  return (
    <span 
      title={tooltipText}
      data-testid={dataTestId || defaultTestId}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium uppercase tracking-wider cursor-help",
        {
          "bg-pn-success/10 text-pn-success border-pn-success/20": isGood,
          "bg-pn-warning/10 text-pn-warning border-pn-warning/20": isPending,
          "bg-pn-danger/10 text-pn-danger border-pn-danger/20": isBad,
          "bg-pn-surface-strong text-pn-text-muted border-pn-border-strong": status === "READY-BUT-DISABLED",
        },
        className
      )}
    >
      <CircleDot className={cn("h-3 w-3", {
        "text-pn-success": isGood,
        "text-pn-warning": isPending,
        "text-pn-danger": isBad,
        "text-pn-text-soft": status === "READY-BUT-DISABLED",
      })} />
      {status}
    </span>
  );
}
