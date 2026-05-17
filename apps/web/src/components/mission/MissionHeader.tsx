"use client";

import Link from "next/link";
import { DemoStatusRibbon } from "./DemoStatusRibbon";
import { RoleSwitcherDemo } from "@/components/product/RoleSwitcherDemo";
import { GuidedModeToggle } from "@/components/product/GuidedModeToggle";

export function MissionHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-pn-border bg-pn-bg/80 backdrop-blur-xl">
      <DemoStatusRibbon />
      <div className="flex h-14 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/demo/showcase" className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tighter text-pn-text">
            Pacha<span className="font-light text-pn-text-muted">Nova</span>
          </span>
          <span className="ml-2 rounded border border-pn-border-strong bg-pn-surface px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-pn-text-muted">
            Mission Control
          </span>
        </Link>
        
        <div className="ml-auto flex items-center space-x-4 text-sm font-medium">
          <Link href="/demo/showcase" className="text-pn-text-muted hover:text-pn-text transition-colors hidden sm:block">
            Showcase
          </Link>
          <Link href="/demo/reports" className="text-pn-text-muted hover:text-pn-text transition-colors hidden sm:block">
            Reports
          </Link>
          <div className="h-6 w-px bg-pn-border hidden sm:block mx-2"></div>
          <GuidedModeToggle />
          <div data-testid="role-switcher">
            <RoleSwitcherDemo />
          </div>
        </div>
      </div>
    </header>
  );
}
