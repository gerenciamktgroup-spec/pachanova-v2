import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface SectionHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, description, eyebrow, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6", className)}>
      <div className="space-y-1">
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-widest text-pn-blue">
            {eyebrow}
          </span>
        )}
        <h2 className="text-xl font-medium tracking-tight text-pn-text">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-pn-text-muted">
            {description}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
