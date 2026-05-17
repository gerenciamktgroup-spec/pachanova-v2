'use client';

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { MobileSidebarProvider, useMobileSidebar } from "./MobileSidebarContext";

export interface MissionShellProps {
  children: ReactNode;
  header?: ReactNode;
  sidebar?: ReactNode;
  className?: string;
}

function MissionShellInner({ children, header, sidebar, className }: MissionShellProps) {
  const { isOpen, close } = useMobileSidebar();

  return (
    <div className={cn("pn-page flex flex-col", className)}>
      {header}
      <div className="flex flex-1 min-h-0">
        {sidebar}
        {/* Mobile backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={close}
            aria-hidden="true"
          />
        )}
        <main className="flex-1 overflow-y-auto min-h-0">
          <div className="pn-shell">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function MissionShell(props: MissionShellProps) {
  return (
    <MobileSidebarProvider>
      <MissionShellInner {...props} />
    </MobileSidebarProvider>
  );
}
