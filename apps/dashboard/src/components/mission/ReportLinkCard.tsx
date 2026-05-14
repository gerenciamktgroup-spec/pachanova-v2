import { FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { MissionCard } from "./MissionCard";

export function ReportLinkCard({ title, desc, href }: { title: string, desc: string, href: string }) {
  return (
    <Link href={href} className="block group">
      <MissionCard variant="elevated" className="flex items-center gap-4 p-4 transition-colors hover:border-pn-blue/50">
        <div className="p-2 bg-pn-surface-strong rounded-md text-pn-text-muted group-hover:text-pn-blue transition-colors">
          <FileText className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-pn-text group-hover:text-pn-blue transition-colors">{title}</h4>
          <p className="text-xs text-pn-text-soft mt-0.5">{desc}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-pn-text-soft opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
      </MissionCard>
    </Link>
  );
}
