"use client";

import { useEffect, useState } from "react";

export default function ActivityClient({ initialLogs, stats }: { initialLogs: any[], stats: any }) {
  const [logs, setLogs] = useState<any[]>(initialLogs);
  const [liveMode, setLiveMode] = useState(true);

  useEffect(() => {
    if (!liveMode) return;

    // Conectar SSE a la ruta
    const eventSource = new EventSource("/api/superadmin/activity");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'init' && data.logs) {
           setLogs(data.logs);
        } else if (data.type === 'ping') {
           // console.log("SSE Ping");
        }
      } catch (e) {
        console.error("Error parsing SSE data", e);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      eventSource.close();
      // Simple re-connect logic can be implemented here
    };

    return () => {
      eventSource.close();
    };
  }, [liveMode]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4 mb-8">
         <div className="bg-[#0f172a] p-4 border border-gray-800 rounded">
            <p className="text-gray-500 text-xs uppercase">Total Inversores</p>
            <p className="text-2xl font-bold">{stats.investors}</p>
         </div>
         <div className="bg-[#0f172a] p-4 border border-gray-800 rounded">
            <p className="text-gray-500 text-xs uppercase">Propiedades Activas</p>
            <p className="text-2xl font-bold">{stats.properties}</p>
         </div>
         <div className="bg-[#0f172a] p-4 border border-gray-800 rounded">
            <p className="text-gray-500 text-xs uppercase">Distribuciones Procesadas</p>
            <p className="text-2xl font-bold">{stats.distributions}</p>
         </div>
      </div>

      <div className="flex justify-between items-center bg-[#0f172a] p-4 rounded-t border-b border-gray-800">
         <h2 className="text-lg font-bold">Feed de Auditoría del Sistema</h2>
         <button 
           onClick={() => setLiveMode(!liveMode)}
           className={`px-3 py-1 text-xs rounded font-bold uppercase ${liveMode ? 'bg-green-900 text-green-300' : 'bg-gray-800 text-gray-400'}`}
         >
           {liveMode ? '🟢 LIVE (SSE ACTIVO)' : '🔴 PAUSADO'}
         </button>
      </div>
      
      <div className="bg-[#0a111f] p-4 rounded-b border border-t-0 border-gray-800 max-h-[600px] overflow-y-auto">
         {logs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay logs recientes.</p>
         ) : (
            <div className="space-y-3">
               {logs.map((log) => (
                  <div key={log.id} className="p-3 bg-black/40 border border-gray-800 rounded flex gap-4 text-sm font-mono items-start">
                     <div className="text-gray-500 shrink-0 w-48">
                        {new Date(log.timestamp).toLocaleString()}
                     </div>
                     <div className={`shrink-0 w-64 font-bold ${log.action.includes('MASTER') ? 'text-red-400' : 'text-blue-400'}`}>
                        [{log.action}]
                     </div>
                     <div className="text-gray-300 break-all">
                        {JSON.stringify(log.details)}
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
    </div>
  );
}
