'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const networks = [
  { id: 'polygon', name: 'Polygon (POS)', icon: '🟣', isTestnet: false },
  { id: 'base', name: 'Base', icon: '🔵', isTestnet: false },
  { id: 'arbitrum', name: 'Arbitrum One', icon: '🔷', isTestnet: false },
];

export function NetworkSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeNetwork, setActiveNetwork] = useState(networks[0]);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-4 py-2 rounded-full text-sm font-medium text-white transition-colors"
      >
        <span>{activeNetwork.icon}</span>
        <span className="hidden md:inline">{activeNetwork.name}</span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden z-50"
          >
            <div className="py-2">
              {networks.map(network => (
                <button
                  key={network.id}
                  onClick={() => {
                    setActiveNetwork(network);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${activeNetwork.id === network.id ? 'bg-zinc-800 text-white' : 'text-gray-400 hover:bg-zinc-800/50 hover:text-white'}`}
                >
                  <span>{network.icon}</span>
                  <span>{network.name}</span>
                  {activeNetwork.id === network.id && (
                    <svg className="w-4 h-4 ml-auto text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
