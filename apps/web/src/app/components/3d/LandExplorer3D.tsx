'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { Suspense, useMemo } from 'react';
import * as THREE from 'three';

// Terreno con ligera variación topográfica (San Bartolo feel)
function RealisticTerrain() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(16, 16, 64, 64);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Suaves ondulaciones + pendiente suave hacia el mar (oeste)
      const height = 
        Math.sin(x * 0.6) * 0.18 +
        Math.sin(y * 0.9 + 1.2) * 0.12 +
        Math.cos(x * 0.35 + y * 0.4) * 0.1 +
        (x * -0.015); // ligera inclinación
      
      pos.setZ(i, height);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh 
      geometry={geometry} 
      rotation={[-Math.PI * 0.48, 0.08, 0.03]} 
      position={[0, -0.6, 0]}
    >
      <meshLambertMaterial 
        color="#1f2a3f" 
        flatShading={false}
      />
    </mesh>
  );
}

// Grid de parcelas tokenizadas (cada una representa ~0.1 m² en escala)
function TokenParcels({ highlightCount = 18 }: { highlightCount?: number }) {
  const parcels = useMemo(() => {
    const items: Array<{ pos: [number, number, number]; highlighted: boolean; id: number }> = [];
    const gridSize = 11;
    const spacing = 0.92;
    
    let idx = 0;
    for (let x = -gridSize; x <= gridSize; x += 2) {
      for (let z = -gridSize; z <= gridSize; z += 2) {
        const px = x * spacing + (Math.sin(idx) * 0.06);
        const pz = z * spacing + (Math.cos(idx * 0.7) * 0.05);
        const py = 0.22 + Math.sin(x * 0.4 + z * 0.6) * 0.04;
        
        const highlighted = idx % 7 === 0 || idx % 11 === 1; // ~18% destacados
        
        items.push({
          pos: [px, py, pz],
          highlighted,
          id: idx
        });
        idx++;
      }
    }
    return items.slice(0, 120); // limitar para performance
  }, []);

  return (
    <group>
      {parcels.map((parcel, i) => (
        <mesh 
          key={i}
          position={parcel.pos}
          rotation={[0.1, 0.05 + i * 0.001, -0.02]}
        >
          <boxGeometry args={[0.38, 0.028, 0.38]} />
          <meshStandardMaterial 
            color={parcel.highlighted ? "#c5a46d" : "#2c3a52"} 
            metalness={parcel.highlighted ? 0.65 : 0.35} 
            roughness={parcel.highlighted ? 0.28 : 0.55}
            emissive={parcel.highlighted ? "#3a2f1f" : "#000000"}
            emissiveIntensity={parcel.highlighted ? 0.08 : 0}
          />
        </mesh>
      ))}
    </group>
  );
}

// Marcadores / etiquetas 3D sutiles
function SpatialLabels() {
  return (
    <group>
      <Html position={[-3.8, 1.6, -4.5]} style={{ pointerEvents: 'none' }}>
        <div className="text-[10px] font-mono tracking-[1.5px] text-[#c5a46d]/70 bg-[#0a111f]/60 px-2 py-0.5 rounded border border-[#c5a46d]/20">
          ZONA NORTE
        </div>
      </Html>
      <Html position={[4.2, 0.9, 3.8]} style={{ pointerEvents: 'none' }}>
        <div className="text-[10px] font-mono tracking-[1.5px] text-white/40 bg-[#0a111f]/60 px-2 py-0.5 rounded border border-white/10">
          EXPANSIÓN
        </div>
      </Html>
    </group>
  );
}

export function LandExplorer3D() {
  return (
    <div className="relative w-full h-[420px] rounded-3xl overflow-hidden border border-white/10 bg-[#070d19]">
      <Canvas 
        camera={{ position: [0, 7.2, 13.5], fov: 42 }} 
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.42} />
          
          {/* Luz principal cálida (amanecer sobre la costa) */}
          <directionalLight 
            position={[14, 22, -6]} 
            intensity={1.35} 
            color="#f4e9d8"
            castShadow={false}
          />
          {/* Luz de relleno fría */}
          <directionalLight 
            position={[-18, 9, 14]} 
            intensity={0.55} 
            color="#7e8da8"
          />

          <RealisticTerrain />
          <TokenParcels />
          <SpatialLabels />

          <OrbitControls 
            enablePan={false} 
            enableZoom={true}
            enableRotate={true}
            autoRotate 
            autoRotateSpeed={0.035}
            minDistance={7}
            maxDistance={22}
            minPolarAngle={Math.PI * 0.18}
            maxPolarAngle={Math.PI * 0.78}
          />
        </Suspense>
      </Canvas>

      {/* Overlay de información elegante */}
      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-xs pointer-events-none">
        <div className="px-4 py-1.5 rounded-full bg-[#0a111f]/70 border border-white/10 text-white/60 backdrop-blur">
          500.000 m² • San Bartolo, Lima Sur
        </div>
        <div className="px-4 py-1.5 rounded-full bg-[#0a111f]/70 border border-[#c5a46d]/30 text-[#c5a46d]/80 backdrop-blur font-medium tracking-widest">
          EXPLORA EL TERRENO
        </div>
      </div>
    </div>
  );
}
