import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface TimelineItem {
  id: string | number;
  title: string;
  description?: ReactNode;
  status: "completed" | "current" | "upcoming" | "error" | "pending";
  time?: string;
  icon?: ReactNode;
}

export function TimelineRail({ items, className }: { items: TimelineItem[], className?: string }) {
  return (
    <div className={cn("relative border-l border-pn-border-strong ml-3 space-y-8", className)}>
      {items.map((item) => (
        <div key={item.id} className="relative pl-6">
          <span className={cn(
            "absolute -left-1.5 top-1 h-3 w-3 rounded-full ring-4 ring-pn-bg",
            {
              "bg-pn-success": item.status === "completed",
              "bg-pn-blue shadow-[0_0_8px_rgba(75,143,240,0.6)]": item.status === "current",
              "bg-pn-border-strong": item.status === "upcoming" || item.status === "pending",
              "bg-pn-danger": item.status === "error",
            }
          )} />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-sm font-medium",
                item.status === "current" ? "text-pn-text" : "text-pn-text-muted"
              )}>
                {item.title}
              </span>
              {item.time && <span suppressHydrationWarning className="text-xs text-pn-text-soft pn-mono">{item.time}</span>}
            </div>
            {item.description && (
              <div className="mt-1 text-sm text-pn-text-soft">{item.description}</div>
            )}
            {item.icon && <div className="mt-2">{item.icon}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
