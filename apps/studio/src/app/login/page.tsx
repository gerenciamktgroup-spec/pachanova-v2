"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

const ROLES = [
  { id: "admin", title: "Administrador", hint: "Operar proyectos" },
  { id: "investor", title: "Inversor", hint: "Cofinanciar" },
  { id: "client", title: "Cliente", hint: "Comprar o arrendar" },
];

export default function LoginPage() {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function enter(id: string) {
    setBusy(id);
    setError(null);
    const res = await fetch("/api/auth/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ persona: id }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "No se pudo entrar");
      setBusy(null);
      return;
    }
    router.push(data.redirectTo);
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="serif text-2xl">PachaNova</Link>
        <h1 className="text-3xl mt-8 mb-2">Entrar</h1>
        <p className="text-mute text-sm mb-8">Elegí el rol. Esta sesión usa la base local de cofinanciamiento.</p>
        {error && <p className="text-sm text-bad mb-4">{error}</p>}
        <div className="space-y-2">
          {ROLES.map((r) => (
            <button
              key={r.id}
              onClick={() => enter(r.id)}
              disabled={!!busy}
              className="w-full text-left border border-line rounded-xl px-4 py-3 bg-card hover:border-ink disabled:opacity-50"
            >
              <span className="block text-sm">{busy === r.id ? "Entrando…" : r.title}</span>
              <span className="text-xs text-mute">{r.hint}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
