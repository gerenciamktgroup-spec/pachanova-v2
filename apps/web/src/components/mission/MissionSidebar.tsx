"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ROUTE_REGISTRY, AppRoute } from "@/lib/navigation/routeRegistry";
import { 
  PlaySquare, BookOpen, Wallet, LayoutDashboard, Shield, 
  Activity, List, Users, FileSearch, FileSignature, 
  Terminal, Puzzle, Palette, History, AlertTriangle,
  FlaskConical, Scale, ShoppingCart, PenTool, Landmark,
  LucideIcon 
} from "lucide-react";
import { useMobileSidebar } from "./MobileSidebarContext";

const ICON_MAP: Record<string, LucideIcon> = {
  "play-square": PlaySquare,
  "book-open": BookOpen,
  "palette": Palette,
  "wallet": Wallet,
  "layout-dashboard": LayoutDashboard,
  "shield": Shield,
  "list": List,
  "users": Users,
  "file-search": FileSearch,
  "activity": Activity,
  "file-signature": FileSignature,
  "terminal": Terminal,
  "puzzle": Puzzle,
  "history": History,
  "alert-triangle": AlertTriangle,
  "test-tube": FlaskConical,
  "scale": Scale,
  "shopping-cart": ShoppingCart,
  "pen-tool": PenTool,
  "landmark": Landmark,
};

export function MissionSidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useMobileSidebar();

  // Agrupar rutas por sección
  const sections: Record<string, AppRoute[]> = {};
  ROUTE_REGISTRY.forEach(route => {
    if (!sections[route.section]) {
      sections[route.section] = [];
    }
    sections[route.section].push(route);
  });

  return (
    <aside
      className={cn(
        // Desktop: always visible as a static sidebar
        "w-64 flex-col border-r border-pn-border bg-pn-bg/95 backdrop-blur-sm overflow-y-auto",
        // Desktop: show normally
        "hidden lg:flex",
        // Mobile: fixed drawer overlay
        isOpen && "!fixed inset-y-0 left-0 z-50 !flex shadow-2xl"
      )}
      data-testid="mission-sidebar"
    >
      <div className="flex-1 py-6 px-4 space-y-6">
        {Object.entries(sections).map(([sectionName, routes]) => (
          <div key={sectionName} className="space-y-1">
            <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-pn-text-soft mb-2">
              {sectionName}
            </h3>
            {routes.map((route) => {
              const Icon = ICON_MAP[route.icon] || PlaySquare;
              const isActive = pathname === route.path;
              const isPlanned = route.status === "planned";
              const isPending = route.status.startsWith("pending");

              return (
                <div key={route.path}>
                  {isPlanned ? (
                    <div className="flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm font-medium text-pn-text-soft/50 cursor-not-allowed">
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 opacity-50" />
                        <span>{route.label}</span>
                      </div>
                      <span className="text-[9px] uppercase tracking-wider bg-pn-surface-strong px-1.5 py-0.5 rounded text-pn-text-soft">Planned</span>
                    </div>
                  ) : (
                    <Link
                      href={route.path}
                      onClick={close}
                      className={cn(
                        "flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive 
                          ? "bg-pn-surface-strong text-pn-text" 
                          : "text-pn-text-muted hover:bg-pn-surface-strong/50 hover:text-pn-text"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={cn("w-4 h-4", isActive ? "text-pn-gold" : "text-pn-text-soft")} />
                        <span>{route.label}</span>
                      </div>
                      {isPending && (
                        <span className="w-2 h-2 rounded-full bg-pn-warning"></span>
                      )}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
}
