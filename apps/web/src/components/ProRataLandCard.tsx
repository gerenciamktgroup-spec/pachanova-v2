"use client"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"

function LandMesh({ tokenBalance }: { tokenBalance: number }) {
  // Calculamos el porcentaje visual. Total 500k tokens.
  const percentage = Math.min((tokenBalance / 500000), 1)
  
  return (
    <group>
      {/* Base Land Representation */}
      <mesh receiveShadow position={[0, -0.5, 0]}>
        <boxGeometry args={[10, 1, 10]} />
        <meshStandardMaterial color="#2d3748" transparent opacity={0.5} />
      </mesh>
      
      {/* Pro-rata Ownership representation (golden highlight) */}
      {tokenBalance > 0 && (
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[10 * Math.sqrt(percentage), 1.02, 10 * Math.sqrt(percentage)]} />
          <meshStandardMaterial color="#ecc94b" emissive="#ecc94b" emissiveIntensity={0.5} />
        </mesh>
      )}
    </group>
  )
}

export function ProRataLandCard({ balance }: { balance: number }) {
  // 1 token = 0.1 m2. 500k = 50,000 m2
  const squareMeters = (balance * 0.1).toFixed(2);

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden relative" data-testid="pro-rata-land-card">
      <div className="absolute top-4 left-4 z-10 text-white drop-shadow-md">
        <h3 className="text-xl font-semibold tracking-tight">Tu Terreno (San Bartolo)</h3>
        <p className="text-sm opacity-80" data-testid="investor-sqm-value">{squareMeters} m² reales asignados a ti</p>
      </div>
      
      <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <Environment preset="city" />
        <LandMesh tokenBalance={balance} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}
