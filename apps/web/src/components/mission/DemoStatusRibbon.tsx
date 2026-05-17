'use client';

import { AlertTriangle } from "lucide-react";

export function DemoStatusRibbon() {
  return (
    <div className="flex w-full items-center justify-center gap-2 bg-pn-warning/10 border-b border-pn-warning/20 px-4 py-1.5 text-xs font-medium text-pn-warning" data-testid="demo-status-ribbon">
      <AlertTriangle className="h-3.5 w-3.5" />
      <span>DEMO / SANDBOX — Simulated, No production connections</span>
    </div>
  );
}
