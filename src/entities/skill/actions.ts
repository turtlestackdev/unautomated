'use server';
import {
  type DeleteResponse,
  deleteSchema,
  type FormResponse,
  formToObject,
} from '@/lib/validation';
import * as skills from '@/entities/skill/data';
import { skillSchema } from '@/entities/skill/validation';
import { type SkillGroup } from '@/entities/skill/types';

type SkillFormState = FormResponse<typeof skillSchema, SkillGroup>;

export async function saveSkillCategory(userId: string, data: FormData): Promise<SkillFormState> {
  const request = skillSchema.safeParse(formToObject(data));
  if (!request.success) {
    return { status: 'error', errors: request.error.flatten() };
  }

  try {
    const model = await skills.saveSkillCategory({ ...request.data, user_id: userId });
    return {
      status: 'success',
      model,
    };
  } catch (error) {
    console.warn('Failed to insert skill category', error);
    return {
      status: 'error',
      errors: {
        formErrors: [],
        fieldErrors: {},
      },
    };
  }
}

export async function deleteSkillCategory(userId: string, data: FormData): Promise<DeleteResponse> {
  const request = deleteSchema.safeParse(Object.fromEntries(data.entries()));
  if (!request.success) {
    return { status: 'error', errors: request.error.flatten() };
  }
  try {
    await skills.deleteSkillCategory({ categoryId: request.data.id, userId });
    return { status: 'success', model: { id: request.data.id } };
  } catch (error) {
    console.warn('could not delete skill category, error');
    return {
      status: 'error',
      errors: { formErrors: ['Could not delete skill category'], fieldErrors: {} },
    };
  }
}
