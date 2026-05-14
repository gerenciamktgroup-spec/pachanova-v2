"use client";

import React, { useState } from "react";
import { Info } from "lucide-react";
import { uxGlossary } from "@/lib/copy/uxGlossary";

export type InfoHintProps = {
  termKey: keyof typeof uxGlossary;
  inline?: boolean;
};

export function InfoHint({ termKey, inline = false }: InfoHintProps) {
  const [isOpen, setIsOpen] = useState(false);
  const data = uxGlossary[termKey];

  if (!data) return null;

  return (
    <span 
      className={`relative inline-flex items-center gap-1 group cursor-help ml-1 ${inline ? "align-baseline" : "align-middle"}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(!isOpen)}
      aria-label={`Información sobre ${data.title}: ${data.description}`}
      role="tooltip"
    >
      <Info className="w-3.5 h-3.5 text-pn-text-soft hover:text-pn-gold transition-colors" />
      
      <span 
        className={`
          absolute z-50 w-64 p-3 -mt-2 
          bg-pn-surface-strong border border-pn-border rounded-lg shadow-xl backdrop-blur-md
          text-xs text-left
          transition-all duration-200 
          ${isOpen ? "opacity-100 visible translate-y-[-100%] top-[-8px]" : "opacity-0 invisible translate-y-[-90%] top-[-8px]"}
          left-1/2 -translate-x-1/2
          pointer-events-none
        `}
      >
        <strong className="block text-pn-text mb-1">{data.title}</strong>
        <span className="text-pn-text-muted">{data.description}</span>
      </span>
    </span>
  );
}
