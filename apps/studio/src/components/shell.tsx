"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

const NAV: Record<string, { href: string; label: string }[]> = {
  admin: [
    { href: "/admin/proyectos", label: "Proyectos" },
    { href: "/admin/kyc", label: "Identidad" },
    { href: "/admin/trazabilidad", label: "Trazabilidad" },
  ],
  investor: [
    { href: "/inversor", label: "Participaciones" },
    { href: "/inversor/kyc", label: "Identidad" },
  ],
  client: [
    { href: "/cliente", label: "Operación" },
    { href: "/cliente/kyc", label: "Identidad" },
  ],
};

const ROLE_LABEL: Record<string, string> = {
  admin: "Administración",
  investor: "Inversor",
  client: "Cliente",
};

export function Shell({
  role,
  name,
  children,
}: {
  role: string;
  name: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const links = NAV[role] || NAV.investor;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen md:grid md:grid-cols-[220px_1fr]">
      <aside className="border-b md:border-b-0 md:border-r border-line px-5 py-6 flex flex-col gap-8">
        <div>
          <Link href="/" className="serif text-xl tracking-tight">PachaNova</Link>
          <p className="text-xs text-mute mt-1">{ROLE_LABEL[role] || role}</p>
        </div>
        <nav className="flex md:flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm",
                pathname === l.href || pathname.startsWith(l.href + "/")
                  ? "bg-ink text-paper"
                  : "text-mute hover:text-ink"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto text-xs text-mute">
          <p className="truncate">{name}</p>
          <button onClick={logout} className="mt-2 underline">Salir</button>
        </div>
      </aside>
      <main className="px-5 py-8 md:px-12 md:py-10 max-w-4xl">{children}</main>
    </div>
  );
}
