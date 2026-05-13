import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { formatPacha, formatSquareMeters, formatUsd } from "@/lib/product/math";

// DataGrid
export function DataGrid({ headers, children }: { headers: string[], children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-md border border-pn-border bg-pn-surface-strong/50">
      <table className="w-full text-left text-sm text-pn-text-soft">
        <thead className="bg-pn-surface border-b border-pn-border text-xs uppercase tracking-wider text-pn-text-muted">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-pn-border/50">
          {children}
        </tbody>
      </table>
    </div>
  );
}

export function DataGridRow({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <tr className={cn("hover:bg-pn-surface-strong/50 transition-colors", className)}>
      {children}
    </tr>
  );
}

export function DataGridCell({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <td className={cn("px-4 py-3 whitespace-nowrap", className)}>
      {children}
    </td>
  );
}

// TokenAmount
export function TokenAmount({ amount }: { amount: number | string }) {
  const value = typeof amount === "string" ? amount : formatPacha(amount);
  return (
    <div className="flex items-center gap-1.5 font-mono">
      <span className="text-pn-text font-medium">{value}</span>
      <span className="text-pn-gold text-xs tracking-wider">PACHA</span>
    </div>
  );
}

// SquareMeterAmount
export function SquareMeterAmount({ amount }: { amount: number | string }) {
  const value = typeof amount === "string" ? amount : formatSquareMeters(amount);
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-pn-text font-medium">{value}</span>
      <span className="text-pn-text-soft text-xs">m²</span>
    </div>
  );
}

// MoneyAmount
export function MoneyAmount({ amount }: { amount: number | string }) {
  const value = typeof amount === "string" ? amount : formatUsd(amount);
  return (
    <span className="text-pn-text font-mono font-medium tracking-tight">
      {value}
    </span>
  );
}

// UserStatusPill
export function UserStatusPill({ status }: { status: "pending" | "approved" | "rejected" | "ACTIVE" | "SUSPENDED" }) {
  return (
    <span className={cn(
      "px-2 py-0.5 rounded text-[10px] uppercase font-semibold tracking-wider border",
      {
        "bg-pn-success/10 text-pn-success border-pn-success/20": status === "approved" || status === "ACTIVE",
        "bg-pn-warning/10 text-pn-warning border-pn-warning/20": status === "pending",
        "bg-pn-danger/10 text-pn-danger border-pn-danger/20": status === "rejected" || status === "SUSPENDED",
      }
    )}>
      {status}
    </span>
  );
}

// EmptyState
export function ProductEmptyState({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-md border border-dashed border-pn-border/50 bg-pn-surface-strong/20">
      <p className="text-sm font-medium text-pn-text mb-1">{title}</p>
      <p className="text-xs text-pn-text-muted">{description}</p>
    </div>
  );
}
