'use client';

export function useDemoMode() {
  const isDemo = process.env.NEXT_PUBLIC_IS_DEMO === 'true';
  return {
    isDemo,
    modeName: isDemo ? 'Demo Mirror' : 'Production',
  };
}
