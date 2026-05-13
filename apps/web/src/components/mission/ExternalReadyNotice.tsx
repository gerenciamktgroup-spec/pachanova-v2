import { ExternalLink } from "lucide-react";
import { MissionCard } from "./MissionCard";

export function ExternalReadyNotice() {
  return (
    <MissionCard variant="warning" className="flex items-center justify-between p-4">
      <div>
        <h4 className="text-sm font-semibold text-pn-warning">External Integrations Ready-but-disabled</h4>
        <p className="text-xs text-pn-warning/80 mt-1">El sistema está preparado para conexiones externas. Las credenciales deben ser inyectadas localmente por el operador de la demo.</p>
      </div>
      <ExternalLink className="w-5 h-5 text-pn-warning/50" />
    </MissionCard>
  );
}
