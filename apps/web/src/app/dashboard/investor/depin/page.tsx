'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function DePINDashboard() {
  const nodes = [
    { id: 'NODE-001', location: 'San Bartolo Genesis', status: 'Online', battery: '98%', uptime: '99.9%' },
    { id: 'NODE-002', location: 'Lurin Expansion', status: 'Online', battery: '45%', uptime: '99.5%' },
    { id: 'NODE-003', location: 'Piura Beachfront', status: 'Offline', battery: '0%', uptime: '82.1%' }
  ];

  return (
    <div className="space-y-8 pb-24">
      <div className="flex justify-between items-end border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">DePIN Sensor Network</h1>
          <p className="text-gray-400">Infraestructura Física Descentralizada. Oráculos IoT transmitiendo datos de los terrenos físicos a la blockchain.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-black border border-zinc-800 px-4 py-2 rounded-lg text-right">
            <div className="text-xs text-gray-500">Active Nodes</div>
            <div className="text-green-400 font-bold font-mono">1,024</div>
          </div>
          <button className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
            Register Hardware Gateway
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 h-[500px] flex flex-col relative overflow-hidden">
          <h2 className="text-lg font-semibold text-white mb-4 z-10 relative">Global DePIN Geospatial Map</h2>
          
          <div className="absolute inset-0 z-0">
            {/* Mapbox/WebGL Mock */}
            <div className="absolute inset-0 bg-[#0a0a0a]">
              <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
              <div className="absolute top-1/3 left-1/3 w-3 h-3 bg-green-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-2/3 right-1/4 w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>

          <div className="mt-auto z-10 pointer-events-none">
            <div className="bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-xl pointer-events-auto w-64">
              <h3 className="text-sm font-bold text-white mb-2">NODE-001 (San Bartolo)</h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between"><span className="text-gray-500">Temp</span><span className="text-white">24.5°C</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Soil Moisture</span><span className="text-blue-400">62%</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Foot Traffic (24h)</span><span className="text-pn-gold">1,402</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Node Health Monitor</h2>
            <div className="space-y-4">
              {nodes.map((node) => (
                <div key={node.id} className="bg-black border border-zinc-800 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-sm text-white">{node.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${node.status === 'Online' ? 'bg-green-900/30 text-green-500 border border-green-800' : 'bg-red-900/30 text-red-500 border border-red-800'}`}>
                      {node.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mb-3">{node.location}</div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Battery: <span className="text-white">{node.battery}</span></span>
                    <span className="text-gray-500">Uptime: <span className="text-white">{node.uptime}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-pn-gold/20 to-black border border-pn-gold/30 rounded-3xl p-6">
            <h2 className="text-lg font-bold text-pn-gold mb-2">Maintainer Bounties</h2>
            <p className="text-xs text-gray-400 mb-4">Gana tokens PACHA reparando nodos DePIN fuera de línea en las ubicaciones físicas.</p>
            <button className="w-full py-2 bg-pn-gold text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors text-sm">
              View Open Bounties
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
