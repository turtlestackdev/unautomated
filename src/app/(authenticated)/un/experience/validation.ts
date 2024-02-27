import { z } from 'zod';

export const createObjectiveSchema = z.object({
  objective: z
    .string({
      required_error: 'Objective is required',
    })
    .min(100, { message: 'Objective must be at least 100 characters' }),
  is_default: z.preprocess((value) => value === 'on', z.boolean()).default(false),
});
