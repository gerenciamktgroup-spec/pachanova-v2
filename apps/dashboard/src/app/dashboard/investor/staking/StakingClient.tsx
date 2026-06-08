"use client";

import { useState } from "react";
import { Lock, Unlock, Zap, Shield, ChevronRight } from "lucide-react";
import { stakeTokens, unstakeTokens } from "@/app/actions/staking";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function StakingClient({ liquidTokens, stakedTokens }: { liquidTokens: number, stakedTokens: number }) {
  const [activeTab, setActiveTab] = useState<"stake" | "unstake">("stake");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const qty = parseFloat(amount);
    
    let res;
    if (activeTab === "stake") {
      res = await stakeTokens(qty);
    } else {
      res = await unstakeTokens(qty);
    }
    
    setIsSubmitting(false);
    if (res.success) {
      toast.success(activeTab === "stake" ? "Tokens bloqueados en Staking" : "Tokens retirados del Staking");
      setAmount("");
      router.refresh();
    } else {
      toast.error("Error", { description: res.error });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Panel Izquierdo: Formularios */}
      <div className="col-span-2 space-y-6">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="text-white/50 text-sm mb-1 flex items-center gap-2">
              <Unlock className="w-4 h-4" /> PACHA Líquidos
            </div>
            <div className="text-2xl font-bold text-white">{liquidTokens.toLocaleString()}</div>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/20 blur-xl rounded-full"></div>
            <div className="text-purple-400 text-sm mb-1 flex items-center gap-2 relative z-10">
              <Lock className="w-4 h-4" /> PACHA en Staking
            </div>
            <div className="text-2xl font-bold text-purple-400 relative z-10">{stakedTokens.toLocaleString()}</div>
          </div>
        </div>

        {/* Action Box */}
        <div className="bg-black/20 border border-white/10 rounded-xl p-1">
          <div className="flex">
            <button
              onClick={() => setActiveTab("stake")}
              className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all ${
                activeTab === "stake" ? "bg-purple-500/20 text-purple-400" : "text-white/50 hover:text-white"
              }`}
            >
              Staking (Bloquear)
            </button>
            <button
              onClick={() => setActiveTab("unstake")}
              className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all ${
                activeTab === "unstake" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
              }`}
            >
              Unstake (Retirar)
            </button>
          </div>

          <form onSubmit={handleAction} className="p-5 space-y-5">
            <div>
              <label className="text-sm text-white/70 mb-2 block">
                Cantidad a {activeTab === "stake" ? "bloquear" : "retirar"}
              </label>
              <div className="relative">
                <input 
                  type="number"
                  min="1"
                  max={activeTab === "stake" ? liquidTokens : stakedTokens}
                  step="0.01"
                  required
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setAmount(activeTab === "stake" ? liquidTokens.toString() : stakedTokens.toString())}
                  className="absolute right-3 top-3 text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded hover:bg-purple-500/20 transition-colors"
                >
                  MAX
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !amount}
              className={`w-full py-3 rounded-lg font-semibold flex justify-center items-center gap-2 transition-all disabled:opacity-50 ${
                activeTab === "stake" 
                ? "bg-purple-500 hover:bg-purple-600 text-white" 
                : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {activeTab === "stake" ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  Confirmar {activeTab === "stake" ? "Staking" : "Unstake"}
                </>
              )}
            </button>
          </form>
        </div>

      </div>

      {/* Panel Derecho: Beneficios */}
      <div className="space-y-4">
        <div className="bg-white/5 border border-[#c5a46d]/30 rounded-xl p-6">
          <h3 className="text-[#c5a46d] font-semibold flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5" /> Beneficios del Staking
          </h3>
          <ul className="space-y-4 text-sm text-white/70">
            <li className="flex gap-3">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#c5a46d] shrink-0" />
              <p><strong>Poder de Voto (1.5x):</strong> Los tokens bloqueados tienen un 50% extra de peso en la Gobernanza.</p>
            </li>
            <li className="flex gap-3">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#c5a46d] shrink-0" />
              <p><strong>Seguridad:</strong> Reduce la volatilidad en el mercado secundario al reducir la oferta líquida.</p>
            </li>
            <li className="flex gap-3">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#c5a46d] shrink-0" />
              <p><strong>Acelerador de Yield:</strong> (Próximamente) Multiplicador activo sobre los dividendos generados por las bóvedas agrícolas.</p>
            </li>
          </ul>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
           <h3 className="text-white font-medium flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-white/50" /> Audited Contract
          </h3>
          <p className="text-xs text-white/40 leading-relaxed mb-4">
            El mecanismo de Staking de PachaNova está protegido mediante contratos inteligentes de Escrow en el registro contable inmutable. No hay periodo de "cooldown" (puedes retirar cuando desees).
          </p>
          <a href="#" className="text-[#c5a46d] text-xs hover:underline flex items-center gap-1">
            Ver auditoría en explorador <ChevronRight className="w-3 h-3" />
          </a>
        </div>
      </div>

    </div>
  );
}
