import { z } from 'zod';
import { optionalDateString } from '@/lib/validation';

export const objectiveSchema = z.object({
  objective: z
    .string({
      required_error: 'Objective is required',
    })
    .min(100, { message: 'Objective must be at least 100 characters' }),
  is_default_objective: z.preprocess((value) => value === 'on', z.boolean()).default(false),
});

export const jobSchema = z
  .object({
    id: z.string().optional(),
    company: z.string({ required_error: 'Company is required' }).default(''),
    title: z.string({ required_error: 'Job title is required' }).default(''),
    start_date: optionalDateString,
    end_date: optionalDateString,
    is_current_position: z.preprocess((value) => value === 'on', z.boolean()).default(false),
    description: z.string().default(''),
    highlights: z
      .string()
      .array()
      .default([])
      .transform((highlights) => highlights.filter((highlight) => highlight.trim().length > 0)),
  })
  .refine(
    (data) => {
      return !(
        data.start_date instanceof Date &&
        data.end_date instanceof Date &&
        data.end_date <= data.start_date
      );
    },
    {
      message: 'End date is after start.',
      path: ['end_date'],
    }
  );
