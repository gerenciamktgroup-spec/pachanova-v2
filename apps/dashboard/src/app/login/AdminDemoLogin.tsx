"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminDemoLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (process.env.NEXT_PUBLIC_IS_DEMO !== "true") return null;

  const handleLogin = async () => {
    setLoading(true);
    const res = await fetch("/api/demo/auth/quick-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ persona: "carlos" }),
    });
    const data = await res.json();
    if (data.success) {
      router.refresh();
      router.push("/dashboard/admin");
    } else {
      setLoading(false);
      console.error(data.error);
    }
  };

  return (
    <div className="mt-6 pt-5 border-t border-pn-border w-full">
      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full p-3 rounded-lg bg-pn-surface border border-pn-border
                   hover:border-pn-gold text-sm text-pn-text text-left
                   transition-all disabled:opacity-50"
      >
        <div className="flex justify-between items-center">
          <div>
            <span className="font-medium text-pn-text">Carlos Mendoza</span>
            <span className="text-xs text-pn-text-muted ml-2 block sm:inline">Admin · Operador</span>
          </div>
          <span className="text-xs text-pn-gold font-medium">
            {loading ? "Iniciando..." : "Acceso Demo →"}
          </span>
        </div>
      </button>
      <p className="mt-4 text-xs text-pn-text-muted text-center">
        Entorno simulado · Sin datos reales
      </p>
    </div>
  );
}
