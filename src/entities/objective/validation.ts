import { z } from 'zod';

export const objectiveSchema = z.object({
  id: z.string().optional(),
  objective: z.string({}).min(1, { message: 'Objective is required' }),
  is_default_objective: z.preprocess((value) => value === 'on', z.boolean()).default(false),
});
