import { PublicHeader, PublicFooter } from "@/components/public/LandingComponents";
import { HowItWorksSteps } from "@/components/public/ExplainerComponents";
import { SectionHeader } from "@/components/mission";

export default function ComoFuncionaPage() {
  return (
    <div className="min-h-screen bg-pn-bg text-pn-text selection:bg-pn-gold/30" data-testid="how-it-works-page">
      <PublicHeader data-testid="public-header" />
      
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-testid="main-content">
        <SectionHeader 
          eyebrow="Arquitectura"
          title="Cómo funciona PachaNova"
          description="Cómo se cofinancia un proyecto, cómo opera el administrador y cómo el cliente compra o arrienda el inmueble. Sin tokens."
        />
        
        <div className="mt-12">
          <HowItWorksSteps />
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
