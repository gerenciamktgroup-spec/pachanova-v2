'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ZKDarkPortal() {
  const [proofStatus, setProofStatus] = useState<'idle' | 'generating' | 'verified'>('idle');

  const generateProof = () => {
    setProofStatus('generating');
    setTimeout(() => {
      setProofStatus('verified');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-300 p-8 font-mono">
      <div className="max-w-4xl mx-auto space-y-12">
        
        <div className="border-b border-zinc-800 pb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl tracking-widest text-white uppercase">Confidential Portal</h1>
            <span className="text-xs bg-zinc-900 px-3 py-1 border border-zinc-800 text-green-500">ZK-ROLLUP SECURED</span>
          </div>
          <p className="text-sm text-zinc-500 max-w-2xl">
            Execute institutional land transfers and claim rental yields with zero-knowledge privacy. 
            Balances and wallet addresses remain mathematically obscured on-chain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-zinc-900/50 border border-zinc-800 p-8">
            <h2 className="text-sm uppercase tracking-widest text-zinc-400 mb-6">Identity Obfuscation</h2>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center text-sm">
                <span>Public Wallet</span>
                <span className="text-zinc-600 line-through">0x8f3c...a1b2</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Stealth Address</span>
                <span className="text-blue-400">0xzk_9a...x89</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-zinc-800 pt-4">
                <span>KYC Accreditation</span>
                {proofStatus === 'verified' ? (
                  <span className="text-green-500">ZK-Proof Validated</span>
                ) : (
                  <span className="text-yellow-500">Unverified</span>
                )}
              </div>

              <button 
                onClick={generateProof}
                disabled={proofStatus !== 'idle'}
                className="w-full py-3 mt-4 border border-zinc-700 hover:bg-zinc-800 text-white text-xs uppercase tracking-widest transition-colors disabled:opacity-50"
              >
                {proofStatus === 'idle' ? 'Generate AnonAadhaar Proof' : proofStatus === 'generating' ? 'Computing SNARK...' : 'Identity Shielded'}
              </button>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 p-8">
            <h2 className="text-sm uppercase tracking-widest text-zinc-400 mb-6">Confidential Transfer</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-zinc-500 block mb-2 uppercase">Recipient Stealth Address</label>
                <input 
                  type="text" 
                  className="w-full bg-black border border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-600 transition-colors"
                  placeholder="0xzk_..."
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-2 uppercase">Asset</label>
                <select className="w-full bg-black border border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-600 text-zinc-300">
                  <option>San Bartolo Genesis (PACHA)</option>
                  <option>USDC (Yield Shielded)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-2 uppercase">Amount</label>
                <input 
                  type="number" 
                  className="w-full bg-black border border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-600 transition-colors"
                  placeholder="0.00"
                />
              </div>

              <button className="w-full py-3 mt-6 bg-zinc-100 text-black text-xs uppercase tracking-widest hover:bg-white transition-colors font-bold">
                Execute Private Transaction
              </button>
            </div>
          </div>

        </div>

        <div className="border border-zinc-800 p-6 bg-black">
          <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-4">On-Chain Obfuscation Log</h3>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex gap-4 opacity-50">
              <span className="text-zinc-600">10:45:01</span>
              <span className="text-green-500">[VALIDIUM]</span>
              <span className="text-zinc-400">State root updated. 142 private txs batched.</span>
            </div>
            <div className="flex gap-4">
              <span className="text-zinc-600">10:42:15</span>
              <span className="text-blue-500">[SNARK]</span>
              <span className="text-zinc-400">Proof verified for address 0xzk_...</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
