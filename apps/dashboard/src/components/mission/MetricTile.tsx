import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface MetricTileProps {
  label: string;
  value: ReactNode;
  unit?: string;
  helper?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function MetricTile({ label, value, unit, helper, trend, className }: MetricTileProps) {
  return (
    <div className={cn("flex flex-col space-y-1", className)}>
      <span className="text-xs font-medium uppercase tracking-wider text-pn-text-muted">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-light text-pn-text pn-mono tracking-tight">{value}</span>
        {unit && <span className="text-sm text-pn-text-soft">{unit}</span>}
      </div>
      {helper && (
        <span className={cn(
          "text-xs mt-1",
          trend === "up" ? "text-pn-success" : trend === "down" ? "text-pn-danger" : "text-pn-text-soft"
        )}>
          {helper}
        </span>
      )}
    </div>
  );
}
