'use server';
import {
  type DeleteResponse,
  deleteSchema,
  type FormResponse,
  formToObject,
} from '@/lib/validation';
import { educationSchema } from '@/entities/education/validation';
import * as education from '@/entities/education/data';
import type { Education } from '@/entities/education/types';

type EducationFormState = FormResponse<typeof educationSchema, Education>;

export async function saveEducation(userId: string, data: FormData): Promise<EducationFormState> {
  const request = educationSchema.safeParse(formToObject(data));
  if (!request.success) {
    return { status: 'error', errors: request.error.flatten() };
  }

  try {
    const model = await education.saveEducation({ ...request.data, user_id: userId });
    return {
      status: 'success',
      model,
    };
  } catch (error) {
    console.warn('Failed to insert education', error);
    return {
      status: 'error',
      errors: {
        formErrors: [],
        fieldErrors: {},
      },
    };
  }
}

export async function deleteEducation(userId: string, data: FormData): Promise<DeleteResponse> {
  const request = deleteSchema.safeParse(Object.fromEntries(data.entries()));
  if (!request.success) {
    return { status: 'error', errors: request.error.flatten() };
  }
  try {
    await education.deleteEducation({ educationId: request.data.id, userId });
    return { status: 'success', model: { id: request.data.id } };
  } catch (error) {
    console.warn('could not delete education, error');
    return {
      status: 'error',
      errors: { formErrors: ['Could not delete education'], fieldErrors: {} },
    };
  }
}
