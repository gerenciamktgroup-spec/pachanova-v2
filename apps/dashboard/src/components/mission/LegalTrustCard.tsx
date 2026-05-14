import { ShieldCheck } from "lucide-react";
import { MissionCard } from "./MissionCard";

export function LegalTrustCard() {
  return (
    <MissionCard className="bg-pn-blue/5 border-pn-blue/20 flex gap-4 items-start">
      <div className="p-2 bg-pn-blue/10 rounded-lg text-pn-blue shrink-0">
        <ShieldCheck className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-pn-text mb-1">Estructura Legal Fiduciaria</h4>
        <p className="text-xs text-pn-text-muted leading-relaxed">
          El fideicomiso PachaNova mantiene custodia sobre el inmueble matriz de 50,000 m². 
          La emisión Genesis está limitada a 500,000 PACHA. Ningún token confiere propiedad directa del terreno, sino derechos económicos proporcionales sujetos al contrato fiduciario de administración.
        </p>
      </div>
    </MissionCard>
  );
}
