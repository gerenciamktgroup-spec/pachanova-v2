'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard Error Boundary Caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="bg-[#0a111f] border border-pn-danger/30 rounded-2xl p-8 max-w-md w-full text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pn-danger/20 via-pn-danger to-pn-danger/20" />
        
        <div className="mx-auto bg-pn-danger/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 border border-pn-danger/20 shadow-[0_0_20px_rgba(244,63,94,0.1)]">
          <AlertCircle className="w-8 h-8 text-pn-danger" />
        </div>
        
        <h2 className="text-xl font-bold text-white mb-2">Error al Cargar</h2>
        <p className="text-white/60 text-sm mb-6">
          Ha ocurrido un problema al intentar cargar esta sección. {error.message ? `Detalle: ${error.message}` : 'Verifica tu conexión y vuelve a intentarlo.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 bg-pn-danger hover:bg-pn-danger/90 text-white font-medium py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
          >
            <RefreshCw className="w-4 h-4" />
            Reintentar
          </button>
          
          <Link 
            href="/dashboard/investor"
            className="flex-1 bg-white/5 hover:bg-white/10 text-white font-medium py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 border border-white/10"
          >
            <Home className="w-4 h-4" />
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
