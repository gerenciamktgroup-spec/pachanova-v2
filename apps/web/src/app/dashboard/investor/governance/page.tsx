'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function GovernanceDashboard() {
  const proposals = [
    {
      id: 'PIP-04',
      title: 'Upgrade San Bartolo Irrigation System',
      status: 'Active',
      votesFor: 45000,
      votesAgainst: 1200,
      quorumProgress: 65,
      endDate: '2 days left'
    },
    {
      id: 'PIP-03',
      title: 'Liquidate 15% of Lurin Expansion to stablecoin reserves',
      status: 'Executed',
      votesFor: 85000,
      votesAgainst: 30000,
      quorumProgress: 100,
      endDate: 'Ended'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold mb-4">DAO Governance</h1>
            <p className="text-gray-400 max-w-2xl">Participa en las decisiones clave sobre las propiedades inmobiliarias. Tu poder de voto es proporcional a tus PACHA tokens.</p>
          </div>
          <button className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
            Delegate Votes
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <div className="text-sm text-gray-400 mb-1">Your Voting Power</div>
            <div className="text-3xl font-semibold text-white">5,000 <span className="text-lg text-pn-gold">vPACHA</span></div>
          </div>
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <div className="text-sm text-gray-400 mb-1">Proposals Voted</div>
            <div className="text-3xl font-semibold text-white">12</div>
          </div>
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <div className="text-sm text-gray-400 mb-1">Delegated To</div>
            <div className="text-lg font-mono text-blue-400 mt-2">Self</div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold border-b border-zinc-800 pb-4">Active Proposals</h2>
          
          {proposals.map((prop, i) => (
            <motion.div 
              key={prop.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-zinc-700 transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-pn-gold font-mono text-sm">{prop.id}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${prop.status === 'Active' ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>
                      {prop.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-medium">{prop.title}</h3>
                </div>
                <div className="text-right text-sm text-gray-400">
                  {prop.endDate}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-green-400">For ({prop.votesFor.toLocaleString()})</span>
                    <span className="text-red-400">Against ({prop.votesAgainst.toLocaleString()})</span>
                  </div>
                  <div className="w-full h-2 flex rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full" style={{ width: `${(prop.votesFor / (prop.votesFor + prop.votesAgainst)) * 100}%` }}></div>
                    <div className="bg-red-500 h-full" style={{ width: `${(prop.votesAgainst / (prop.votesFor + prop.votesAgainst)) * 100}%` }}></div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Quorum: {prop.quorumProgress}% reached</span>
                  {prop.status === 'Active' && (
                    <div className="ml-auto flex gap-2">
                      <button className="px-4 py-1.5 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/10 transition-colors">Vote For</button>
                      <button className="px-4 py-1.5 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors">Vote Against</button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
