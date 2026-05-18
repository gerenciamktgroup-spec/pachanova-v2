'use client';

import { ReactNode } from 'react';
import { DemoToastProvider, useToast } from '@/components/product/DemoToastProvider';
import { RealtimeNotifications } from '@/components/product/RealtimeNotifications';

function ShellInner({ investorId, children }: { investorId: string; children: ReactNode }) {
  const { toast } = useToast();
  return (
    <>
      <RealtimeNotifications investorId={investorId} toast={toast} />
      {children}
    </>
  );
}

export function InvestorDashboardShell({ investorId, children }: { investorId: string; children: ReactNode }) {
  return (
    <DemoToastProvider>
      <ShellInner investorId={investorId}>{children}</ShellInner>
    </DemoToastProvider>
  );
}
