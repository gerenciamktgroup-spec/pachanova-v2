export const DEMO_IDENTITIES = {
  admin: {
    id: "00000000-0000-0000-0000-000000000001",
    email: "gerencia.mktgroup@gmail.com",
  },
  approvedInvestor: {
    id: "00000000-0000-0000-0000-000000000002",
    email: "demo.investor.approved@pachanova.local",
  },
  holderInvestor: {
    id: "00000000-0000-0000-0000-000000000123",
    email: "demo.investor.holder@pachanova.local",
  },
  pendingInvestor: {
    id: "00000000-0000-0000-0000-000000000004",
    email: "demo.investor.pending@pachanova.local",
  },
  fiduciario: {
    id: "00000000-0000-0000-0000-000000000005",
    email: "demo.fiduciario@pachanova.local",
  },
  comite: {
    id: "00000000-0000-0000-0000-000000000006",
    email: "demo.comite@pachanova.local",
  },
} as const;

export const DEFAULT_DEMO_INVESTOR = DEMO_IDENTITIES.holderInvestor;

