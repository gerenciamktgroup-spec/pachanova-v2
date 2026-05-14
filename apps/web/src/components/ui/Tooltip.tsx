"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";

type Position = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: Position;
  maxWidth?: number;
  delay?: number;
}

const positionClasses: Record<Position, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

export function Tooltip({ content, children, position = "top", maxWidth = 280, delay = 300 }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(hover: none)").matches);
  }, []);

  const show = () => {
    timerRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  };

  const toggle = () => setVisible((v) => !v);

  const handlers = isTouchDevice
    ? { onClick: toggle }
    : { onMouseEnter: show, onMouseLeave: hide };

  return (
    <span className="relative inline-flex" {...handlers}>
      {children}
      {visible && (
        <span
          role="tooltip"
          style={{ maxWidth }}
          className={`absolute z-50 bg-slate-900 text-white text-sm rounded-xl px-3 py-2 shadow-lg pointer-events-none animate-in fade-in duration-150 ${positionClasses[position]}`}
        >
          {content}
        </span>
      )}
    </span>
  );
}
