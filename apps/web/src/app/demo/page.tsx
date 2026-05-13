import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";

export default function DemoLanding() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8 mt-12">
        <h1 className="text-4xl font-light">PachaNova <span className="font-bold">Demo Mirror</span></h1>
        <p className="opacity-80 text-lg">Entorno aislado institucional para pruebas seguras.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/demo/walkthrough">
            <GlassCard className="hover:bg-white/10 transition-colors cursor-pointer h-full">
              <h2 className="text-xl font-bold mb-2">Guided Walkthrough</h2>
              <p className="text-sm opacity-70">Simula paso a paso la emisión, el KYC, y el flujo de compra Genesis.</p>
            </GlassCard>
          </Link>
          
          <Link href="/demo/control-room">
            <GlassCard className="hover:bg-white/10 transition-colors cursor-pointer h-full border-blue-500/30">
              <h2 className="text-xl font-bold mb-2">Control Room</h2>
              <p className="text-sm opacity-70">Altera el estado de los proveedores (MP, Blockchain, Oracle) para simular degradaciones.</p>
            </GlassCard>
          </Link>

          <Link href="/dashboard/investor">
            <GlassCard className="hover:bg-white/10 transition-colors cursor-pointer h-full border-emerald-500/30">
              <h2 className="text-xl font-bold mb-2">Investor Dashboard</h2>
              <p className="text-sm opacity-70">Ir directo al dashboard del inversor final con la ProRataLandCard.</p>
            </GlassCard>
          </Link>

          <Link href="/dashboard/admin">
            <GlassCard className="hover:bg-white/10 transition-colors cursor-pointer h-full border-purple-500/30">
              <h2 className="text-xl font-bold mb-2">Admin Dashboard</h2>
              <p className="text-sm opacity-70">Panel de logs inmutables y balances de usuarios.</p>
            </GlassCard>
          </Link>
        </div>
      </div>
    </div>
  );
}
