'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DemoError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[Demo Error Boundary]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-pn-bg flex items-center justify-center p-8">
      <div className="pn-card max-w-md w-full p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-pn-error/10 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-pn-error">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h2 className="text-lg font-semibold text-pn-text mb-2">
          Algo salió mal
        </h2>
        <p className="text-sm text-pn-text-soft mb-1">
          Ocurrió un error al cargar esta sección del demo.
        </p>
        {error?.digest && (
          <p className="text-xs text-pn-text-muted mb-6 font-mono">
            ID: {error.digest}
          </p>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="pn-btn-primary text-sm px-5 py-2"
          >
            Reintentar
          </button>
          <a
            href="/demo/start"
            className="pn-btn-secondary text-sm px-5 py-2"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}
