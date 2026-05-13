import { HTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

export const GlassCard = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] p-6 dark:bg-black/20 dark:border-white/10",
        className
      )}
      {...props}
    />
  )
)
GlassCard.displayName = "GlassCard"
