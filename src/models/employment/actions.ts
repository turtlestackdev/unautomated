'use server';

import type { FormState } from '@/lib/validation';
import { formToObject } from '@/lib/validation';
import type { Employment } from '@/models/employment/types';
import * as employment from '@/models/employment/data';
import { employmentSchema } from '@/models/employment/validation';

type EmploymentFormState = FormState<typeof employmentSchema, Employment>;

export async function saveEmployment(
  userId: string,
  _prevState: EmploymentFormState,
  data: FormData
): Promise<EmploymentFormState> {
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
