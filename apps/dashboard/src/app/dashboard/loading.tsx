import { Loader2 } from 'lucide-react';

export default function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-[#c5a46d] blur-xl opacity-20 animate-pulse"></div>
        <Loader2 className="w-12 h-12 text-[#c5a46d] animate-spin relative z-10" />
      </div>
      <div className="text-white/60 font-medium tracking-wide animate-pulse">
        Sincronizando con la red...
      </div>
    </div>
  );
}
