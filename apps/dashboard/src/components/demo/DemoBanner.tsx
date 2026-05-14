export function DemoBanner() {
  const isDemo = process.env.DEMO_MODE === 'true';
  const profile = process.env.DEMO_PROFILE || 'offline';

  if (!isDemo) return null;

  return (
    <div className="w-full bg-red-600 text-white text-center text-xs py-1 font-bold tracking-widest uppercase z-50 relative shadow-md">
      DEMO / SANDBOX ({profile}) — Simulated, No production
    </div>
  );
}
