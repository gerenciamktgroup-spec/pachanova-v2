"use client";

const LEVEL_THRESHOLDS = [
  { level: 1, minXp: 0, name: "Pacha Explorer" },
  { level: 2, minXp: 500, name: "Inversor Activo" },
  { level: 3, minXp: 2000, name: "Pacha Whale" },
  { level: 4, minXp: 5000, name: "Socio Fundador" },
];

export default function GamificationHUD({ xp, level }: { xp: number, level: number }) {
  const currentLevelData = LEVEL_THRESHOLDS.find(t => t.level === level) || LEVEL_THRESHOLDS[0];
  const nextThreshold = LEVEL_THRESHOLDS.find(t => t.level === level + 1) || null;

  let progress = 100;
  let xpNeeded = 0;

  if (nextThreshold) {
    const range = nextThreshold.minXp - currentLevelData.minXp;
    const currentProgress = xp - currentLevelData.minXp;
    progress = Math.min(100, Math.max(0, (currentProgress / range) * 100));
    xpNeeded = nextThreshold.minXp - xp;
  }

  // Determine colors based on level
  let colors = "from-blue-500 to-indigo-500 text-blue-400";
  let bgGlow = "bg-blue-500/10 shadow-blue-500/10";
  if (level === 2) {
    colors = "from-[#c5a46d] to-amber-600 text-[#c5a46d]";
    bgGlow = "bg-[#c5a46d]/10 shadow-[#c5a46d]/10";
  } else if (level >= 3) {
    colors = "from-emerald-400 to-teal-500 text-emerald-400";
    bgGlow = "bg-emerald-500/10 shadow-emerald-500/10";
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a111f] p-6 shadow-lg ${bgGlow}`}>
      {/* Dynamic Glow */}
      <div className={`absolute -right-20 -top-20 h-40 w-40 rounded-full blur-3xl ${colors.split(' ')[0].replace('from-', 'bg-')}/20`} />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div>
          <h2 className="text-sm font-medium text-white/50 uppercase tracking-widest">Pacha Power Status</h2>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${colors}`}>
              {currentLevelData.name}
            </span>
            <span className="text-white/40 text-sm">LVL {level}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono text-white">{xp.toLocaleString()} <span className="text-sm text-white/50">XP</span></div>
          {nextThreshold && (
            <p className="text-xs text-white/40 mt-1">Faltan {xpNeeded.toLocaleString()} XP para LVL {nextThreshold.level}</p>
          )}
        </div>
      </div>

      <div className="relative h-3 w-full rounded-full bg-white/5 overflow-hidden z-10">
        <div 
          className={`absolute left-0 top-0 h-full bg-gradient-to-r ${colors} transition-all duration-1000 ease-out`}
          style={{ width: `${progress}%` }}
        />
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>
    </div>
  );
}
