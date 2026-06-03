'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { Suspense } from 'react';

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
  return (
    <div className="relative w-full h-[380px] rounded-3xl overflow-hidden border border-white/10 bg-[#070d19]">
      <Canvas 
        camera={{ position: [0, 5, 16], fov: 44 }} 
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[12, 26, -8]} intensity={1.1} color="#f5e9d4" />
          <directionalLight position={[-14, 8, 16]} intensity={0.6} color="#8a96b0" />

          {/* Capas del Fideicomiso - de abajo hacia arriba */}
          <TrustLayer 
            y={-0.4} 
            height={1.15} 
            color="#1a2539" 
            label="TERRENO REAL" 
            subLabel="500.000 m² • SUNARP" 
            width={8.2}
            depth={5.6}
          />
          
          <TrustLayer 
            y={1.35} 
            height={1.35} 
            color="#232f48" 
            label="FIDEICOMISO" 
            subLabel="Ley 26702 • Escritura Pública" 
            opacity={0.92}
          />
          
          <TrustLayer 
            y={3.1} 
            height={1.1} 
            color="#2c3b55" 
            label="FIDUCIARIOS (3)" 
            subLabel="Quórum 2/3 para decisiones" 
            width={7.1}
            opacity={0.85}
          />
          
          <TrustLayer 
            y={4.55} 
            height={0.95} 
            color="#37455f" 
            label="TOKEN HOLDERS" 
            subLabel="5.000.000 tokens • Gobernanza proporcional" 
            width={6.4}
            opacity={0.78}
          />

          <TokenParticles />

          <OrbitControls 
            enablePan={false} 
            enableZoom={true}
            enableRotate={true}
            autoRotate 
            autoRotateSpeed={0.028}
            minDistance={8}
            maxDistance={19}
            minPolarAngle={Math.PI * 0.12}
            maxPolarAngle={Math.PI * 0.82}
          />
        </Suspense>
      </Canvas>

      <div className="absolute top-5 right-5 px-3 py-1 text-[10px] tracking-[1px] rounded bg-[#0a111f]/80 border border-white/10 text-white/50">
        ESTRUCTURA FIDUCIARIA
      </div>
    </div>
  );
}
