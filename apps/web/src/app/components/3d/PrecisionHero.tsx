import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Suspense, useState, useEffect } from 'react';

function Terrain() {
  return (
    <mesh rotation={[-0.35, 0.1, 0]} position={[0, -0.8, 0]}>
      <planeGeometry args={[14, 14, 48, 48]} />
      <meshLambertMaterial color="#1c2638" />
    </mesh>
  );
}

function TokenField() {
  return (
    <group>
      {Array.from({ length: 26 }).map((_, i) => (
        <mesh 
          key={i}
          position={[
            Math.sin(i * 1.3) * 4.2 + (i % 4 - 1.5) * 0.6,
            0.6 + Math.cos(i * 0.9) * 0.9,
            (i % 7 - 3) * 1.35 + Math.sin(i) * 0.4
          ]}
          rotation={[0.2, i * 0.4, 0.1]}
        >
          <boxGeometry args={[0.22, 0.035, 0.22]} />
          <meshStandardMaterial 
            color={i % 4 === 0 ? "#c5a46d" : "#2f3c52"} 
            metalness={0.7} 
            roughness={0.35} 
          />
        </mesh>
      ))}
    </group>
  );
}

export function PrecisionHero3D() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="absolute inset-0 z-0 bg-[#0a111f]" />;
  }

  return (
    <div className="absolute inset-0 z-0">
      <Canvas 
        camera={{ position: [0, 5.5, 11], fov: 46 }} 
        style={{ background: '#0a111f' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.35} />
          <directionalLight 
            position={[10, 18, 8]} 
            intensity={1.25} 
            color="#e2d4b8"
          />
          <directionalLight 
            position={[-12, 6, -10]} 
            intensity={0.4} 
            color="#6b7c99"
          />

          <Terrain />
          <TokenField />

          <Stars 
            radius={120} 
            depth={50} 
            count={220} 
            factor={2.8} 
            saturation={0} 
            fade 
            speed={0.4} 
          />

          <OrbitControls 
            enablePan={false} 
            enableZoom={false} 
            enableRotate={true}
            autoRotate 
            autoRotateSpeed={0.12}
            minPolarAngle={Math.PI * 0.22}
            maxPolarAngle={Math.PI * 0.78}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
