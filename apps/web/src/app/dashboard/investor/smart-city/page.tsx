'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function SmartCityEditor() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState(0);

  const triggerAIGeneration = () => {
    setIsGenerating(true);
    setGenerationStage(1);
    setTimeout(() => setGenerationStage(2), 2000); // Topography mapping
    setTimeout(() => setGenerationStage(3), 4000); // Zoning & Streets
    setTimeout(() => setGenerationStage(4), 6000); // Architectural rendering
    setTimeout(() => setIsGenerating(false), 8000);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      
      {/* 3D WebGL Canvas Placeholder for Smart City */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=2930&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        {isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-20">
            <div className="text-center">
              <div className="w-32 h-32 border-4 border-pn-gold border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold text-white mb-2">Procedural AI Engine Active</h2>
              <p className="text-pn-gold font-mono tracking-widest text-sm uppercase">
                {generationStage === 1 && "Ingesting Topographical Data..."}
                {generationStage === 2 && "Calculating Optimal Zoning..."}
                {generationStage === 3 && "Generating 3D Architectural Models..."}
                {generationStage === 4 && "Finalizing Scene Lighting..."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* UI Overlays */}
      <div className="absolute inset-0 z-10 p-8 flex flex-col justify-between pointer-events-none">
        
        {/* Header */}
        <div className="pointer-events-auto flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold tracking-tight">AI Smart City Planner</h1>
              <span className="bg-pn-gold/20 text-pn-gold border border-pn-gold/50 text-xs px-2 py-1 rounded">Luma AI + WebGL</span>
            </div>
            <p className="text-gray-400 max-w-xl">Generación procedural de arquitectura y urbanismo en terrenos tokenizados. Vota por el mejor diseño arquitectónico para desarrollo físico.</p>
          </div>
          <button 
            onClick={triggerAIGeneration}
            disabled={isGenerating}
            className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] disabled:opacity-50"
          >
            Generate New Proposal
          </button>
        </div>

        {/* Floating City Metrics & Editor Controls */}
        <div className="pointer-events-auto flex justify-between items-end">
          
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 w-80">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Zoning Parameters</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 flex justify-between">
                  <span>Residential</span>
                  <span className="text-white">40%</span>
                </label>
                <div className="w-full bg-zinc-800 h-2 rounded-full"><div className="bg-blue-400 h-full w-[40%] rounded-full"></div></div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 flex justify-between">
                  <span>Commercial</span>
                  <span className="text-white">35%</span>
                </label>
                <div className="w-full bg-zinc-800 h-2 rounded-full"><div className="bg-purple-400 h-full w-[35%] rounded-full"></div></div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 flex justify-between">
                  <span>Green Spaces</span>
                  <span className="text-white">25%</span>
                </label>
                <div className="w-full bg-zinc-800 h-2 rounded-full"><div className="bg-green-400 h-full w-[25%] rounded-full"></div></div>
              </div>
            </div>
          </div>

          <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 w-96">
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Proposal #892</h3>
                <p className="text-xs text-gray-400">Generado por AI Model v3.2</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">Estimated Cost</div>
                <div className="text-pn-gold font-bold">$12.4M</div>
              </div>
            </div>
            
            <div className="flex gap-4 mb-4">
              <div className="flex-1 text-center bg-zinc-900/50 p-2 rounded-lg border border-white/5">
                <div className="text-xs text-gray-500">Projected APY</div>
                <div className="font-semibold text-green-400">18.5%</div>
              </div>
              <div className="flex-1 text-center bg-zinc-900/50 p-2 rounded-lg border border-white/5">
                <div className="text-xs text-gray-500">Legal Check</div>
                <div className="font-semibold text-blue-400">Compliant</div>
              </div>
            </div>

            <button className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl hover:from-green-500 hover:to-green-400 transition-colors shadow-lg shadow-green-900/20">
              Vote to Fund (DAO)
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
