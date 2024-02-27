import type { z, ZodType } from 'zod';

export type FormState<T extends ZodType, M> =
  | { status: 'new'; message?: never; errors?: never; model?: never }
  | {
      status: 'success';
      message: string;
      errors?: never;
      model: M;
    }
  | {
      status: 'error';
      errors: z.inferFlattenedErrors<T>;
      message?: string;
      model?: never;
    };

export const initialFormState = { status: 'new' } as const;
