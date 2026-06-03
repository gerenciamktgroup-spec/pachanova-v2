'use client';

import React, { useState } from 'react';

export default function SpatialComputingPortal() {
  const [bciStatus, setBciStatus] = useState('Disconnected');

  const connectBCI = () => {
    setBciStatus('Calibrating Neural Sync...');
    setTimeout(() => setBciStatus('Connected - Alpha Waves Stable'), 3000);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white p-8 font-sans overflow-hidden relative">
      
      {/* Immersive 3D/Spatial Background Mock */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-[#020202] to-[#020202]"></div>
        {/* Simulating a 3D grid point cloud */}
        <div className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-[spin_120s_linear_infinite]"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
        
        {/* Header tailored for Spatial UX */}
        <div className="flex justify-between items-start backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-3xl">
          <div>
            <h1 className="text-3xl font-light tracking-wide mb-1">Spatial Land Viewer <span className="text-xs bg-white/10 px-2 py-1 rounded-full font-mono ml-2">visionOS Ready</span></h1>
            <p className="text-sm text-gray-400">PachaNova RealityKit Engine. Exploración volumétrica de activos del mundo real.</p>
          </div>
          <button 
            onClick={connectBCI}
            className={`px-6 py-3 rounded-full text-sm font-semibold tracking-wider transition-all duration-500 border ${
              bciStatus.includes('Connected') 
                ? 'bg-blue-900/40 text-blue-400 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                : 'bg-white text-black border-transparent hover:bg-gray-200'
            }`}
          >
            {bciStatus === 'Disconnected' ? 'Connect Neural BCI' : bciStatus}
          </button>
        </div>

        {/* Spatial UI Center Stage */}
        <div className="flex-1 flex items-center justify-center mt-8">
          <div className="text-center space-y-8">
            
            <div className="relative w-64 h-64 mx-auto perspective-1000">
              {/* Simulated 3D Hologram of a land parcel */}
              <div className="w-full h-full bg-gradient-to-tr from-green-900/50 to-blue-900/50 border border-white/20 rounded-xl transform rotate-x-45 rotate-z-12 hover:rotate-x-0 hover:rotate-z-0 transition-all duration-1000 cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-sm flex items-center justify-center">
                <div className="text-white/50 font-mono text-xs text-center">
                  <svg className="w-12 h-12 mx-auto mb-2 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                  Renderizando Malla Volumétrica...
                </div>
              </div>
              
              {/* Floating UI Elements attached to the 3D object */}
              <div className="absolute -right-32 top-10 bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl w-48 shadow-2xl">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">San Bartolo</div>
                <div className="text-xl font-bold text-white mb-2">Parcel #8842</div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-500">Yield</span>
                  <span className="text-green-400">14.2% APY</span>
                </div>
              </div>
            </div>

            {bciStatus.includes('Connected') && (
              <div className="animate-fade-in-up">
                <p className="text-xs text-blue-400 font-mono mb-4 tracking-widest uppercase">
                  Intent Detected: Attempting Signature
                </p>
                <div className="inline-block bg-black/80 backdrop-blur-xl border border-blue-500/50 p-6 rounded-3xl">
                  <h3 className="text-lg font-light text-white mb-4">Confirm Neural Transaction</h3>
                  <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden mb-2">
                    <div className="bg-blue-500 h-full w-[85%]"></div>
                  </div>
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>Gaze Tracking: Locked</span>
                    <span>Alpha Waves: Optimal</span>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
}
