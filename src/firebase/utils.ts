
import { useMemo } from 'react';

/**
 * Stabilizes a Firebase reference or query to prevent unnecessary re-renders or infinite loops.
 */
export function useMemoFirebase<T>(factory: () => T, deps: any[]): T {
  return useMemo(factory, deps);
}
