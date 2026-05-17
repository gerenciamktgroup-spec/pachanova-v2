"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function DemoOnboardingModal() {
  // ✅ Start as false (server-safe). sessionStorage is read only in useEffect (client-only).
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // ✅ Safe: sessionStorage only accessed on client, inside useEffect
    const alreadySeen = (() => {
      try { return sessionStorage.getItem("pn-onboarding") === "1"; }
      catch { return false; }
    })();
    setShown(alreadySeen);
    if (!alreadySeen) {
      const t = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    setOpen(false);
    try { sessionStorage.setItem("pn-onboarding", "1"); } catch { /* safari private */ }
    setShown(true);
  };

  const goTo = (path: string) => {
    dismiss();
    router.push(path);
  };

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-pn-bg/60 backdrop-blur-sm">
      <div
        className="bg-pn-surface rounded-3xl max-w-lg w-full mx-4 p-8 shadow-2xl relative animate-in zoom-in-95 fade-in duration-150 border border-pn-border"
      >
        <button
          onClick={dismiss}
          aria-label="Cerrar"
          className="absolute top-4 right-4 text-pn-text-muted hover:text-pn-text transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-pn-text mb-2">Bienvenido al demo de PachaNova</h2>
        <p className="text-pn-text-muted mb-8 leading-relaxed">
          En los próximos 3 minutos vas a simular lo que haría un inversor real en PachaNova.
          <br />
          <span className="text-pn-text-muted/70">Sin registro. Sin dinero real. Con datos del Proyecto San Bartolo.</span>
        </p>

        <div className="space-y-3 mb-6">
          <RoleCard emoji="🏦" title="Inversor" desc="Comprá tokens, gestioná tu portafolio y operá en el mercado P2P" onClick={() => goTo("/dashboard/investor")} />
          <RoleCard emoji="⚙️" title="Administrador" desc="Gestioná inversores, auditá tokens y proponé distribuciones" onClick={() => goTo("/dashboard/admin")} />
          <RoleCard emoji="📜" title="Fideicomiso" desc="Revisá y firmá operaciones con quórum legal 2/3" onClick={() => goTo("/dashboard/fideicomiso")} />
        </div>

        <button
          onClick={dismiss}
          className="text-sm text-pn-text-muted hover:text-pn-gold transition-colors flex items-center gap-1 mx-auto"
        >
          Explorar sin elegir rol <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>,
    document.body
  );
}

function RoleCard({ emoji, title, desc, onClick }: { emoji: string; title: string; desc: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-start gap-4 p-4 rounded-xl border border-pn-border hover:border-pn-gold/50 hover:bg-pn-surface-strong/50 transition-all group"
    >
      <span className="text-2xl shrink-0 mt-0.5">{emoji}</span>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-pn-text group-hover:text-pn-gold transition-colors">{title}</h3>
        <p className="text-sm text-pn-text-muted">{desc}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-pn-text-muted group-hover:text-pn-gold mt-1 shrink-0 transition-colors" />
    </button>
  );
}
