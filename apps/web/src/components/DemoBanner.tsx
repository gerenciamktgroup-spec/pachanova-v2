'use client';
import { useDemoMode } from '../hooks/useDemoMode';

export function DemoBanner() {
  const { isDemo } = useDemoMode();

  if (!isDemo) return null;

  return (
    <div className="w-full bg-amber-500 text-black text-center py-1 text-sm font-bold shadow-md z-50 sticky top-0">
      ⚠️ Estás en el entorno DEMO MIRROR. Las transacciones son simuladas y no tienen valor real.
    </div>
  );
}
