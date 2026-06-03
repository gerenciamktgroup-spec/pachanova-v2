'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function InterplanetaryRegistry() {
  const [activePlanet, setActivePlanet] = useState('Mars');
  const [syncStatus, setSyncStatus] = useState('Syncing via Deep Space Network (DTN)...');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSyncStatus('Telemetry Synced. Oracle Data Current (Latency: 14m 22s)');
    }, 4000);
    return () => clearTimeout(timer);
  }, [activePlanet]);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-mono overflow-hidden relative">
      
      {/* Immersive Space Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=2874&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className={`absolute inset-0 transition-opacity duration-1000 ${activePlanet === 'Mars' ? 'bg-red-900/40 mix-blend-multiply' : 'bg-gray-500/20 mix-blend-multiply'}`}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-widest uppercase mb-2">Interplanetary Registry <span className="text-xs bg-red-900/50 border border-red-500 text-red-400 px-2 py-1 rounded ml-2">ERC-X Standard</span></h1>
            <p className="text-sm text-gray-400 max-w-xl">Tokenización de activos extraplanetarios utilizando Rollups Optimistas de Alta Latencia y Redes Tolerantes a Retardos (DTN).</p>
          </div>
          
          <div className="text-right">
            <div className={`text-xs px-3 py-1 rounded-full border ${syncStatus.includes('Synced') ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-yellow-900/30 text-yellow-400 border-yellow-800 animate-pulse'}`}>
              {syncStatus}
            </div>
            <div className="text-xs text-gray-500 mt-2">Deep Space Network (DSN) Uplink</div>
          </div>
        </div>

        {/* Planet Selector & Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <button 
            onClick={() => setActivePlanet('Mars')}
            className={`p-4 rounded-2xl border text-left transition-all ${activePlanet === 'Mars' ? 'bg-red-950/40 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-black/40 border-zinc-800 hover:border-zinc-600'}`}
          >
            <div className="text-2xl mb-1">🔴</div>
            <div className="font-bold text-lg">Mars</div>
            <div className="text-xs text-gray-500">Olympus Mons Sector</div>
          </button>
          <button 
            onClick={() => setActivePlanet('Luna')}
            className={`p-4 rounded-2xl border text-left transition-all ${activePlanet === 'Luna' ? 'bg-gray-900/40 border-gray-400 shadow-[0_0_15px_rgba(156,163,175,0.2)]' : 'bg-black/40 border-zinc-800 hover:border-zinc-600'}`}
          >
            <div className="text-2xl mb-1">🌕</div>
            <div className="font-bold text-lg">Luna</div>
            <div className="text-xs text-gray-500">Tranquility Base</div>
          </button>
          
          <div className="col-span-2 bg-black/60 border border-zinc-800 rounded-2xl p-4 flex justify-between items-center backdrop-blur-md">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Available ILR Liquidity</div>
              <div className="text-2xl font-bold text-white">$14.2B PachaUSD</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Earth-Mars Arb Spread</div>
              <div className="text-xl font-bold text-blue-400">4.12%</div>
            </div>
          </div>
        </div>

        {/* Spatial Map & Claims */}
        <div className="flex-1 grid grid-cols-3 gap-8">
          
          <div className="col-span-2 bg-black/40 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden backdrop-blur-sm">
            <h2 className="text-sm uppercase tracking-widest text-zinc-400 mb-4 absolute z-10">Celestial Spatial Indexing (H3/S2)</h2>
            
            {/* Holographic Wireframe Map Mock */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-96 h-96 rounded-full border border-dashed animate-[spin_60s_linear_infinite] ${activePlanet === 'Mars' ? 'border-red-500/30' : 'border-gray-400/30'}`}></div>
              <div className={`absolute w-80 h-80 rounded-full border animate-[spin_40s_linear_infinite_reverse] ${activePlanet === 'Mars' ? 'border-red-400/20' : 'border-gray-300/20'}`}></div>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_15px_white]"></div>
                <div className="absolute top-6 left-6 text-xs text-white bg-black/50 px-2 py-1 rounded border border-white/20 whitespace-nowrap">
                  ILR Claim #001 (Genesis)
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black/60 border border-zinc-800 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-widest">Execute Claim</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-zinc-500 uppercase">Target Coordinates (Lat/Lon)</label>
                  <div className="text-sm text-white bg-zinc-900/50 border border-zinc-800 p-3 rounded-lg mt-1 font-mono">
                    {activePlanet === 'Mars' ? '18.65° N, 226.2° E' : '0.674° N, 23.472° E'}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase">Area (SQM)</label>
                  <div className="text-sm text-white bg-zinc-900/50 border border-zinc-800 p-3 rounded-lg mt-1 font-mono">
                    1,000,000 m²
                  </div>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase">Est. Confirmation Delay</label>
                  <div className="text-sm text-yellow-400 bg-yellow-900/10 border border-yellow-900/30 p-3 rounded-lg mt-1 font-mono">
                    ~14 minutes (Light-speed latency)
                  </div>
                </div>
              </div>
            </div>

            <button className={`w-full py-4 mt-8 text-black font-bold uppercase tracking-widest rounded-xl transition-all ${
              syncStatus.includes('Synced') ? 'bg-white hover:bg-gray-200' : 'bg-gray-600 cursor-not-allowed'
            }`}>
              Broadcast L2 Claim
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
