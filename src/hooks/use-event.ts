import { useCallback } from 'react';
import { useLatestValue } from '@/hooks/use-latest-value';

export function useEvent<T extends string | Date | number | boolean>(
  cb: (value: T) => void
): (value: T) => void {
  const cache = useLatestValue(cb);
  return useCallback(
    (value: T) => {
      cache.current(value);
    },
    [cache]
  );
}
