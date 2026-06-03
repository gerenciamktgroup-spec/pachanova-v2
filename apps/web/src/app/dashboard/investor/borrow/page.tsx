'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function BorrowingDashboard() {
  const [borrowAmount, setBorrowAmount] = useState('');
  const maxBorrow = 2500; // Based on $5000 PACHA collateral at 50% LTV
  const currentDebt = 0;
  const ltv = 0; // Current LTV

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        <div>
          <h1 className="text-4xl font-bold mb-4">Lend & Borrow</h1>
          <p className="text-gray-400">Usa tus terrenos virtuales (PACHA) como colateral para pedir préstamos líquidos en USDC al instante. Sin verificaciones crediticias.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Collateral Value', value: '$5,000' },
            { label: 'Max Borrowable', value: '$2,500' },
            { label: 'Current Debt', value: '$0.00' },
            { label: 'Health Factor', value: '∞', highlight: true }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-2xl border ${stat.highlight ? 'bg-green-900/20 border-green-500/50' : 'bg-zinc-900 border-zinc-800'}`}
            >
              <div className="text-sm text-gray-400 mb-2">{stat.label}</div>
              <div className={`text-2xl font-light ${stat.highlight ? 'text-green-400' : 'text-white'}`}>{stat.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Borrow USDC</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Borrow Amount</span>
                  <span className="text-blue-400">Available: ${maxBorrow.toLocaleString()}</span>
                </div>
                <div className="relative">
                  <input 
                    type="number" 
                    value={borrowAmount}
                    onChange={(e) => setBorrowAmount(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="0.00"
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-blue-400 font-medium">MAX</button>
                </div>
              </div>

              <div className="bg-black/50 rounded-xl p-4 space-y-3 text-sm border border-white/5">
                <div className="flex justify-between">
                  <span className="text-gray-400">Fixed Interest Rate</span>
                  <span className="text-white">5.00% APR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Liquidation Threshold</span>
                  <span className="text-red-400">70.00% LTV</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: `${ltv}%` }} />
                </div>
                <div className="text-right text-xs text-gray-500 mt-1">Projected LTV: {((Number(borrowAmount) || 0) / 5000 * 100).toFixed(2)}%</div>
              </div>

              <button className="w-full py-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">
                Borrow Now
              </button>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Repay Loan</h2>
            <p className="text-gray-400 mb-8">Paga tu deuda para reducir el riesgo de liquidación y liberar tu colateral en PACHA.</p>
            
            <div className="bg-black/50 border border-zinc-800 rounded-2xl p-6 text-center text-gray-500">
              No active loans. Borrow USDC to see your repayment schedule here.
            </div>

            <button disabled className="w-full py-4 mt-8 rounded-xl bg-zinc-800 text-zinc-500 font-semibold cursor-not-allowed">
              Repay Debt
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
