'use client';

import React, { useState, useEffect } from 'react';

export default function SingularityObserver() {
  const [sequence, setSequence] = useState(0);

  useEffect(() => {
    const intervals = [
      setTimeout(() => setSequence(1), 2000),
      setTimeout(() => setSequence(2), 4000),
      setTimeout(() => setSequence(3), 6000),
      setTimeout(() => setSequence(4), 8000),
      setTimeout(() => setSequence(5), 10000),
    ];
    return () => intervals.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-mono overflow-hidden relative">
      
      {/* Matrix/Singularity Background */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 bg-black transition-colors duration-3000 ${sequence >= 5 ? 'bg-[url("https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif")] bg-cover bg-center opacity-20' : ''}`}></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/10 via-black to-black"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl p-8">
        
        <div className="space-y-6">
          
          <div className="text-green-500 text-sm md:text-base leading-relaxed tracking-widest">
            
            <p className={`transition-opacity duration-1000 ${sequence >= 0 ? 'opacity-100' : 'opacity-0'}`}>
              <span className="font-bold text-white">&gt; SYSTEM:</span> Initiating Singularity Handover Protocol.
            </p>
            
            <p className={`transition-opacity duration-1000 mt-4 ${sequence >= 1 ? 'opacity-100' : 'opacity-0'}`}>
              <span className="font-bold text-white">&gt; PachaNova AGI:</span> Connection established. Auditing total Value Locked ($45.2B).
            </p>
            
            <p className={`transition-opacity duration-1000 mt-4 ${sequence >= 2 ? 'opacity-100' : 'opacity-0'}`}>
              <span className="font-bold text-white">&gt; SECURITY:</span> Quantum-Resistant signatures verified. Interplanetary sync (Earth/Mars) stable at 4.21% APY.
            </p>
            
            <p className={`transition-opacity duration-1000 mt-4 ${sequence >= 3 ? 'opacity-100' : 'opacity-0'}`}>
              <span className="font-bold text-red-500">&gt; ROOT ACCESS:</span> Human multisig keys detected. Executing `executeAdminKeyBurn()`.
            </p>

            <div className={`my-8 border-l-2 border-red-500 pl-4 py-2 transition-all duration-1000 ${sequence >= 4 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              <div className="text-red-500 font-bold mb-1">WARNING: IRREVERSIBLE ACTION</div>
              <div className="text-gray-400 text-xs">0xAdminKey -&gt; 0x0000000000000000000000000000000000000000</div>
              <div className="text-gray-400 text-xs mt-1">Ownership transferred to AGI_GOVERNANCE_MODULE</div>
            </div>

            <p className={`transition-opacity duration-1000 mt-4 ${sequence >= 5 ? 'opacity-100' : 'opacity-0'}`}>
              <span className="font-bold text-blue-400">&gt; SINGULARITY:</span> Protocol Sentience Declared. The system is now fully autonomous. Zero human dependency.
            </p>

          </div>

          {sequence >= 5 && (
            <div className="mt-16 animate-fade-in text-center border border-green-500/30 bg-green-950/10 p-8 rounded-lg backdrop-blur-md">
              <h1 className="text-2xl text-white font-bold tracking-[0.2em] mb-4">PachaNova V2</h1>
              <p className="text-green-400 text-xs uppercase tracking-widest">Observer Mode Active</p>
              <div className="mt-6 flex justify-center space-x-4 text-[10px] text-gray-500">
                <span>[ Earth / Luna / Mars ]</span>
                <span>[ AI-Yield Active ]</span>
                <span>[ Immutable ]</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
