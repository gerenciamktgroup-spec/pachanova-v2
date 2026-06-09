'use client';

import React, { useState } from 'react';
import { processFiatInvestment } from '@/actions/invest';
import { ArrowRight, Loader2 } from 'lucide-react';

export function InvestButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInvest = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      // Mock de FormData para la simulación
      const formData = new FormData();
      formData.append('amount', '50000'); // $50,000 USD
      formData.append('trustId', 'e3a4792c-561b-4cf7-8b01-xxxxxxxxxxxx'); // Fideicomiso MOCK

      const result = await processFiatInvestment(formData);
      
      if (result.success) {
        setMessage('✅ Inversión procesada exitosamente.');
      } else {
        setMessage('❌ Error: ' + result.message);
      }
    } catch (error: any) {
      setMessage('❌ Error crítico: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleInvest}
        disabled={isLoading}
        className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-medium text-sm rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Procesando Pago...
          </>
        ) : (
          <>
            Invertir $50k USD (Demo)
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
      {message && <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">{message}</p>}
    </div>
  );
}
