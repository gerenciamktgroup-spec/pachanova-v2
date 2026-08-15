'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { Suspense, useState, useEffect } from 'react';

interface LayerProps {
  y: number;
  height: number;
  color: string;
  label: string;
  subLabel?: string;
  width?: number;
  depth?: number;
  opacity?: number;
}

function TrustLayer({ y, height, color, label, subLabel, width = 7.5, depth = 5.2, opacity = 0.9 }: LayerProps) {
  return (
    <group position={[0, y, 0]}>
      <mesh>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.6} 
          roughness={0.35}
          transparent={opacity < 1}
          opacity={opacity}
        />
      </mesh>
      
      {/* Borde sutil superior */}
      <mesh position={[0, height / 2 + 0.01, 0]}>
        <boxGeometry args={[width + 0.08, 0.03, depth + 0.08]} />
        <meshStandardMaterial color="#c5a46d" metalness={0.8} roughness={0.2} />
      </mesh>

      <Html position={[0, height / 2 + 0.6, depth / 2 + 0.4]} style={{ pointerEvents: 'none' }}>
        <div className="text-center">
          <div className="text-[10px] font-semibold tracking-[1.5px] text-white/90">{label}</div>
          {subLabel && (
            <div className="text-[9px] text-white/50 -mt-px tracking-wider">{subLabel}</div>
          )}
        </div>
      </Html>
    </group>
  );
}

function TokenParticles() {
  // Pequeños tokens flotando sobre la capa superior (holders)
  const tokens = Array.from({ length: 14 });
  return (
    <group>
      {tokens.map((_, i) => {
        const x = (Math.sin(i * 2.3) * 3.8) + (i % 3 - 1) * 0.4;
        const z = (Math.cos(i * 1.7) * 2.4) + (i % 2) * 0.6;
        const y = 4.8 + Math.sin(i) * 0.35;
        
        return (
          <mesh key={i} position={[x, y, z]} rotation={[0.3, i, 0]}>
            <boxGeometry args={[0.16, 0.028, 0.16]} />
            <meshStandardMaterial 
              color={i % 3 === 0 ? "#c5a46d" : "#4a5c78"} 
              metalness={0.75} 
              roughness={0.25} 
            />
          </mesh>
        );
      })}
    </group>
  );
}

export function TrustStructure3D() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative w-full h-[460px] rounded-3xl overflow-hidden border border-white/10 bg-[#070d19] flex items-center justify-center">
        <div className="text-white/40 text-sm font-mono tracking-widest">CARGANDO ESTRUCTURA FIDUCIARIA...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[460px] rounded-3xl overflow-hidden border border-white/10 bg-[#070d19]">
      <Canvas 
        camera={{ position: [9, 8, 12], fov: 38 }} 
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          
          <directionalLight 
            position={[12, 18, 10]} 
            intensity={1.2} 
            color="#f5ede0"
          />
          <directionalLight 
            position={[-14, 5, -8]} 
            intensity={0.4} 
            color="#7a8ba8"
          />

          {/* Capa 1 (Base): La Tierra Física */}
          <TrustLayer 
            y={0} 
            height={0.9} 
            color="#1d283c" 
            label="1. ACTIVO INMOBILIARIO" 
            subLabel="500.000 m² · SUNARP"
            width={7.8}
            depth={5.4}
          />

          {/* Capa 2 (Intermedia): El Fideicomiso */}
          <TrustLayer 
            y={2.1} 
            height={0.7} 
            color="#2a3952" 
            label="2. PATRIMONIO FIDUCIARIO" 
            subLabel="Ley 26702 · Fiduciario Profesional"
            width={6.8}
            depth={4.6}
            opacity={0.88}
          />

          {/* Capa 3 (Superior): Los Tokens PACHA */}
          <TrustLayer 
            y={4.0} 
            height={0.55} 
            color="#3d5172" 
            label="3. TOKENS ERC-3643 / T-REX" 
            subLabel="Participación + Rentabilidad Pro-rata"
            width={5.8}
            depth={3.8}
            opacity={0.85}
          />

          <TokenParticles />

          <OrbitControls 
            enablePan={false} 
            enableZoom={true}
            enableRotate={true}
            autoRotate 
            autoRotateSpeed={0.06}
            minDistance={8}
            maxDistance={22}
            minPolarAngle={Math.PI * 0.2}
            maxPolarAngle={Math.PI * 0.75}
          />
        </Suspense>
      </Canvas>

      <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs pointer-events-none">
        <div className="text-[10px] tracking-widest text-[#c5a46d]/80 bg-[#0a111f]/80 px-3 py-1 rounded-full border border-white/10 font-mono">
          ARQUITECTURA DE TRES CAPAS
        </div>
      </div>
    </div>
  );
}
