import React from 'react';
import PortfolioOverview from '@/components/portfolio/PortfolioOverview';
import { InvestButton } from '@/components/portfolio/InvestButton';

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pb-20">
      
      {/* Banner Superior / Call to Action de Inversión */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 py-8 px-6 md:px-10 mb-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-xl font-medium text-neutral-800 dark:text-neutral-100">Oportunidades de Inversión</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Aporta capital fiat a nuevos fideicomisos con un clic.</p>
          </div>
          <div>
            <InvestButton />
          </div>
        </div>
      </div>

      {/* Componente Principal de Portafolio */}
      <PortfolioOverview />

    </div>
  );
}
