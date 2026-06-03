'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AnalyticsDashboard() {
  const stats = [
    { label: 'Total TVL', value: '$1.25M', change: '+12.5%', isPositive: true },
    { label: 'Active Investors', value: '1,204', change: '+5.2%', isPositive: true },
    { label: 'Staking Yield', value: '14.5% APY', change: '-0.5%', isPositive: false },
    { label: 'Platform Fees', value: '$45,200', change: '+22.4%', isPositive: true }
  ];

  return (
    <div className="space-y-8 pb-24">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Real-Time BI Analytics</h1>
        <p className="text-gray-400">Visión macro del ecosistema PachaNova y métricas de tesorería.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl relative overflow-hidden"
          >
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-pn-gold/5 rounded-full blur-2xl"></div>
            <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
            <div className="text-3xl font-semibold text-white mb-4">{stat.value}</div>
            <div className={`text-sm font-medium ${stat.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {stat.change} vs last month
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <h2 className="text-lg font-semibold text-white mb-6">TVL & Liquidity Growth</h2>
          <div className="h-72 w-full flex items-end gap-2 text-xs text-gray-500 relative">
            {/* Mock Chart */}
            <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none">
              <div className="border-b border-zinc-800 w-full h-0"></div>
              <div className="border-b border-zinc-800 w-full h-0"></div>
              <div className="border-b border-zinc-800 w-full h-0"></div>
              <div className="border-b border-zinc-800 w-full h-0"></div>
            </div>
            {[40, 45, 50, 48, 60, 75, 80, 85, 95, 100, 98, 110].map((h, i) => (
              <motion.div 
                key={i} 
                className="flex-1 bg-gradient-to-t from-pn-gold/20 to-pn-gold/80 rounded-t-sm"
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.05, duration: 1 }}
              ></motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-500">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <h2 className="text-lg font-semibold text-white mb-6">Cross-Chain Distribution</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white">Polygon (POS)</span>
                <span className="text-gray-400">65%</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full w-[65%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white">Base</span>
                <span className="text-gray-400">25%</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[25%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white">Arbitrum</span>
                <span className="text-gray-400">10%</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full w-[10%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
