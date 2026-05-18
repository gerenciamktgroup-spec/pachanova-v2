'use client';

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

export function EducationalTooltip({ 
  term, 
  definition, 
  position = "top" 
}: { 
  term: string; 
  definition: string;
  position?: "top" | "bottom" | "left" | "right";
}) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
  };

  return (
    <span 
      className="relative inline-flex items-center gap-1 cursor-help group"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => setIsVisible(!isVisible)} // For mobile
    >
      <span className="border-b border-dashed border-pn-gold/50 text-pn-text hover:text-pn-gold transition-colors">
        {term}
      </span>
      <HelpCircle size={14} className="text-pn-text-muted group-hover:text-pn-gold transition-colors" />

      {isVisible && (
        <span 
          className={`absolute z-50 w-64 p-3 bg-pn-surface-strong border border-pn-border rounded-lg shadow-xl text-sm text-pn-text-soft font-normal ${positionClasses[position]}`}
          style={{ pointerEvents: 'none' }}
        >
          {definition}
        </span>
      )}
    </span>
  );
}
