import { PublicHeader, PublicFooter } from "@/components/public/LandingComponents";
import { FAQAccordion } from "@/components/public/ExplainerComponents";
import { SectionHeader } from "@/components/mission";

export default function FAQPage() {
  const faqItems = [
    {
      question: "¿Puedo hacer pagos reales aquí?",
      answer: "No. Esta plataforma opera estrictamente en un Sandbox Local. No existen conexiones a pasarelas de pago ni tarjetas de crédito, y no se te cobrarán fondos externos bajo ninguna circunstancia."
    },
    {
      question: "¿Qué representa el token PACHA?",
      answer: "PACHA es un token digital de prueba que equivale a 0.1 metros cuadrados del activo 'San Bartolo'. En esta demostración, no tiene valor financiero ni cotización externa."
    },
    {
      question: "¿Qué significa 'Pending credentials'?",
      answer: "Significa que la integración técnica (por ejemplo, con MercadoPago Sandbox) está desarrollada, pero intencionalmente se han omitido las claves de acceso por seguridad."
    },
    {
      question: "¿Qué significa 'Pending Foundry'?",
      answer: "Indica que la red blockchain local para pruebas criptográficas avanzadas (Foundry/Anvil) está desactivada. El sistema utiliza nuestra propia base de datos (Ledger Local) como reemplazo."
    },
    {
      question: "¿Esto es un entorno de producción?",
      answer: "Definitivamente no. Es un entorno de demostración técnica (Demo Mirror) diseñado para validar la interfaz de usuario, la arquitectura y los flujos sin riesgo alguno."
    },
    {
      question: "¿Qué puedo explorar ahora mismo?",
      answer: "Puedes navegar libremente por los paneles de Inversor, Administrador y Fiduciario. Puedes simular el flujo 'Genesis' para ver cómo se registraría la intención de adquisición de tokens."
    },
    {
      question: "¿Qué falta para conectar el Sandbox externo?",
      answer: "Únicamente inyectar las claves secretas (Test API Keys) en el entorno y habilitar el servicio de orquestación de blockchain local."
    }
  ];

  return (
    <div className="min-h-screen bg-pn-bg text-pn-text selection:bg-pn-gold/30" data-testid="faq-page">
      <PublicHeader />
      
      <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader 
          eyebrow="Soporte y Transparencia"
          title="Preguntas Frecuentes"
          description="Respuestas claras y directas para entender los límites de esta demostración y nuestra arquitectura de seguridad."
        />
        
        <div className="mt-12">
          <FAQAccordion items={faqItems} />
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
