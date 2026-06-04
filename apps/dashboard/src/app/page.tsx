import { PublicHeader } from "@/components/public/LandingComponents";
import { HeroSection, BentoGrid, DarkFooter } from "@/components/public/LandingAnimated";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30 font-sans" data-testid="landing-page">
      {/* Mantenemos el header público (con demo ribbon) */}
      <PublicHeader />

      <main className="w-full">
        {/* Sección Hero Animada (Grok/Google aesthetic) */}
        <HeroSection />

        {/* Malla Bento Asimétrica con Microinteracciones */}
        <BentoGrid />
      </main>

      {/* Footer minimalista adaptado al modo oscuro ultra */}
      <DarkFooter />
    </div>
  );
}
