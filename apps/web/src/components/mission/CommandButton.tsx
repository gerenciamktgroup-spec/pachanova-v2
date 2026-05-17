'use client';

import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface CommandButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  isLoading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export const CommandButton = forwardRef<HTMLButtonElement, CommandButtonProps>(
  ({ className, variant = "primary", isLoading, icon, children, disabled, fullWidth, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pn-gold disabled:pointer-events-none disabled:opacity-50",
          {
            "w-full": fullWidth,
            "bg-pn-text text-pn-bg hover:bg-pn-text/90": variant === "primary",
            "bg-pn-surface-strong text-pn-text hover:bg-pn-surface-strong/80 border border-pn-border": variant === "secondary" || variant === "outline",
            "bg-pn-danger/10 text-pn-danger hover:bg-pn-danger/20 border border-pn-danger/20": variant === "danger",
            "hover:bg-pn-surface-strong text-pn-text-muted hover:text-pn-text": variant === "ghost",
          },
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!isLoading && icon && <span className="shrink-0">{icon}</span>}
        {children}
      </button>
    );
  }
);
CommandButton.displayName = "CommandButton";
