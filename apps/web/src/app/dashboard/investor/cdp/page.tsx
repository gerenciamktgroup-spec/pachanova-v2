'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function StablecoinCDPDashboard() {
  const [collateralAmount, setCollateralAmount] = useState('10000');
  const [mintAmount, setMintAmount] = useState('5000');

  // Mock calculations
  const collateralValue = Number(collateralAmount) * 1.05; // $1.05 per PACHA
  const debt = Number(mintAmount);
  const healthFactor = debt > 0 ? (collateralValue / debt) * 100 : 0;
  const isHealthy = healthFactor >= 150;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">PachaUSD (pUSD)</h1>
              <span className="bg-blue-900/30 text-blue-400 border border-blue-800 text-xs px-2 py-1 rounded">Algorithmic Stablecoin</span>
            </div>
            <p className="text-gray-400 max-w-2xl">Acuña stablecoins descentralizadas respaldadas por tus tokens inmobiliarios. Mantén un ratio de colateral seguro para evitar liquidación.</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">PACHA Oracle Price</div>
            <div className="text-xl font-bold text-green-400">$1.05 USD</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <h2 className="text-xl font-semibold mb-6 border-b border-zinc-800 pb-4">Manage CDP Vault</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-sm text-gray-500 mb-2 block">Deposit Collateral (PACHA)</label>
                  <div className="relative mb-2">
                    <input 
                      type="number" 
                      value={collateralAmount}
                      onChange={(e) => setCollateralAmount(e.target.value)}
                      className="w-full bg-black border border-zinc-700 rounded-xl py-4 px-4 text-white text-xl focus:outline-none focus:border-pn-gold"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-pn-gold font-bold">PACHA</div>
                  </div>
                  <div className="text-right text-sm text-gray-500">Value: ${collateralValue.toLocaleString()}</div>
                </div>

                <div>
                  <label className="text-sm text-gray-500 mb-2 block">Mint Debt (pUSD)</label>
                  <div className="relative mb-2">
                    <input 
                      type="number" 
                      value={mintAmount}
                      onChange={(e) => setMintAmount(e.target.value)}
                      className="w-full bg-black border border-zinc-700 rounded-xl py-4 px-4 text-white text-xl focus:outline-none focus:border-blue-500"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 font-bold">pUSD</div>
                  </div>
                  <div className="text-right text-sm text-gray-500">Stability Fee: 2.5% APY</div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-black border border-zinc-800 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">Health Factor</span>
                  <span className={`text-2xl font-bold ${isHealthy ? 'text-green-400' : 'text-red-500'}`}>
                    {healthFactor.toFixed(2)}%
                  </span>
                </div>
                <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${healthFactor >= 200 ? 'bg-green-500' : healthFactor >= 150 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                    style={{ width: `${Math.min(healthFactor / 3, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Liquidation at 150%</span>
                  <span>Safe &gt; 200%</span>
                </div>
              </div>

              <button 
                disabled={!isHealthy || debt === 0}
                className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-500 hover:to-indigo-500 transition-colors shadow-lg shadow-blue-900/20"
              >
                {isHealthy ? 'Update Vault & Mint' : 'Health Factor Too Low'}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Your Position</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                  <span className="text-gray-400">Locked PACHA</span>
                  <span className="font-medium">45,000.00</span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                  <span className="text-gray-400">Minted pUSD</span>
                  <span className="font-medium text-blue-400">20,000.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Current Health</span>
                  <span className="text-green-400 font-medium">236.25%</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
              <h2 className="text-lg font-semibold text-white mb-2">Yield Repayment</h2>
              <p className="text-sm text-gray-400 mb-6">Los rendimientos de alquiler de tus PACHA bloqueados pagan automáticamente tu deuda en pUSD.</p>
              
              <div className="bg-black border border-green-900/30 p-4 rounded-xl text-center">
                <div className="text-sm text-gray-500 mb-1">Debt Paid Automatically (YTD)</div>
                <div className="text-2xl font-bold text-green-400">$1,450.20 pUSD</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
