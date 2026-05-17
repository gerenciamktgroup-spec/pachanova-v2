"use client";

import React, { useState, useEffect } from "react";
import { HelpCircle } from "lucide-react";

export function GuidedModeToggle() {
  const [isGuided, setIsGuided] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Safe localStorage access - wrapped in try/catch for sandbox/SSR safety
    try {
      const stored = localStorage.getItem("pn_guided_mode");
      if (stored !== null) {
        setIsGuided(stored === "true");
      }
    } catch {
      // localStorage blocked (sandbox, private mode) — use default state
    }
  }, []);

  const toggle = () => {
    const next = !isGuided;
    setIsGuided(next);
    try {
      localStorage.setItem("pn_guided_mode", String(next));
    } catch {
      // localStorage blocked — state still works in-memory
    }
    if (next) {
      document.body.classList.remove("expert-mode");
    } else {
      document.body.classList.add("expert-mode");
    }
  };

  // Render a placeholder during SSR so layout doesn't shift
  if (!mounted) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-pn-border bg-transparent opacity-0 pointer-events-none" aria-hidden="true">
        <HelpCircle className="w-4 h-4" />
      </div>
    );
  }

  return (
    <button 
      onClick={toggle}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md border transition-colors ${
        isGuided 
          ? "border-pn-gold/50 bg-pn-gold/10 text-pn-gold" 
          : "border-pn-border bg-transparent text-pn-text-muted hover:bg-pn-surface hover:text-pn-text"
      }`}
      aria-label="Toggle Guided Mode"
      data-testid="guided-mode-toggle"
      title={isGuided ? "Modo Guiado Activo (Ocultar Ayudas)" : "Modo Experto (Mostrar Ayudas)"}
    >
      <HelpCircle className="w-4 h-4" />
      <span className="text-xs font-medium hidden sm:inline">
        {isGuided ? "Modo Guiado" : "Modo Experto"}
      </span>
    </button>
  );
}
