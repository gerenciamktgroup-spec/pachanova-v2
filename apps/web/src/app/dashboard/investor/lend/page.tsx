'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function RWALendingDashboard() {
  const [activeTab, setActiveTab] = useState('Borrow');

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Money Markets</h1>
            <p className="text-gray-400">Mercados de préstamos descentralizados sobrecocolateralizados con bienes raíces (RWA).</p>
          </div>
          <div className="flex gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">Market Size</div>
              <div className="text-xl font-bold text-white">$12.5M</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Global Utilization</div>
              <div className="text-xl font-bold text-pn-gold">65.2%</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="flex gap-4 border-b border-zinc-800 pb-4 mb-6">
              <button 
                onClick={() => setActiveTab('Borrow')}
                className={`text-lg font-medium px-4 py-2 rounded-lg transition-colors ${activeTab === 'Borrow' ? 'bg-zinc-800 text-white' : 'text-gray-500 hover:text-white'}`}
              >
                Borrow against Land
              </button>
              <button 
                onClick={() => setActiveTab('Supply')}
                className={`text-lg font-medium px-4 py-2 rounded-lg transition-colors ${activeTab === 'Supply' ? 'bg-zinc-800 text-white' : 'text-gray-500 hover:text-white'}`}
              >
                Supply USDC
              </button>
            </div>

            {activeTab === 'Borrow' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm text-gray-500 mb-4">Available Collateral</h3>
                  <div className="bg-black border border-zinc-700 p-4 rounded-xl flex justify-between items-center cursor-pointer hover:border-pn-gold transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-900 rounded-lg"></div>
                      <div>
                        <div className="font-semibold text-white">San Bartolo Genesis</div>
                        <div className="text-xs text-gray-400">Bal: 15,000 PACHA ($15,750)</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-pn-gold text-sm font-bold">Max LTV: 60%</div>
                      <button className="text-xs text-blue-400 hover:underline">Select</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-500 block mb-2">Borrow Amount</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        className="w-full bg-black border border-zinc-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-pn-gold"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">USDC</span>
                    </div>
                  </div>
                  <div className="bg-black border border-zinc-800 p-4 rounded-xl">
                    <div className="text-sm text-gray-500 mb-1">Current Borrow APY</div>
                    <div className="text-xl font-bold text-red-400">8.45%</div>
                  </div>
                </div>

                <button className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                  Approve PACHA & Borrow
                </button>
              </div>
            )}

            {activeTab === 'Supply' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-500 block mb-2">Supply Amount</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        className="w-full bg-black border border-zinc-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">USDC</span>
                    </div>
                  </div>
                  <div className="bg-black border border-zinc-800 p-4 rounded-xl">
                    <div className="text-sm text-gray-500 mb-1">Current Supply APY</div>
                    <div className="text-xl font-bold text-green-400">5.20%</div>
                  </div>
                </div>

                <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-colors">
                  Supply USDC
                </button>
              </div>
            )}

          </div>

          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Your Health Factor</h2>
              <div className="text-5xl font-light text-green-400 mb-4">1.85</div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden mb-6">
                <div className="bg-green-500 h-full w-[60%]"></div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Collateral</span>
                  <span className="text-white">$15,750</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Borrows</span>
                  <span className="text-red-400">$5,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Liquidation Threshold</span>
                  <span className="text-white">85% LTV</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
              <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-widest">Protocol Risk Metrics</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white">USDC Liquidity Available</span>
                    <span className="text-blue-400">$4.3M</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1 rounded-full">
                    <div className="bg-blue-500 h-full w-[35%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white">RWA Locked Value</span>
                    <span className="text-green-400">$18.2M</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1 rounded-full">
                    <div className="bg-green-500 h-full w-[80%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
