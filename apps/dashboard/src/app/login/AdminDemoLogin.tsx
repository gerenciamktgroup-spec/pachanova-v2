"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminDemoLogin() {
  const router = useRouter();
  const [activePersona, setActivePersona] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Eliminamos la restricción temporalmente para permitir Demo en Vercel de manera directa
  // if (process.env.NEXT_PUBLIC_IS_DEMO !== "true") return null;

  const handleLogin = async (persona: "admin" | "investor" | "client") => {
    setLoading(true);
    setActivePersona(persona);
    try {
      const res = await fetch("/api/demo/auth/quick-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona }),
      });
      const data = await res.json();
      if (data.success) {
        router.refresh();
        router.push(data.redirectTo || "/dashboard");
      } else {
        setLoading(false);
        setActivePersona(null);
        console.error(data.error);
      }
    } catch (err) {
      setLoading(false);
      setActivePersona(null);
      console.error(err);
    }
  };

  return (
    <div className="mt-6 pt-5 border-t border-pn-border w-full flex flex-col gap-3">
      <div className="text-xs font-semibold text-pn-gold tracking-wider uppercase mb-1">
        Accesos Rápidos Demo
      </div>
      
      {/* Button for Admin / Operador */}
      <button
        onClick={() => handleLogin("admin")}
        disabled={loading}
        className="w-full p-3 rounded-lg bg-pn-surface/50 border border-pn-border
                   hover:border-pn-gold/60 hover:bg-pn-surface-strong/60 text-sm text-pn-text text-left
                   transition-all duration-200 disabled:opacity-50 cursor-pointer"
      >
        <div className="flex justify-between items-center">
          <div>
            <span className="font-medium text-pn-text">Carlos Mendoza</span>
            <span className="text-[10px] bg-pn-gold/10 text-pn-gold px-2 py-0.5 rounded border border-pn-gold/20 ml-2 inline-block">
              Admin · Operador
            </span>
          </div>
          <span className="text-xs text-pn-gold font-medium">
            {loading && activePersona === "admin" ? "Iniciando..." : "Acceder →"}
          </span>
        </div>
      </button>

      {/* Button for Investor / Holder */}
      <button
        onClick={() => handleLogin("investor")}
        disabled={loading}
        className="w-full p-3 rounded-lg bg-pn-surface/50 border border-pn-border
                   hover:border-pn-gold/60 hover:bg-pn-surface-strong/60 text-sm text-pn-text text-left
                   transition-all duration-200 disabled:opacity-50 cursor-pointer"
      >
        <div className="flex justify-between items-center">
          <div>
            <span className="font-medium text-pn-text">Demo Holder</span>
            <span className="text-[10px] bg-pn-blue/10 text-pn-blue px-2 py-0.5 rounded border border-pn-blue/20 ml-2 inline-block">
              Inversor
            </span>
          </div>
          <span className="text-xs text-pn-gold font-medium">
            {loading && activePersona === "investor" ? "Iniciando..." : "Acceder →"}
          </span>
        </div>
      </button>

      <button
        onClick={() => handleLogin("client")}
        disabled={loading}
        className="w-full p-3 rounded-lg bg-pn-surface/50 border border-pn-border
                   hover:border-pn-gold/60 hover:bg-pn-surface-strong/60 text-sm text-pn-text text-left
                   transition-all duration-200 disabled:opacity-50 cursor-pointer"
      >
        <div className="flex justify-between items-center">
          <div>
            <span className="font-medium text-pn-text">Cliente Demo</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 ml-2 inline-block">
              Comprador / arrendatario
            </span>
          </div>
          <span className="text-xs text-pn-gold font-medium">
            {loading && activePersona === "client" ? "Iniciando..." : "Acceder →"}
          </span>
        </div>
      </button>

      <p className="mt-4 text-[10px] text-pn-text-muted text-center italic">
        Demo local contra la base nueva de cofinanciamiento
      </p>
    </div>
  );
}
