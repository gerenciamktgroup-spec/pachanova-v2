'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AIDashboard() {
  const models = [
    { name: 'XGBoost Yield Predictor', accuracy: '94.2%', status: 'Active', nextRebalance: '14 mins' },
    { name: 'LSTM Volatility Index', accuracy: '89.1%', status: 'Training', nextRebalance: '—' },
    { name: 'Chainlink Price Oracle', accuracy: '99.9%', status: 'Synced', nextRebalance: 'Real-time' }
  ];

  return (
    <div className="space-y-8 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Yield Optimization</h1>
          <p className="text-gray-400">Modelos predictivos en tiempo real para rebalanceo automático de portafolios (ERC-4626).</p>
        </div>
        <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg shadow-purple-500/20 hover:from-indigo-400 hover:to-purple-500 transition-all">
          Force Rebalance
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {models.map((model, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden"
          >
            <div className={`absolute top-0 left-0 w-1 h-full ${model.status === 'Active' ? 'bg-green-500' : model.status === 'Training' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-white font-medium">{model.name}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${model.status === 'Active' ? 'bg-green-500/10 text-green-400' : model.status === 'Training' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-blue-500/10 text-blue-400'}`}>
                {model.status}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Accuracy</span>
              <span className="text-white">{model.accuracy}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-400">Next Rebalance</span>
              <span className="text-white">{model.nextRebalance}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 h-[400px] flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-6">Predicted NAV Trajectory</h2>
          <div className="flex-1 border border-zinc-800 rounded-xl bg-black/50 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="text-zinc-600 font-mono text-sm">[ Recharts ML Projection Graph ]</div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 h-[400px] flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-6">AI Risk Scoring Engine</h2>
          <div className="space-y-6 flex-1">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">San Bartolo Genesis</span>
                <span className="text-green-400 font-mono">Risk: Low (1.2)</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full w-[20%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Lurin Expansion</span>
                <span className="text-yellow-400 font-mono">Risk: Med (4.5)</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div className="bg-yellow-500 h-full w-[45%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Piura Beachfront</span>
                <span className="text-red-400 font-mono">Risk: High (8.9)</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full w-[89%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
