"use client";

import React, { useState, useEffect } from "react";
import { HelpCircle } from "lucide-react";

export function GuidedModeToggle() {
  const [isGuided, setIsGuided] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("pn_guided_mode");
    if (stored !== null) {
      setIsGuided(stored === "true");
    }
  }, []);

  const toggle = () => {
    const next = !isGuided;
    setIsGuided(next);
    localStorage.setItem("pn_guided_mode", String(next));
    // Dispatch an event so other components (like NextStepCard) can listen if needed,
    // though React context would be better for complex state. 
    // For now, simple state is enough if components are wrapped or if we just use a class on body.
    if (next) {
      document.body.classList.remove("expert-mode");
    } else {
      document.body.classList.add("expert-mode");
    }
  };

  if (!mounted) return null;

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
