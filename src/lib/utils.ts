export async function sleep(seconds: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
