'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function StakingDashboard() {
  const [stakeAmount, setStakeAmount] = useState('');
  const apy = 14.5; // Example APY
  const totalStaked = 125000;
  const userStaked = 5000;
  const rewardsEarned = 120.45;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        <div>
          <h1 className="text-4xl font-bold mb-4">DeFi Staking</h1>
          <p className="text-gray-400">Bloquea tus tokens PACHA y gana rendimientos pasivos en USDC generados por las rentas agrícolas del terreno.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Current APY', value: `${apy}%`, highlight: true },
            { label: 'Your Staked PACHA', value: userStaked.toLocaleString() },
            { label: 'Total Value Locked', value: `$${totalStaked.toLocaleString()}` }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-2xl border ${stat.highlight ? 'bg-gradient-to-br from-pn-gold/20 to-black border-pn-gold/50' : 'bg-zinc-900 border-zinc-800'}`}
            >
              <div className="text-sm text-gray-400 mb-2">{stat.label}</div>
              <div className={`text-3xl font-light ${stat.highlight ? 'text-pn-gold' : 'text-white'}`}>{stat.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Stake PACHA</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Amount to Stake</span>
                  <span className="text-pn-gold">Balance: 15,000 PACHA</span>
                </div>
                <div className="relative">
                  <input 
                    type="number" 
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-pn-gold transition-colors"
                    placeholder="0.00"
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-pn-gold font-medium">MAX</button>
                </div>
              </div>

              <div className="bg-black/50 rounded-xl p-4 space-y-2 text-sm border border-white/5">
                <div className="flex justify-between">
                  <span className="text-gray-400">Lock Period</span>
                  <span className="text-white">None (Flexible)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Estimated Monthly Yield</span>
                  <span className="text-green-400">+${((Number(stakeAmount) || 0) * (apy/100) / 12).toFixed(2)} USDC</span>
                </div>
              </div>

              <button className="w-full py-4 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition-colors">
                Stake Tokens
              </button>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Claim Rewards</h2>
              <p className="text-gray-400 mb-8">Tus rendimientos generados por el arrendamiento del terreno se distribuyen en USDC directamente a tu wallet.</p>
              
              <div className="text-center py-12 border-2 border-dashed border-zinc-700 rounded-2xl mb-8">
                <div className="text-sm text-gray-400 mb-2">Unclaimed Rewards</div>
                <div className="text-5xl font-light text-white mb-2">{rewardsEarned.toFixed(2)}</div>
                <div className="text-pn-gold text-sm font-medium">USDC</div>
              </div>
            </div>

            <button className="w-full py-4 rounded-xl bg-transparent border border-pn-gold text-pn-gold font-semibold hover:bg-pn-gold hover:text-black transition-colors">
              Claim {rewardsEarned.toFixed(2)} USDC
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
