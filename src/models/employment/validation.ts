import { z } from 'zod';
import { optionalDateString } from '@/lib/validation';

export const employmentSchema = z
  .object({
    id: z.string().optional(),
    company: z.string().default(''),
    title: z.string().default(''),
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
