import { PrecisionNavbar } from "../components/PrecisionNavbar";
import { PrecisionFooter } from "../components/PrecisionFooter";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { schema } from "@pachanova/database";

export const dynamic = 'force-dynamic';

async function fetchProyectos() {
  try {
    const client = postgres(process.env.DATABASE_URL!);
    const db = drizzle(client, { schema });

    const proyectos = await db.query.properties.findMany({
      orderBy: (props, { desc }) => [desc(props.createdAt)]
    });

    return proyectos;
  } catch (e) {
    console.error("Error al traer proyectos", e);
    return [];
  }
}

export default async function ProyectosPage() {
  const proyectos = await fetchProyectos();

  return (
    <main className="min-h-screen bg-[#0a111f] selection:bg-[#c5a46d]/30 selection:text-white">
      <PrecisionNavbar />
      
      <div className="pt-32 pb-24 px-6 relative max-w-7xl mx-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#c5a46d]/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
          <h1 className="text-4xl md:text-6xl font-light tracking-tighter text-white mb-6">
            Catálogo de <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#c5a46d] to-[#e8d5a5]">Activos</span>
          </h1>
          <p className="text-lg text-white/60 font-light leading-relaxed">
            Explora las oportunidades inmobiliarias exclusivas de PachaNova a lo largo de todo el Perú. 
            Tokenización respaldada por activos del mundo real (RWA).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {proyectos.map((proyecto) => (
            <div key={proyecto.id} className="group relative bg-[#0f172a] rounded-2xl overflow-hidden border border-white/10 hover:border-[#c5a46d]/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(197,164,109,0.15)] flex flex-col">
              <div className="aspect-[4/3] w-full bg-[#1a2333] relative overflow-hidden">
                {proyecto.imageUrl ? (
                  <img src={proyecto.imageUrl} alt={proyecto.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out opacity-80" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1a2333]">
                    <span className="text-white/20 tracking-widest text-sm">PACHANOVA</span>
                  </div>
                )}
                
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                    ${proyecto.status === 'trading' ? 'bg-green-500/20 text-green-400 backdrop-blur-md' : 
                      proyecto.status === 'funding' ? 'bg-blue-500/20 text-blue-400 backdrop-blur-md' : 
                      'bg-yellow-500/20 text-yellow-400 backdrop-blur-md'}`}>
                    {proyecto.status}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#c5a46d] text-xs font-semibold tracking-wider uppercase">{proyecto.propertyType}</span>
                    <span className="text-white/30">•</span>
                    <span className="text-white/50 text-xs truncate">{proyecto.location}</span>
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">{proyecto.name}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-t border-white/5">
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Precio Token</p>
                    <p className="text-lg font-light text-white">${Number(proyecto.tokenPriceUsd).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Rendimiento Est.</p>
                    <p className="text-lg font-light text-[#c5a46d]">{proyecto.annualYieldExpected}% APY</p>
                  </div>
                </div>

                <button className="w-full mt-4 bg-white/5 hover:bg-[#c5a46d] text-white hover:text-[#0a111f] font-medium py-3 rounded-xl transition-all duration-300">
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <PrecisionFooter />
    </main>
  );
}
