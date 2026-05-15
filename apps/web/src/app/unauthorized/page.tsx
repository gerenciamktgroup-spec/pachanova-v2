import { SafeActionButton } from "@/components/mission/SafeActionButton";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center p-8 bg-pn-bg">
      <div className="p-4 bg-pn-surface-strong rounded-full border border-pn-border">
        <ShieldAlert className="w-8 h-8 text-pn-warning" />
      </div>
      <h1 className="text-xl font-medium text-pn-text">Acceso restringido</h1>
      <p className="text-sm text-pn-text-soft max-w-sm">
        No tenés permisos para acceder a esta sección.
        Iniciá sesión con una cuenta autorizada.
      </p>
      <SafeActionButton
        label="Volver al inicio"
        href="/"
        variant="outline"
      />
    </div>
  );
}
