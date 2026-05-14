import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function RouteBreadcrumbs({ items, className }: { items: BreadcrumbItem[], className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-1 text-sm text-pn-text-muted", className)}>
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1 opacity-50" />}
          {item.href ? (
            <Link href={item.href} className="hover:text-pn-text transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-pn-text font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
