import { z } from 'zod';

export const skillSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(1, { message: 'Category name is required' }),
    skill_id: z.string({}).array(),
    skill_name: z.string().min(1, { message: 'Skill name is required' }).array(),
    skill_level: z.coerce
      .number()
      .int({ message: 'Skill level should be an integer' })
      .min(1, { message: 'Skill level should be between 1 and 5' })
      .max(5, { message: 'Skill level should be between 1 and 5' })
      .array(),
    skill_sort_order: z.coerce.number().int('Sort order should be integer').min(0).array(),
  })
  .refine(
    (data) => {
      return (
        data.skill_id.length === data.skill_name.length &&
        data.skill_id.length === data.skill_level.length &&
        data.skill_id.length === data.skill_sort_order.length
      );
    },
    {
      message: 'skill properties mismatched.',
    }
  )
  .transform((data) => {
    return {
      id: data.id,
      name: data.name,
      skills: data.skill_id.map((id, index) => {
        return {
          id: id.trim() === '' ? undefined : id,
          name: data.skill_name[index] ?? '',
          level: data.skill_level[index] ?? 3,
          sort_order: data.skill_sort_order[index] ?? index,
        };
      }),
    };
  });
