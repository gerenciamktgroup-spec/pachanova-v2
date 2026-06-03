import { eq, and } from "drizzle-orm";
import { schema } from "@pachanova/database";
import { db } from "@/server/db";
import { createServerClient } from "@/utils/supabase/server";

export const dynamic = 'force-dynamic';

export default async function CertificatePage(props: { params: Promise<{ propertyId: string }> }) {
  const params = await props.params;
  const propertyId = params.propertyId;

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userEmail = user?.email || "investor@pachanova.local";


  const inv = await db.query.investors.findFirst({
    where: eq(schema.investors.email, userEmail)
  });

  if (!inv) return <div>Inversor no encontrado</div>;

  const property = await db.query.properties.findFirst({
    where: eq(schema.properties.id, propertyId)
  });

  if (!property) return <div>Propiedad no encontrada</div>;

  const balance = await db.query.balances.findFirst({
    where: and(
      eq(schema.balances.investorId, inv.id),
      eq(schema.balances.propertyId, property.id)
    )
  });

  const tokensOwned = Number(balance?.availableTokens || 0) + Number(balance?.lockedTokens || 0);
  
  if (tokensOwned === 0) {
    return <div className="text-white p-8">No posees fracciones de este activo para emitir un certificado.</div>;
  }

  const certificateId = `CERT-PN-${inv.id.substring(0, 8).toUpperCase()}-${property.id.substring(0, 8).toUpperCase()}`;
  const currentDate = new Date().toLocaleDateString("es-PE", { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="bg-white min-h-screen text-black">
      {/* Non-print UI Controls */}
      <div className="print:hidden p-4 bg-[#0f172a] text-white flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-[#c5a46d]">Generador de Certificados</h2>
          <p className="text-sm text-white/50">Utiliza la función de Imprimir (Ctrl+P / Cmd+P) y guarda como PDF</p>
        </div>
        <button 
          onClick="window.print()" 
          className="bg-[#c5a46d] text-black px-6 py-2 rounded font-semibold hover:bg-[#d4b47d]"
          // In Next.js App Router, inline onClick doesn't work directly in Server Components unless passed to a Client Component,
          // but we can just use a simple `<a href="javascript:window.print()">` or create a small client wrapper.
          // We will use a script tag for simplicity in this server component.
        >
          Imprimir a PDF
        </button>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        document.querySelector('button').addEventListener('click', () => window.print());
      ` }} />

      {/* A4 Document Area */}
      <div className="max-w-[210mm] min-h-[297mm] mx-auto p-12 bg-white relative shadow-2xl print:shadow-none print:p-0">
        <div className="absolute inset-0 border-[12px] border-[#0a111f] m-8 print:m-0 pointer-events-none opacity-10"></div>
        <div className="absolute inset-0 border-2 border-[#c5a46d] m-10 print:m-2 pointer-events-none"></div>

        <div className="relative z-10 text-center space-y-8 pt-16">
          <div className="flex justify-center items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#c5a46d]" />
            <div className="text-3xl tracking-tighter text-[#0a111f]">
              <span className="font-semibold">PACHA</span>
              <span className="font-light">NOVA</span>
            </div>
          </div>

          <div className="space-y-2 mt-12">
            <h1 className="text-4xl font-bold uppercase tracking-widest text-[#0a111f]">
              Certificado de Adquisición
            </h1>
            <p className="text-[#c5a46d] font-semibold tracking-widest text-sm">
              TOKENIZACIÓN DE ACTIVOS DEL MUNDO REAL (RWA)
            </p>
          </div>

          <div className="text-left mt-16 px-12 space-y-6 text-gray-800 text-lg leading-relaxed">
            <p>
              Por la presente, <strong>PACHANOVA LANDBANKING S.A.C.</strong> certifica y acredita que:
            </p>
            <p className="text-center text-2xl font-bold text-[#0a111f] py-4">
              {inv.fullName}
            </p>
            <p>
              identificado(a) bajo el perfil KYC con estado <strong>{inv.kycStatus.toUpperCase()}</strong>, 
              es titular legítimo de <strong>{tokensOwned.toLocaleString()} tokens PACHA</strong> correspondientes al activo subyacente denominado:
            </p>
            <div className="text-center py-4 border-y border-gray-300 bg-gray-50 my-6">
              <h2 className="text-xl font-bold text-[#c5a46d]">{property.name}</h2>
              <p className="text-sm text-gray-500 uppercase tracking-wider">{property.location} • {property.propertyType}</p>
            </div>
            <p>
              Esta participación representa derechos económicos sobre el activo especificado de acuerdo con 
              la equivalencia de 1 PACHA = 0.1 m² y las normativas estipuladas en el Whitepaper de PachaNova.
            </p>
          </div>

          <div className="mt-24 grid grid-cols-2 gap-12 px-12 pt-16 border-t border-gray-200">
            <div className="text-left space-y-2">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Fecha de Emisión</p>
              <p className="font-semibold text-gray-800">{currentDate}</p>
            </div>
            <div className="text-right space-y-2">
              <p className="text-xs text-gray-400 uppercase tracking-wider">ID de Certificado</p>
              <p className="font-mono text-sm font-semibold text-gray-800">{certificateId}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
