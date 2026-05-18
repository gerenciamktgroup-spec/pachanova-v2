"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PERSONAS = [
  {
    key: "ana",
    name: "Ana Torres",
    role: "Inversora",
    badge: "KYC ✓",
    badgeColor: "text-pn-success",
    description: "Balance activo · Tokens PACHA · P2P",
  },
  {
    key: "diego",
    name: "Diego Ramírez",
    role: "Inversor",
    badge: "KYC Pendiente",
    badgeColor: "text-pn-warning",
    description: "Ideal para demo del flujo KYC → Genesis",
  },
  {
    key: "roberto",
    name: "Roberto Silva",
    role: "Inversor",
    badge: "KYC ✓",
    badgeColor: "text-pn-success",
    description: "Contraparte P2P para demos de mercado",
  },
] as const;

export function DemoLoginSwitcher() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  if (process.env.NEXT_PUBLIC_IS_DEMO !== "true") return null;

  const handleQuickLogin = async (persona: string) => {
    setLoading(persona);
    setError("");

    try {
      const res = await fetch("/api/demo/auth/quick-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error ?? "Error al iniciar sesión");
        return;
      }

      // Log in with Supabase Client
      const { createClient } = await import('@/utils/supabase/client');
      const supabase = createClient();
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: 'Demo2026!'
      });

      if (signInError) {
        setError("Error autenticando: " + signInError.message);
        return;
      }

      // Hard navigation ensures cookies are sent to the server
      window.location.href = "/dashboard/investor";
    } catch {
      setError("Error de red. Verifica que el servidor esté corriendo.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-pn-border">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-medium text-pn-text-muted uppercase tracking-wider">
          Acceso Demo
        </span>
        <span className="px-2 py-0.5 rounded-full text-xs bg-pn-warning/10 text-pn-warning font-medium">
          Entorno Simulado
        </span>
      </div>

      <div className="space-y-2">
        {PERSONAS.map((p) => (
          <button
            key={p.key}
            onClick={() => handleQuickLogin(p.key)}
            disabled={loading !== null}
            className="w-full flex items-center justify-between p-3 rounded-lg
                       bg-pn-surface border border-pn-border
                       hover:border-pn-gold hover:bg-pn-surface-strong
                       transition-all duration-150 text-left
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-pn-text">
                  {p.name}
                </span>
                <span className={`text-xs ${p.badgeColor}`}>
                  {p.badge}
                </span>
              </div>
              <span className="text-xs text-pn-text-muted">
                {p.description}
              </span>
            </div>
            <div className="text-xs text-pn-text-muted">
              {loading === p.key ? (
                <span className="text-pn-gold">Iniciando...</span>
              ) : (
                "→"
              )}
            </div>
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-3 text-xs text-pn-error text-center">{error}</p>
      )}

      <p className="mt-4 text-xs text-pn-text-muted text-center">
        Entorno aislado · Sin conexiones reales · Datos simulados
      </p>
    </div>
  );
}
