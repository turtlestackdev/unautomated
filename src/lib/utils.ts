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
