import { cn } from "@/lib/utils";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "BLOCKER" | "READY-BUT-DISABLED" | "PENDING_CREDENTIALS" | "PENDING_FOUNDRY" | "NO-GO" | "GO";

export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
  const variants: Record<RiskLevel, string> = {
    "LOW": "bg-pn-success/10 text-pn-success border-pn-success/20",
    "GO": "bg-pn-success/10 text-pn-success border-pn-success/20",
    "MEDIUM": "bg-pn-warning/10 text-pn-warning border-pn-warning/20",
    "HIGH": "bg-pn-danger/10 text-pn-danger border-pn-danger/20",
    "BLOCKER": "bg-pn-danger/20 text-pn-danger border-pn-danger/50 font-bold",
    "NO-GO": "bg-pn-danger/20 text-pn-danger border-pn-danger/50 font-bold",
    "READY-BUT-DISABLED": "bg-pn-surface-strong text-pn-text-muted border-pn-border-strong",
    "PENDING_CREDENTIALS": "bg-pn-warning/10 text-pn-warning border-pn-warning/20",
    "PENDING_FOUNDRY": "bg-pn-warning/10 text-pn-warning border-pn-warning/20",
  };

  return (
    <span className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-tight",
      variants[level],
      className
    )}>
      {level}
    </span>
  );
}
