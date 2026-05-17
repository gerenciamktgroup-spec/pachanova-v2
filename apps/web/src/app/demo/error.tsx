"use client";

import { useEffect } from "react";

export default function DemoError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Demo Error]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      <div className="text-5xl">⚠️</div>
      <div>
        <h2 className="text-xl font-semibold text-pn-text mb-2">Algo salió mal en el demo</h2>
        <p className="text-sm text-pn-text-muted max-w-md">
          {error?.message || "Error inesperado al cargar esta sección de la demo."}
        </p>
        {error?.digest && (
          <p className="text-xs text-pn-text-soft mt-1 font-mono">digest: {error.digest}</p>
        )}
      </div>
      <button
        onClick={reset}
        className="px-4 py-2 rounded-md bg-pn-gold text-pn-bg text-sm font-medium hover:bg-pn-gold/80 transition-colors"
      >
        Reintentar
      </button>
    </div>
  );
}
