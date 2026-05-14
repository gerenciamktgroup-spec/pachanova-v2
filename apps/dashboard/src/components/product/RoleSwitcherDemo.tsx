"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Users, ChevronDown } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

function RoleSwitcherDemoInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState("investor");

  useEffect(() => {
    const roleParam = searchParams.get("persona");
    if (roleParam) {
      setCurrentRole(roleParam);
    } else if (pathname.includes("/admin")) {
      setCurrentRole("admin");
    } else if (pathname.includes("/fideicomiso")) {
      setCurrentRole("fiduciario");
    } else if (pathname.includes("/operator")) {
      setCurrentRole("operator");
    } else if (pathname.includes("/investor")) {
      setCurrentRole("investor");
    } else {
      setCurrentRole("visitor");
    }
  }, [pathname, searchParams]);

  const roles = [
    { id: "visitor", label: "Visitante", path: "/" },
    { id: "investor", label: "Inversor", path: "/dashboard/investor" },
    { id: "admin", label: "Admin", path: "/dashboard/admin" },
    { id: "fiduciario", label: "Fiduciario", path: "/dashboard/fideicomiso" },
    { id: "operator", label: "Operador", path: "/demo/showcase" }
  ];

  const handleSwitch = (path: string, id: string) => {
    setIsOpen(false);
    router.push(`${path}?persona=${id}`);
  };

  const activeRole = roles.find(r => r.id === currentRole) || roles[0];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-pn-border bg-pn-surface hover:bg-pn-surface-strong transition-colors"
        aria-label="Cambiar perfil de demostración"
      >
        <Users className="w-4 h-4 text-pn-gold" />
        <span className="text-xs font-medium text-pn-text">{activeRole.label}</span>
        <ChevronDown className="w-3 h-3 text-pn-text-muted" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-pn-bg border border-pn-border rounded-md shadow-xl overflow-hidden z-50">
          <div className="px-3 py-2 bg-pn-surface-strong border-b border-pn-border">
            <span className="text-[10px] uppercase tracking-widest text-pn-text-muted font-bold">Cambiar Perspectiva Demo</span>
          </div>
          <div className="py-1">
            {roles.map(role => (
              <button
                key={role.id}
                onClick={() => handleSwitch(role.path, role.id)}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${currentRole === role.id ? 'bg-pn-gold/10 text-pn-gold' : 'text-pn-text-soft hover:bg-pn-surface hover:text-pn-text'}`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function RoleSwitcherDemo() {
  return (
    <Suspense fallback={
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-pn-border bg-pn-surface">
        <Users className="w-4 h-4 text-pn-gold" />
        <span className="text-xs font-medium text-pn-text">...</span>
      </div>
    }>
      <RoleSwitcherDemoInner />
    </Suspense>
  );
}
