import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface MissionShellProps {
  children: ReactNode;
  header?: ReactNode;
  sidebar?: ReactNode;
  className?: string;
}

export function MissionShell({ children, header, sidebar, className }: MissionShellProps) {
  return (
    <div className={cn("pn-page pn-grid-bg flex flex-col", className)}>
      {header}
      <div className="flex flex-1 overflow-hidden">
        {sidebar}
        <main className="flex-1 overflow-y-auto">
          <div className="pn-shell">{children}</div>
        </main>
      </div>
    </div>
  );
}
