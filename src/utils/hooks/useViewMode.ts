'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export type ViewMode = 'morar' | 'investir';

export function useViewMode() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const mode: ViewMode = (searchParams.get('modo') as ViewMode) || 'investir';

  const setMode = useCallback(
    (newMode: ViewMode) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('modo', newMode);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  return useMemo(
    () => ({
      mode,
      setMode,
      isMorar: mode === 'morar',
      isInvestir: mode === 'investir',
    }),
    [mode, setMode]
  );
}
