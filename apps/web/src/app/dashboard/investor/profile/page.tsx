'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ProfileGamificationDashboard() {
  const achievements = [
    { title: 'Pioneer Investor', description: 'Participated in the Genesis Land Sale', date: '2026-01-15', rarity: 'Legendary', color: 'from-purple-600 to-indigo-600' },
    { title: 'DAO Governor', description: 'Voted on 10+ DAO Proposals', date: '2026-05-10', rarity: 'Epic', color: 'from-pn-gold to-yellow-600' },
    { title: 'Liquidity Provider', description: 'Provided $10k+ to PACHA/USDC pool', date: '2026-06-01', rarity: 'Rare', color: 'from-blue-500 to-cyan-500' }
  ];

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pn-gold to-black border-2 border-pn-gold shadow-[0_0_20px_rgba(184,161,122,0.4)] flex items-center justify-center text-3xl font-bold">
            0x
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">0x8f3c...a1b2</h1>
            <div className="flex gap-2">
              <span className="bg-green-900/30 text-green-400 border border-green-800 px-3 py-1 rounded-full text-xs font-medium">KYC Verified (Tier 2)</span>
              <span className="bg-pn-gold/20 text-pn-gold border border-pn-gold/50 px-3 py-1 rounded-full text-xs font-medium">Rank: Top 5%</span>
            </div>
          </div>
        </div>
        <button className="bg-zinc-900 border border-zinc-700 text-white px-6 py-2 rounded-xl text-sm hover:bg-zinc-800 transition-colors">
          Share Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold text-white">Soulbound Achievements (SBTs)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((ach, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-[1px] rounded-2xl bg-gradient-to-br ${ach.color}`}
              >
                <div className="bg-zinc-900 h-full rounded-2xl p-6 relative overflow-hidden">
                  <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${ach.color} opacity-20 blur-3xl`}></div>
                  <div className="text-xs font-mono mb-2 flex justify-between">
                    <span className="text-gray-400">{ach.date}</span>
                    <span className="text-white font-bold tracking-wider">{ach.rarity}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{ach.title}</h3>
                  <p className="text-sm text-gray-400">{ach.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Dynamic Deeds</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex gap-6 items-center">
              <img src="https://images.unsplash.com/photo-1628624747186-a941c476b7ef?q=80&w=200&auto=format&fit=crop" className="w-24 h-24 rounded-xl object-cover" />
              <div>
                <h3 className="text-white font-semibold text-lg">Lurin Expansion (Fraction #45)</h3>
                <p className="text-gray-400 text-sm mb-2">Stage 2: Infrastructure Development</p>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[66%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Development Power</h2>
            <div className="text-4xl font-light text-pn-gold mb-2">1.5x</div>
            <p className="text-sm text-gray-400 mb-6">Multiplicador de gobernanza basado en staking de largo plazo y SBTs activos.</p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Base Power</span>
                <span className="text-white">1.0x</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Pioneer Bonus</span>
                <span className="text-green-400">+0.2x</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">1-Year Lock</span>
                <span className="text-green-400">+0.3x</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Global Leaderboard</h2>
            <div className="space-y-4">
              {[
                { rank: 1, address: '0x1a2b...9900', power: '3.2x' },
                { rank: 2, address: '0x4f8a...1122', power: '2.8x' },
                { rank: 3, address: '0x8f3c...a1b2', power: '1.5x', isMe: true },
                { rank: 4, address: '0x9b1a...3344', power: '1.2x' },
              ].map((user) => (
                <div key={user.rank} className={`flex justify-between items-center p-2 rounded-lg ${user.isMe ? 'bg-pn-gold/10 border border-pn-gold/30' : ''}`}>
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-sm ${user.rank === 1 ? 'text-pn-gold' : 'text-gray-500'}`}>#{user.rank}</span>
                    <span className={`text-sm ${user.isMe ? 'text-white font-medium' : 'text-gray-400'}`}>{user.address}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{user.power}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
