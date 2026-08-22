import { PageTitle } from "@/components/ui";
import { KycForm } from "@/components/kyc-form";

export default function Page() {
  return (
    <div>
      <PageTitle kicker="Cliente" title="Identidad">Del comprador o arrendatario.</PageTitle>
      <KycForm blurb="Cargá un documento de identidad." />
    </div>
  );
}
