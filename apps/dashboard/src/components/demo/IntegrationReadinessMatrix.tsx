import React from 'react';

export function IntegrationModeBadge({ status, simulated }: { status: string; simulated: boolean }) {
  let color = 'bg-gray-800 text-gray-300';
  
  if (status === 'CONNECTED') color = 'bg-green-900/50 text-green-400 border border-green-800';
  else if (status === 'SIMULATED') color = 'bg-blue-900/50 text-blue-400 border border-blue-800';
  else if (status === 'PENDING_CREDENTIALS' || status === 'PENDING_DEPLOY' || status === 'PENDING_PROVIDER') 
    color = 'bg-yellow-900/50 text-yellow-400 border border-yellow-800';
  else if (status === 'DISABLED') color = 'bg-gray-800 text-gray-400 border border-gray-700';

  return (
    <div className="flex flex-col gap-1 items-end">
      <span className={`px-2 py-1 rounded text-xs font-medium tracking-wider ${color}`}>
        {status}
      </span>
      {simulated && <span className="text-[10px] text-gray-500 uppercase">Mock Mode</span>}
    </div>
  );
}

export function IntegrationReadinessMatrix({ matrix }: { matrix: Record<string, { provider: string; status: string; externalEnabled: boolean; simulated: boolean; missingEnv?: string[] }> }) {
  const keys = Object.keys(matrix);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {keys.map((key) => {
        const item = matrix[key];
        return (
          <div key={key} className="p-4 rounded-lg border border-gray-800 bg-gray-900/30 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-200 capitalize">{key}</h3>
                <p className="text-sm text-gray-500 font-mono mt-1">Provider: {item.provider}</p>
              </div>
              <IntegrationModeBadge status={item.status} simulated={item.simulated} />
            </div>
            
            <div className="text-sm">
              <div className="flex justify-between border-t border-gray-800 pt-2 mt-2">
                <span className="text-gray-500">External Sync</span>
                <span className={item.externalEnabled ? "text-green-500" : "text-gray-600"}>
                  {item.externalEnabled ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>
              {item.missingEnv && item.missingEnv.length > 0 && (
                <div className="mt-3 p-2 rounded bg-red-900/20 border border-red-900/30">
                  <span className="text-red-400 text-xs block mb-1">Missing Configuration:</span>
                  <ul className="list-disc list-inside text-red-300 text-[11px] font-mono">
                    {item.missingEnv.map((e: string) => <li key={e}>{e}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
