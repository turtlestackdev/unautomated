import type { MutableRefObject } from 'react';
import { useLayoutEffect, useRef } from 'react';

export function useLatestValue<T>(value: T): MutableRefObject<T> {
  const cache = useRef(value);

  useLayoutEffect(() => {
    cache.current = value;
  }, [value]);

  return cache;
}
