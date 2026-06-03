'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function NetworkStateDashboard() {
  const [broadcastStatus, setBroadcastStatus] = useState('Standby');

  const executeDeclaration = () => {
    setBroadcastStatus('Broadcasting genesis block...');
    setTimeout(() => setBroadcastStatus('Sovereignty Ratified on Ethereum L1'), 4000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-8 font-serif">
      <div className="max-w-5xl mx-auto space-y-12">
        
        <div className="text-center space-y-6 pb-12 border-b border-zinc-800">
          <div className="w-24 h-24 mx-auto border border-pn-gold rounded-full flex items-center justify-center p-2 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
            <svg className="w-12 h-12 text-pn-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-5xl font-light tracking-widest text-pn-gold uppercase">Network State Genesis</h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto italic">
            El amanecer de las Micro-Naciones Soberanas. Adquisición global de tierras mediada por DAO y pasaportes criptográficos inmutables.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-zinc-900 border border-zinc-800 p-8">
            <h2 className="text-xl font-light text-white mb-6 uppercase tracking-widest">Digital Passports (SBT)</h2>
            <div className="space-y-6">
              <div className="bg-black border border-pn-gold/30 p-6 relative overflow-hidden group hover:border-pn-gold transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg className="w-24 h-24 text-pn-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <div className="text-xs text-pn-gold uppercase tracking-widest mb-4">PachaNova Citizen</div>
                <div className="text-2xl font-serif text-white mb-1">0x89...4F2A</div>
                <div className="text-sm text-zinc-500 font-mono mb-4">Passport ID: #00001</div>
                <div className="flex gap-4 border-t border-zinc-800 pt-4">
                  <div className="text-xs">
                    <div className="text-zinc-600 uppercase">UBI Status</div>
                    <div className="text-green-500">Active - 12 USDC/day</div>
                  </div>
                  <div className="text-xs">
                    <div className="text-zinc-600 uppercase">Voting Power</div>
                    <div className="text-white">High (Founder)</div>
                  </div>
                </div>
              </div>
              <button className="w-full py-4 border border-zinc-700 text-zinc-300 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                Mint Genesis Passport
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-zinc-900 border border-zinc-800 p-8">
              <h2 className="text-xl font-light text-white mb-4 uppercase tracking-widest">Autonomous Central Treasury</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <span className="text-zinc-500">Sovereign Reserve (Land Value)</span>
                  <span className="text-2xl text-white font-mono">$1.24B</span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <span className="text-zinc-500">PachaUSD in Circulation</span>
                  <span className="text-xl text-blue-400 font-mono">$450M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Global UBI Distributed</span>
                  <span className="text-xl text-green-400 font-mono">$2.1M</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-8">
              <h2 className="text-xl font-light text-white mb-4 uppercase tracking-widest">Sovereignty Declaration</h2>
              <p className="text-sm text-zinc-500 mb-6 italic">
                La ratificación de la constitución incrusta las leyes de la Micro-Nación de forma inmutable en el L1 de Ethereum. Este acto es irreversible.
              </p>
              
              <button 
                onClick={executeDeclaration}
                disabled={broadcastStatus !== 'Standby'}
                className={`w-full py-4 border font-bold uppercase tracking-widest transition-all ${
                  broadcastStatus === 'Standby' 
                  ? 'bg-pn-gold text-black border-pn-gold hover:bg-yellow-500 shadow-[0_0_20px_rgba(212,175,55,0.4)]' 
                  : 'bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed'
                }`}
              >
                {broadcastStatus === 'Standby' ? 'Ratify Constitution (L1)' : broadcastStatus}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
