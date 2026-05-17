import { Suspense } from "react";
import { MissionShell } from "@/components/mission/MissionShell";
import { MissionHeader } from "@/components/mission/MissionHeader";
import { MissionSidebar } from "@/components/mission/MissionSidebar";
import { LoadingState } from "@/components/mission/StateComponents";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MissionShell header={<MissionHeader />} sidebar={<MissionSidebar />}>
      <Suspense fallback={<LoadingState message="Cargando dashboard..." />}>
        {children}
      </Suspense>
    </MissionShell>
  );
}
