'use client';

import React, { useState } from 'react';

export default function QuantumWalletClient() {
  const [migrationStatus, setMigrationStatus] = useState('unprotected');

  const startMigration = () => {
    setMigrationStatus('generating');
    setTimeout(() => setMigrationStatus('protecting'), 3000);
    setTimeout(() => setMigrationStatus('secured'), 6000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-mono">
      <div className="max-w-4xl mx-auto space-y-12">
        
        <div className="border-b border-zinc-800 pb-8 text-center space-y-4">
          <h1 className="text-4xl tracking-widest text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            Quantum-Safe Vault
          </h1>
          <p className="text-sm text-zinc-500 max-w-2xl mx-auto">
            Protege tus títulos de propiedad contra ataques de computación cuántica (Algoritmo de Shor) utilizando firmas basadas en retículos (CRYSTALS-Dilithium).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-[#050505] border border-zinc-800 p-8 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1 ${migrationStatus === 'secured' ? 'bg-cyan-500 shadow-[0_0_20px_#06b6d4]' : 'bg-red-500 shadow-[0_0_20px_#ef4444]'}`}></div>
            
            <h2 className="text-sm uppercase tracking-widest text-zinc-400 mb-6">Security Posture</h2>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center text-sm">
                <span>Current Standard</span>
                <span className="text-zinc-600">ECDSA (secp256k1)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Vulnerability</span>
                <span className={migrationStatus === 'secured' ? 'text-zinc-600 line-through' : 'text-red-500'}>Critical (Shor's Algorithm)</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-zinc-800 pt-4">
                <span>Post-Quantum Key</span>
                {migrationStatus === 'secured' ? (
                  <span className="text-cyan-400">CRYSTALS-Dilithium V3</span>
                ) : (
                  <span className="text-zinc-600">Not Generated</span>
                )}
              </div>

              <button 
                onClick={startMigration}
                disabled={migrationStatus !== 'unprotected'}
                className={`w-full py-3 mt-4 border border-zinc-700 text-xs uppercase tracking-widest transition-colors ${
                  migrationStatus === 'unprotected' ? 'hover:bg-zinc-800 text-white' : 
                  migrationStatus === 'secured' ? 'bg-cyan-900/20 text-cyan-500 border-cyan-800 cursor-not-allowed' : 
                  'bg-zinc-800 text-zinc-400 cursor-not-allowed'
                }`}
              >
                {migrationStatus === 'unprotected' ? 'Generate QRC Keypair' : 
                 migrationStatus === 'generating' ? 'Computing Lattice Vector...' : 
                 migrationStatus === 'protecting' ? 'Broadcasting QRC Anchor...' : 
                 'Assets Quantum Secured'}
              </button>
            </div>
          </div>

          <div className="bg-[#050505] border border-zinc-800 p-8">
            <h2 className="text-sm uppercase tracking-widest text-zinc-400 mb-6">Asset Migration Tool</h2>
            
            <div className="space-y-4">
              <div className="bg-black border border-zinc-800 p-4 flex justify-between items-center">
                <div>
                  <div className="text-sm text-white">San Bartolo Genesis</div>
                  <div className="text-xs text-zinc-600">ID: 8842</div>
                </div>
                {migrationStatus === 'secured' ? (
                  <span className="text-xs bg-cyan-900/30 text-cyan-400 px-2 py-1 rounded border border-cyan-800">QRC Protected</span>
                ) : (
                  <span className="text-xs bg-red-900/30 text-red-500 px-2 py-1 rounded border border-red-800">Legacy ECDSA</span>
                )}
              </div>

              <div className="bg-black border border-zinc-800 p-4 flex justify-between items-center">
                <div>
                  <div className="text-sm text-white">Lurin Expansion</div>
                  <div className="text-xs text-zinc-600">ID: 9910</div>
                </div>
                {migrationStatus === 'secured' ? (
                  <span className="text-xs bg-cyan-900/30 text-cyan-400 px-2 py-1 rounded border border-cyan-800">QRC Protected</span>
                ) : (
                  <span className="text-xs bg-red-900/30 text-red-500 px-2 py-1 rounded border border-red-800">Legacy ECDSA</span>
                )}
              </div>
            </div>
          </div>

        </div>

        {migrationStatus === 'secured' && (
          <div className="border border-cyan-900 p-6 bg-cyan-950/10 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <h3 className="text-xs uppercase tracking-widest text-cyan-500 mb-4">Post-Quantum Cryptographic Log</h3>
            <div className="space-y-2 font-mono text-xs">
              <div className="flex gap-4">
                <span className="text-cyan-600">11:04:22</span>
                <span className="text-white">Lattice polynomial generated.</span>
              </div>
              <div className="flex gap-4">
                <span className="text-cyan-600">11:04:24</span>
                <span className="text-white">Public Key Hash anchored to QRCRegistry.sol.</span>
              </div>
              <div className="flex gap-4">
                <span className="text-cyan-600">11:04:26</span>
                <span className="text-green-400">All associated ERC-3643 tokens migrated to QRC requirement state.</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
