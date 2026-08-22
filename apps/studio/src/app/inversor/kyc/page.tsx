import { PageTitle } from "@/components/ui";
import { KycForm } from "@/components/kyc-form";

export default function Page() {
  return (
    <div>
      <PageTitle kicker="Inversor" title="Identidad">Necesaria para aportar capital.</PageTitle>
      <KycForm blurb="Cargá un documento de identidad." />
    </div>
  );
}
