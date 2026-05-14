"use client";

import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { softScale } from "./motion";

export interface MissionCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "warning" | "success" | "danger" | "data";
  animated?: boolean;
}

export const MissionCard = forwardRef<HTMLDivElement, MissionCardProps>(
  ({ className, variant = "default", animated = false, children, ...props }, ref) => {
    const classes = cn(
      "pn-card p-6",
      {
        "pn-card-hover pn-glow-soft": variant === "elevated",
        "border-pn-warning/50 bg-pn-warning/5": variant === "warning",
        "border-pn-success/50 bg-pn-success/5": variant === "success",
        "border-pn-danger/50 bg-pn-danger/5": variant === "danger",
        "p-0": variant === "data",
      },
      className
    );

    if (animated) {
      return (
        <motion.div
          ref={ref as React.ForwardedRef<HTMLDivElement>}
          variants={softScale}
          initial="hidden"
          animate="visible"
          className={classes}
          {...(props as HTMLMotionProps<"div">)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);
MissionCard.displayName = "MissionCard";
