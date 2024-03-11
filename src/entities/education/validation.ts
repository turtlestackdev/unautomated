import { preprocess, z } from 'zod';
import { dateString, emptyStringToUndefined } from '@/lib/validation';

export const educationSchema = z
  .object({
    id: z.string().optional(),
    school: z.string().default(''),
    degree: z
      .object({ id: z.string() })
      .transform((degree) => {
        return degree.id;
      })
      .default({ id: '' }),
    field_of_study: z.string().default(''),
    gpa: preprocess(
      emptyStringToUndefined,
      z
        .string()
        .optional()
        .transform((val) => {
          if (val) {
            return Number(val);
          }

          return undefined;
        })
    ),
    location: z.string().default(''),
    start_date: dateString({ optional: true }),
    end_date: dateString({ optional: true }),
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
