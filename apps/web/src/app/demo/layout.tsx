import { Suspense } from "react";
import { MissionShell } from "@/components/mission/MissionShell";
import { MissionHeader } from "@/components/mission/MissionHeader";
import { MissionSidebar } from "@/components/mission/MissionSidebar";

export default function DemoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col min-h-screen bg-pn-bg">
          <div className="h-14 border-b border-pn-border bg-pn-bg/80" />
          <div className="flex flex-1">
            <div className="hidden lg:block w-64 border-r border-pn-border bg-pn-bg/50" />
            <main className="flex-1 p-8">
              <div className="animate-pulse space-y-4 max-w-3xl mx-auto mt-12">
                <div className="h-4 bg-pn-surface-strong rounded w-1/4" />
                <div className="h-8 bg-pn-surface-strong rounded w-1/2" />
                <div className="h-4 bg-pn-surface-strong rounded w-3/4" />
              </div>
            </main>
          </div>
        </div>
      }
    >
      <MissionShell header={<MissionHeader />} sidebar={<MissionSidebar />}>
        {children}
      </MissionShell>
    </Suspense>
  );
}
