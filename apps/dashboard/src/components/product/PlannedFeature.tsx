import Link from "next/link";

type PlannedFeatureProps = {
  title: string;
  summary: string;
  phase: string;
  backHref: string;
  backLabel: string;
};

export function PlannedFeature({
  title,
  summary,
  phase,
  backHref,
  backLabel,
}: PlannedFeatureProps) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 text-white">
      <div className="max-w-md w-full text-center p-8 rounded-3xl border border-white/10 bg-[#0f172a]/80">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#c5a46d] mb-3">{phase}</p>
        <h2 className="text-2xl font-bold tracking-tight mb-2">{title}</h2>
        <p className="text-sm text-white/60 mb-6 leading-relaxed">{summary}</p>
        <Link href={backHref} className="text-sm text-white/70 hover:text-white underline underline-offset-4">
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
