'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ProTradingDashboard() {
  const [orderType, setOrderType] = useState('Market');
  const [amount, setAmount] = useState('');

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">PACHA / USDC</h1>
              <span className="bg-zinc-800 text-gray-300 text-xs px-2 py-1 rounded">Polygon POS</span>
            </div>
            <div className="flex gap-6 text-sm">
              <div><span className="text-gray-500">Price</span> <span className="text-green-400 font-medium">$1.02</span></div>
              <div><span className="text-gray-500">24h Vol</span> <span className="text-white">$45.2K</span></div>
              <div><span className="text-gray-500">Liquidity</span> <span className="text-white">$1.2M</span></div>
            </div>
          </div>
          <button className="text-sm bg-zinc-900 border border-zinc-700 px-4 py-2 rounded-lg hover:bg-zinc-800">
            Provide Liquidity
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Chart Section */}
          <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-2xl h-[500px] relative overflow-hidden flex flex-col">
            <div className="p-4 border-b border-zinc-800 flex gap-4 text-sm text-gray-400">
              <button className="text-pn-gold border-b border-pn-gold pb-1">Price</button>
              <button className="hover:text-white">Depth</button>
              <div className="ml-auto flex gap-2">
                <span>1H</span><span className="text-white">4H</span><span>1D</span><span>1W</span>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-20"></div>
              <span className="text-zinc-600 font-mono text-sm relative z-10">[ TradingView Lightweight Chart Integration ]</span>
            </div>
          </div>

          {/* Order Entry Section */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col">
            <div className="flex gap-2 p-1 bg-black rounded-lg mb-6">
              {['Market', 'Limit'].map(type => (
                <button 
                  key={type}
                  onClick={() => setOrderType(type)}
                  className={`flex-1 py-1.5 text-sm rounded-md transition-colors ${orderType === type ? 'bg-zinc-800 text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="space-y-4 flex-1">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Pay (USDC)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-pn-gold text-right"
                    placeholder="0.00"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">USDC</span>
                  </div>
                </div>
                <div className="text-right text-xs text-gray-500 mt-1">Balance: $42,000.00</div>
              </div>

              <div className="flex justify-center">
                <button className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Receive (PACHA)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={Number(amount) * 0.98 || ''}
                    readOnly
                    className="w-full bg-black border border-zinc-700 rounded-xl py-3 px-4 text-white text-right opacity-70"
                    placeholder="0.00"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <div className="w-5 h-5 bg-pn-gold rounded-full"></div>
                    <span className="text-sm font-medium">PACHA</span>
                  </div>
                </div>
              </div>

              {orderType === 'Limit' && (
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Limit Price (USDC per PACHA)</label>
                  <input 
                    type="number" 
                    className="w-full bg-black border border-zinc-700 rounded-xl py-3 px-4 text-white text-right focus:outline-none focus:border-pn-gold"
                    defaultValue="1.00"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 space-y-2 mb-6">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Slippage Tolerance</span>
                <span className="text-white">0.5%</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Network Fee</span>
                <span className="text-white">~$0.02</span>
              </div>
            </div>

            <button className="w-full py-4 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold shadow-lg shadow-green-900/20 hover:from-green-500 hover:to-green-400 transition-all">
              Buy PACHA
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
