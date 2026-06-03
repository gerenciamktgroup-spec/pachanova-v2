'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function DynamicNavDashboard() {
  const [selectedProject, setSelectedProject] = useState('San Bartolo Genesis');
  const navValue = 185000;
  const previousNav = 150000;
  const appreciation = ((navValue - previousNav) / previousNav) * 100;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-4">Real-Time Appraisals</h1>
            <p className="text-gray-400 max-w-2xl">Visualiza la valoración de tus activos inmobiliarios (NAV) actualizada dinámicamente mediante Oráculos On-Chain conectados a bases de datos de tasación reales.</p>
          </div>
          <select 
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-pn-gold"
          >
            <option>San Bartolo Genesis (PACHA)</option>
            <option>Lurin Expansion (LURIN)</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl border bg-gradient-to-br from-pn-gold/20 to-black border-pn-gold/50 md:col-span-2"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="text-sm text-gray-400 mb-2">Current Net Asset Value (NAV)</div>
                <div className="text-5xl font-light text-pn-gold">${navValue.toLocaleString()} <span className="text-xl">USD</span></div>
              </div>
              <div className="bg-black/50 px-4 py-2 rounded-lg border border-white/10">
                <div className="text-xs text-gray-500">Appreciation</div>
                <div className="text-lg font-medium text-green-400">+{appreciation.toFixed(2)}%</div>
              </div>
            </div>
            
            <div className="h-48 w-full bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <span className="text-zinc-600 font-mono text-sm relative z-10">[ Interactive Chart Placeholder: Recharts Integration ]</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl border bg-zinc-900 border-zinc-800 space-y-6"
          >
            <h3 className="text-lg font-semibold border-b border-zinc-800 pb-4">Oracle Verification</h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Provider</span>
                <span className="text-white">Chainlink Any-API</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Update</span>
                <span className="text-white">2 mins ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Next Scheduled</span>
                <span className="text-white">In 24 hours</span>
              </div>
              <div className="flex flex-col gap-1 mt-4 pt-4 border-t border-zinc-800">
                <span className="text-gray-400 text-xs">On-Chain Tx Hash</span>
                <a href="#" className="text-blue-400 font-mono truncate hover:underline">0x8f3c...a1b2</a>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <h2 className="text-2xl font-semibold mb-6">Valuation History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-400 border-b border-zinc-800">
                <tr>
                  <th className="pb-4 font-medium">Date</th>
                  <th className="pb-4 font-medium">Event</th>
                  <th className="pb-4 font-medium text-right">Valuation (USD)</th>
                  <th className="pb-4 font-medium text-right">Oracle Tx</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                <tr>
                  <td className="py-4 text-white">2026-06-02</td>
                  <td className="py-4 text-gray-400">Q2 Appraisal Update</td>
                  <td className="py-4 text-green-400 text-right font-medium">$185,000</td>
                  <td className="py-4 text-right"><a href="#" className="text-blue-400 font-mono text-xs">0x8f3c...</a></td>
                </tr>
                <tr>
                  <td className="py-4 text-white">2026-01-15</td>
                  <td className="py-4 text-gray-400">Genesis Initial Valuation</td>
                  <td className="py-4 text-gray-300 text-right font-medium">$150,000</td>
                  <td className="py-4 text-right"><a href="#" className="text-blue-400 font-mono text-xs">0x1a2b...</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
