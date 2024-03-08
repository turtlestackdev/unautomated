'use server';
import type { FormState } from '@/lib/validation';
import { formToObject } from '@/lib/validation';
import { educationSchema } from '@/models/education/validation';
import * as education from '@/models/education/data';
import type { Education } from '@/models/education/types';

type EducationFormState = FormState<typeof educationSchema, Education>;

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
