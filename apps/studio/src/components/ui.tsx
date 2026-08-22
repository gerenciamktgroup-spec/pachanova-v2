import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import Link from "next/link";

export function Button({
  children,
  href,
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: "primary" | "ghost" | "danger";
  children: ReactNode;
}) {
  const styles = {
    primary: "bg-clay text-white hover:opacity-90",
    ghost: "border border-line bg-card hover:bg-paper",
    danger: "bg-bad/10 text-bad",
  }[variant];
  const cls = cn("inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm transition-opacity disabled:opacity-40", styles, className);
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button className={cls} {...props}>{children}</button>;
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-line bg-card p-6", className)}>{children}</div>;
}

export function PageTitle({ kicker, title, children }: { kicker?: string; title: string; children?: React.ReactNode }) {
  return (
    <header className="mb-8 max-w-2xl">
      {kicker && <p className="text-xs uppercase tracking-[0.18em] text-mute mb-2">{kicker}</p>}
      <h1 className="text-3xl md:text-4xl leading-tight text-ink">{title}</h1>
      {children && <div className="mt-3 text-mute text-[15px] leading-relaxed">{children}</div>}
    </header>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="block text-mute mb-1.5">{label}</span>
      {children}
    </label>
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-block rounded-full border border-line px-2.5 py-0.5 text-xs text-mute">{children}</span>;
}

export function Notice({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-clay">{children}</p>;
}
