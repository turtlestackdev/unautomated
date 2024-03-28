'use server';
import type { FormResponse } from '@/lib/validation';
import { formToObject } from '@/lib/validation';
import { educationSchema } from '@/entities/education/validation';
import * as education from '@/entities/education/data';
import type { Education } from '@/entities/education/types';

type EducationFormState = FormResponse<typeof educationSchema, Education>;

export async function saveEducation(
  userId: string,
  _prevState: EducationFormState,
  data: FormData
): Promise<EducationFormState> {
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
