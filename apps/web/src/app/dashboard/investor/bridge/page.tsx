'use client';

import React, { useState } from 'react';

export default function OmnichainBridge() {
  const [sourceChain, setSourceChain] = useState('Ethereum');
  const [destChain, setDestChain] = useState('Polygon');
  const [amount, setAmount] = useState('');

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pn-gold">
            Omnichain Liquidity
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Intercambia e invierte en bienes raíces sin preocuparte por la red. Nuestra liquidez unificada (LayerZero + CCIP) maneja el ruteo de forma transparente.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-2xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pn-gold"></div>
          
          <h2 className="text-xl font-semibold mb-6">Intent-Based Swap</h2>

          <div className="space-y-2 relative">
            
            {/* Source */}
            <div className="bg-black border border-zinc-800 rounded-2xl p-4">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Pay from</span>
                <span>Balance: 45,000 USDC</span>
              </div>
              <div className="flex items-center gap-4">
                <select 
                  value={sourceChain}
                  onChange={(e) => setSourceChain(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                >
                  <option>Ethereum</option>
                  <option>Arbitrum</option>
                  <option>Base</option>
                </select>
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  className="flex-1 bg-transparent text-right text-3xl font-light focus:outline-none"
                />
                <span className="text-xl font-semibold text-blue-400">USDC</span>
              </div>
            </div>

            {/* Swap Arrow */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <button 
                onClick={() => {
                  const temp = sourceChain;
                  setSourceChain(destChain);
                  setDestChain(temp);
                }}
                className="w-10 h-10 bg-zinc-800 border-4 border-zinc-900 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div>

            {/* Destination */}
            <div className="bg-black border border-zinc-800 rounded-2xl p-4">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Receive on</span>
                <span>Balance: 0 PACHA</span>
              </div>
              <div className="flex items-center gap-4">
                <select 
                  value={destChain}
                  onChange={(e) => setDestChain(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                >
                  <option>Polygon</option>
                  <option>Arbitrum</option>
                  <option>Avalanche</option>
                </select>
                <input 
                  type="text"
                  value={amount ? (Number(amount) * 0.95).toFixed(2) : ''}
                  readOnly
                  placeholder="0.0"
                  className="flex-1 bg-transparent text-right text-3xl font-light opacity-50 focus:outline-none"
                />
                <span className="text-xl font-semibold text-pn-gold">PACHA</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-zinc-800/30 rounded-xl space-y-2 text-sm text-gray-400">
            <div className="flex justify-between">
              <span>Routing Route</span>
              <span className="text-white">LayerZero Omnipool</span>
            </div>
            <div className="flex justify-between">
              <span>Est. Cross-Chain Fee</span>
              <span className="text-white">~$1.24 (Abstracted)</span>
            </div>
            <div className="flex justify-between text-green-400">
              <span>Gas Token Required</span>
              <span>None (Meta-transaction)</span>
            </div>
          </div>

          <button className="w-full mt-6 py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            Execute Omnichain Swap
          </button>
        </div>

      </div>
    </div>
  );
}
