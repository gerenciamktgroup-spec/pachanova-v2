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
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <MissionShell header={<MissionHeader />} sidebar={<MissionSidebar />}>
        {children}
      </MissionShell>
    </Suspense>
  );
}
