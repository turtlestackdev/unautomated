import { z } from 'zod';
import { dateString } from '@/lib/validation';

export const employmentSchema = z
  .object({
    id: z.string().optional(),
    company: z.string().min(1, { message: 'Company is required' }),
    title: z.string().min(1, { message: 'Job Title is required' }),
    start_date: dateString({ optional: false }),
    end_date: dateString({ optional: true }),
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
      return (
        (data.start_date instanceof Date &&
          data.end_date instanceof Date &&
          data.end_date > data.start_date) ||
        (!data.start_date && !data.end_date)
      );
    },
    {
      message: 'end date is before start.',
      path: ['end_date'],
    }
  );
