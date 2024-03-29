'use server';

import {
  type DeleteResponse,
  deleteSchema,
  type FormResponse,
  formToObject,
} from '@/lib/validation';
import type { Employment } from '@/entities/employment/types';
import * as employment from '@/entities/employment/data';
import { employmentSchema } from '@/entities/employment/validation';

type EmploymentFormState = FormResponse<typeof employmentSchema, Employment>;

export async function saveEmployment(userId: string, data: FormData): Promise<EmploymentFormState> {
  const request = employmentSchema.safeParse(formToObject(data));
  if (!request.success) {
    return { status: 'error', errors: request.error.flatten() };
  }

  try {
    const model = await employment.saveJobDetails({ ...request.data, user_id: userId });
    return {
      status: 'success',
      model,
    };
  } catch (error) {
    console.warn('Failed to insert job', error);
    return {
      status: 'error',
      errors: {
        formErrors: [],
        fieldErrors: {},
      },
    };
  }
}

export async function deleteEmployment(userId: string, data: FormData): Promise<DeleteResponse> {
  const request = deleteSchema.safeParse(Object.fromEntries(data.entries()));
  if (!request.success) {
    return { status: 'error', errors: request.error.flatten() };
  }
  try {
    await employment.deleteEmployment({ employmentId: request.data.id, userId });
    return { status: 'success', model: { id: request.data.id } };
  } catch (error) {
    console.warn('could not delete objective, error');
    return {
      status: 'error',
      errors: { formErrors: ['Could not delete objective'], fieldErrors: {} },
    };
  }
}
