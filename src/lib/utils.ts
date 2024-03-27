import { format } from 'date-fns/fp';

export async function sleep(seconds: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type UnSaved<T extends { user_id: string; id: string }> = Optional<T, 'user_id' | 'id'>;

export function isServer(): boolean {
  return typeof window === 'undefined' || typeof document === 'undefined';
}

export function noop(): void {
  Function.prototype();
}

export function shorthandDate(startDate: Date | null, endDate: Date | null): string {
  if (!startDate && !endDate) {
    return '';
  }

  const start = startDate ? format('MMM ’yy', startDate) : '';
  if (!endDate) {
    return `${start} / present`;
  }

  const end = format(' / MMM ’yy', endDate);

  return `${start}${end}`;
}
