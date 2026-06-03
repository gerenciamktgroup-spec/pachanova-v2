'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function MetaverseExplorer() {
  const [selectedParcel, setSelectedParcel] = useState<string | null>(null);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      
      {/* 3D WebGL Canvas Placeholder */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-40 blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
        <div className="text-center z-10">
          <div className="w-64 h-64 border border-pn-gold/30 rounded-full animate-[spin_20s_linear_infinite] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="w-96 h-96 border border-pn-gold/10 rounded-full animate-[spin_40s_linear_infinite_reverse] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          <span className="text-pn-gold font-mono tracking-widest text-sm bg-black/50 px-4 py-2 rounded-lg backdrop-blur-md border border-pn-gold/50">
            [ WebGL Spatial Engine Active ]
          </span>
        </div>
      </div>

      {/* Floating UI Overlays */}
      <div className="absolute inset-0 z-10 pointer-events-none p-8 flex flex-col justify-between">
        
        {/* Header */}
        <div className="pointer-events-auto flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-lg">Spatial Explorer</h1>
            <p className="text-gray-300 drop-shadow-md">Navega gemelos digitales de tierras en tiempo real (ERC-3643).</p>
          </div>
          <div className="flex gap-4">
            <button className="bg-black/50 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors">
              Topography Mode
            </button>
            <button className="bg-pn-gold text-black px-4 py-2 rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(184,161,122,0.5)]">
              Connect VR
            </button>
          </div>
        </div>

        {/* Floating Property Cards on the 3D map */}
        <div className="pointer-events-auto absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2">
          <button 
            onClick={() => setSelectedParcel('San Bartolo Genesis')}
            className={`w-4 h-4 rounded-full shadow-[0_0_20px_#4ade80] transition-transform ${selectedParcel === 'San Bartolo Genesis' ? 'bg-white scale-150' : 'bg-green-400 hover:scale-125'}`}
          ></button>
        </div>
        
        <div className="pointer-events-auto absolute top-2/3 right-1/3 -translate-x-1/2 -translate-y-1/2">
          <button 
            onClick={() => setSelectedParcel('Lurin Expansion')}
            className={`w-4 h-4 rounded-full shadow-[0_0_20px_#b8a17a] transition-transform ${selectedParcel === 'Lurin Expansion' ? 'bg-white scale-150' : 'bg-pn-gold hover:scale-125'}`}
          ></button>
        </div>

        {/* Selected Parcel Info Panel */}
        <div className="pointer-events-auto flex justify-end">
          {selectedParcel && (
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-96 bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-white">{selectedParcel}</h2>
                <button onClick={() => setSelectedParcel(null)} className="text-gray-500 hover:text-white">✕</button>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop" 
                className="w-full h-40 object-cover rounded-xl mb-4"
                alt="Parcel Thumbnail"
              />
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Coordinates</span>
                  <span className="text-white font-mono">-12.384, -76.792</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Tokens</span>
                  <span className="text-white">100,000 PACHA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Current NAV</span>
                  <span className="text-green-400 font-medium">$185,000 USD</span>
                </div>
              </div>
              <button className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors">
                Purchase Fractions
              </button>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}
